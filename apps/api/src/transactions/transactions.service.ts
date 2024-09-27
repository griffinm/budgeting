import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PlaidService } from "@budgeting/plaid";
import { PlaidTransactionsResponse } from "@budgeting/plaid";
import { AccessToken, AccountTransaction, SyncEvent, SyncEventStatus } from "@prisma/client";
import { PagedResponse } from "@budgeting/types";
import { TransactionFilter } from "./dto/transaction-filter";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  
  constructor(
    private readonly prismaService: PrismaService,
    private readonly plaidService: PlaidService,
  ) {}

  public async findAllForAccount({
    accountId,
    page = 1,
    pageSize = 10,
    filter,
  }: {
    accountId: string;
    page: number;
    pageSize: number;
    filter: TransactionFilter;
  }): Promise<PagedResponse<AccountTransaction>> {
    this.logger.debug(`Finding all transactions for account ${accountId.substring(0, 7)}`);

    const transactions = await this.prismaService.accountTransaction.findMany({
      where: { 
        accountId,
        ...(filter.connectedAccountId && { connectedAccountId: filter.connectedAccountId }),
      },
      include: {
        connectedAccount: true,
      },
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize.toString()),
      orderBy: {
        date: "desc",
      },
    });

    const totalRecords = await this.prismaService.accountTransaction.count({
      where: { 
        accountId,
        ...(filter.connectedAccountId && { connectedAccountId: filter.connectedAccountId }),
      },

    });

    return {
      data: transactions,
      totalRecords,
      currentPage: page,
      pageSize,
    };
  }

  public async syncTransactions({
    accountId
  }: {
    accountId: string;
  }): Promise<void> {
    this.logger.log(`Syncing transactions for user ${accountId.substring(0, 7)}`);

    // Find all of the auth tokens for this account
    // More than one account can share the same token and using one token will return
    // transaction info for all of the accounts associated with that token
    const accessTokens = await this.prismaService.accessToken.findMany({
      where: {
        accountId,
      },
    });

    for (const accessToken of accessTokens) {
      // Create a new sync event
      const syncEvent = await this.prismaService.syncEvent.create({
        data: {
          accessTokenId: accessToken.id,
          status: SyncEventStatus.STARTED,
        },
      });

      await this.updateTransactions({
        accessToken,
        syncEvent,
        accountId,
      });
    }
  }

  private async updateTransactions({
    accessToken,  
    syncEvent,
    accountId,
  }: {
    accessToken: AccessToken,
    syncEvent: SyncEvent,
    accountId: string,
  }): Promise<void> {
    // Fetch the new transactions
    const plaidTransactions: PlaidTransactionsResponse = await this.plaidService.fetchTransactions({
      accessToken: accessToken.token,
      cursor: accessToken.nextCursor,
    });
    
    // Save the cursor
    const newAccessToken = await this.prismaService.accessToken.update({
      where: { id: accessToken.id },
      data: { nextCursor: plaidTransactions.cursor },
    });

    await this.handleAccountUpdates({ plaidTransactions, syncEvent, accountId });
    
    
    if (plaidTransactions.has_more) {
      // There are more transactions to fetch, so recursively call this function
      await this.updateTransactions({ accessToken: newAccessToken, syncEvent, accountId });
    } else {
      // There are no more transactions to fetch, so update the sync event status
      await this.prismaService.syncEvent.update({
        where: { id: syncEvent.id },
        data: { 
          status: SyncEventStatus.COMPLETED,
          endedAt: new Date(),
        },
      });
    }
  }

  private async handleAccountUpdates({
    plaidTransactions,
    syncEvent,
    accountId,
  }: {
    plaidTransactions: PlaidTransactionsResponse,
    syncEvent: SyncEvent,
    accountId: string,
  }) {
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
        accountId,
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
        syncEventId: syncEvent.id,
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
          syncEventId: syncEvent.id,
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
