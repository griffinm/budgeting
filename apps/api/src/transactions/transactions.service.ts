import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PlaidService } from "@budgeting/plaid";
import { ConnectedAccountsService } from "../connected-accounts/connected-accounts.service";
import { PlaidTransactionsResponse } from "@budgeting/plaid";
import { ConnectedAccountEntity } from "../connected-accounts/dto/connected-account.entity";
import { ConnectedAccount } from "@prisma/client";
import { PagedResponse } from "@budgeting/types";
import { AccountTransactionEntity } from "./dto/transaction.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  
  constructor(
    private readonly prismaService: PrismaService,
    private readonly plaidService: PlaidService,
    private readonly connectedAccountsService: ConnectedAccountsService,
  ) {}

  public async getTransactions({
    userId,
    page,
    pageSize,
    connectedAccountId,
  }: {
    userId: string;
    page: number;
    pageSize: number;
    connectedAccountId?: string;
  }): Promise<PagedResponse<AccountTransactionEntity>> {
    this.logger.log(`Getting transactions for user ${userId.toString()}`);

    const baseQuery = {
      connectedAccountId,
      connectedAccount: {
        account: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      },
    }

    const transactions = await this.prismaService.accountTransaction.findMany({
      where: baseQuery,
      orderBy: {
        date: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalRecords = await this.prismaService.accountTransaction.count({
      where: baseQuery,
    });

    return {
      data: plainToInstance(AccountTransactionEntity, transactions),
      totalRecords: transactions.length,
      currentPage: page,
      pageSize,
    };
  }

  public async syncTransactions(
    userId: string,
    connectedAccountId: string,
    cursor?: string,
  ): Promise<void> {
    this.logger.log(`Syncing transactions for user ${userId}`);

    const connectedAccount = 
      await this.connectedAccountsService.checkIfConnectedAccountBelongsToUser(userId, connectedAccountId);
    if (!connectedAccount) {
      throw new NotFoundException(`Connected account ${connectedAccountId} does not belong to user ${userId}`);
    }

    await this.updateTransactions(userId, connectedAccount, cursor);
  }

  private async updateTransactions(
    userId: string,
    connectedAccount: ConnectedAccount,
    cursor?: string,
  ) {
    // Fetch the new transactions
    const plaidTransactions: PlaidTransactionsResponse = await this.plaidService.syncTransactions(
      connectedAccount.plaidAccessToken,
      cursor,
    );

    await this.handleAccountUpdates(plaidTransactions);
    
    if (plaidTransactions.has_more) {
      // Save the cursor
      await this.connectedAccountsService.updateCursor(userId, connectedAccount.plaidAccessToken, plaidTransactions.cursor);
      await this.updateTransactions(userId, connectedAccount, plaidTransactions.cursor);
    }
  }

  private async handleAccountUpdates(plaidTransactions: PlaidTransactionsResponse) {
    const totalTransactions = 
      plaidTransactions.transactionsAdded.length + 
      plaidTransactions.transactionsModified.length + 
      plaidTransactions.transactionsRemoved.length;
    this.logger.debug(`Processing ${totalTransactions} transactions`);

    // Create new transactions
    this.logger.debug(`Creating ${plaidTransactions.transactionsAdded.length} new transactions`);
    await this.prismaService.accountTransaction.createMany({
      data: plaidTransactions.transactionsAdded.map((transaction) => ({
        id: transaction.transaction_id,
        connectedAccountId: transaction.account_id,
        amount: transaction.amount,
        name: transaction.name,
        authorizedDate: new Date(transaction.authorized_date),
        date: new Date(transaction.date),
        checkNumber: transaction.check_number,
        currencyCode: transaction.iso_currency_code,
        paymentChannel: transaction.payment_channel,
        pending: transaction.pending,
        plaidCategoryPrimary: transaction.personal_finance_category.primary,
        plaidCategoryDetail: transaction.personal_finance_category.detailed,
      })),
    });

    // Update existing transactions
    this.logger.debug(`Updating ${plaidTransactions.transactionsModified.length} modified transactions`);
    for (const transaction of plaidTransactions.transactionsModified) {
      await this.prismaService.accountTransaction.update({
        where: {
          id: transaction.transaction_id,
        },
        data: {
          date: new Date(transaction.date),
          pending: transaction.pending,
          plaidCategoryPrimary: transaction.personal_finance_category.primary,
          plaidCategoryDetail: transaction.personal_finance_category.detailed,
          amount: transaction.amount,
          name: transaction.name,
          authorizedDate: new Date(transaction.authorized_date),
          checkNumber: transaction.check_number,
          currencyCode: transaction.iso_currency_code,
        },
      });
    }

    // Remove deleted transactions
    this.logger.debug(`Removing ${plaidTransactions.transactionsRemoved.length} deleted transactions`);
    for (const transaction of plaidTransactions.transactionsRemoved) {
      await this.prismaService.accountTransaction.delete({
        where: {
          id: transaction.transaction_id,
        },
      });
    }

    this.logger.debug(`Sync complete`);
  }
}
