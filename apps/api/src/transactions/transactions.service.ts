import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PlaidService } from "@budgeting/plaid";
import { PlaidTransactionsResponse } from "@budgeting/plaid";
import { AccessToken, AccountTransaction, Prisma, SyncEvent, SyncEventStatus } from "@prisma/client";
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

  public async enrichTransactions(): Promise<void> {
    this.logger.log('Starting transaction enrichment process.');
    const transactionsToEnrich = await this.prismaService.accountTransaction.findMany({
      where: { merchantId: null },
      // Optionally, add a take here to limit the number of transactions processed at once
      // take: 100, 
    });

    this.logger.debug(`Found ${transactionsToEnrich.length} transactions to enrich.`);

    for (const transaction of transactionsToEnrich) {
      try {
        this.logger.debug(`Enriching transaction ${transaction.id}`);
        const enrichedPlaidTransaction = await this.plaidService.enrichTransaction(transaction);

        // Using top-level properties from ClientProvidedEnrichedTransaction based on Plaid docs
        const plaidMerchantName = enrichedPlaidTransaction.enrichments.merchant_name;
        const plaidEntityId = enrichedPlaidTransaction.enrichments.entity_id;
        const plaidLogoUrl = enrichedPlaidTransaction.enrichments.logo_url;
        const plaidWebsite = enrichedPlaidTransaction.enrichments.website;

        if (plaidMerchantName && plaidEntityId) {
          // Ensure prisma generate has run for plaidEntityId to be recognized in MerchantWhereUniqueInput
          const merchant = await this.prismaService.merchant.upsert({
            where: { plaidEntityId: plaidEntityId }, 
            update: {
              merchantName: plaidMerchantName,
              logoUrl: plaidLogoUrl,
              website: plaidWebsite,
            },
            create: {
              plaidEntityId: plaidEntityId,
              merchantName: plaidMerchantName,
              logoUrl: plaidLogoUrl,
              website: plaidWebsite,
            },
          });

          await this.prismaService.accountTransaction.update({
            where: { id: transaction.id },
            data: { merchantId: merchant.id },
          });
          this.logger.debug(`Successfully enriched transaction ${transaction.id} and linked to merchant ${merchant.id} (${plaidMerchantName})`);
        } else {
          this.logger.warn(`Enrichment did not return sufficient merchant details (name or entity_id) for transaction ${transaction.id}. Name: ${plaidMerchantName}, Entity ID: ${plaidEntityId}`);
        }
      } catch (error) {
        this.logger.error(`Error enriching transaction ${transaction.id}: ${error.message}`, error.stack);
      }
    }
    this.logger.log('Transaction enrichment process completed.');
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
      this.logger.log(`Sync for accessToken ${newAccessToken.id} (syncEvent ${syncEvent.id}) completed.`);
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
    this.logger.debug(`Processing ${totalTransactions} transactions for syncEvent ${syncEvent.id}`);

    // Create new transactions
    this.logger.debug(`Creating ${plaidTransactions.transactionsAdded.length} new transactions`);
    for (const plaidTransaction of plaidTransactions.transactionsAdded) {
      let merchantIdForDb: string | null = null;
      if (plaidTransaction.merchant_entity_id) {
        try {
          const merchant = await this.prismaService.merchant.upsert({
            where: { plaidEntityId: plaidTransaction.merchant_entity_id },
            create: {
              plaidEntityId: plaidTransaction.merchant_entity_id,
              merchantName: plaidTransaction.merchant_name, // merchant_name from Plaid sync, can be null
            },
            update: {
              ...(plaidTransaction.merchant_name && { merchantName: plaidTransaction.merchant_name }),
            },
          });
          merchantIdForDb = merchant.id;
        } catch (error) {
          this.logger.error(`Error upserting merchant with plaidEntityId ${plaidTransaction.merchant_entity_id}: ${error.message}`, error.stack);
        }
      }

      try {
        await this.prismaService.accountTransaction.upsert({
          where: { id: plaidTransaction.transaction_id },
          create: {
            id: plaidTransaction.transaction_id,
            accountId,
            connectedAccountId: plaidTransaction.account_id,
            amount: plaidTransaction.amount,
            name: plaidTransaction.name,
            authorizedDate: plaidTransaction.authorized_date ? new Date(plaidTransaction.authorized_date) : null,
            date: plaidTransaction.date ? new Date(plaidTransaction.date) : null,
            checkNumber: plaidTransaction.check_number,
            currencyCode: plaidTransaction.iso_currency_code,
            paymentChannel: plaidTransaction.payment_channel,
            pending: plaidTransaction.pending,
            plaidCategoryPrimary: plaidTransaction.personal_finance_category?.primary,
            plaidCategoryDetail: plaidTransaction.personal_finance_category?.detailed,
            syncEventId: syncEvent.id,
            merchantId: merchantIdForDb,
          },
          update: {
            amount: plaidTransaction.amount,
            name: plaidTransaction.name,
            authorizedDate: plaidTransaction.authorized_date ? new Date(plaidTransaction.authorized_date) : null,
            date: plaidTransaction.date ? new Date(plaidTransaction.date) : null,
            checkNumber: plaidTransaction.check_number,
            currencyCode: plaidTransaction.iso_currency_code,
            paymentChannel: plaidTransaction.payment_channel,
            pending: plaidTransaction.pending,
            plaidCategoryPrimary: plaidTransaction.personal_finance_category?.primary,
            plaidCategoryDetail: plaidTransaction.personal_finance_category?.detailed,
            syncEventId: syncEvent.id,
            merchantId: merchantIdForDb,
          }
        });
      } catch (error) {
        this.logger.error(`Error creating transaction ${plaidTransaction.transaction_id}: ${error.message}`, error.stack);
      }
    }

    // Update existing transactions
    this.logger.debug(`Updating ${plaidTransactions.transactionsModified.length} modified transactions`);
    for (const plaidTransaction of plaidTransactions.transactionsModified) {
      const updateData: Prisma.AccountTransactionUpdateInput = {
        date: plaidTransaction.date ? new Date(plaidTransaction.date) : undefined,
        pending: plaidTransaction.pending,
        plaidCategoryPrimary: plaidTransaction.personal_finance_category?.primary,
        plaidCategoryDetail: plaidTransaction.personal_finance_category?.detailed,
        amount: plaidTransaction.amount,
        name: plaidTransaction.name,
        authorizedDate: plaidTransaction.authorized_date ? new Date(plaidTransaction.authorized_date) : undefined,
        checkNumber: plaidTransaction.check_number,
        currencyCode: plaidTransaction.iso_currency_code,
        syncEvent: { connect: { id: syncEvent.id } },
      };

      if (plaidTransaction.merchant_entity_id) {
        try {
          const merchant = await this.prismaService.merchant.upsert({
            where: { plaidEntityId: plaidTransaction.merchant_entity_id },
            create: {
              plaidEntityId: plaidTransaction.merchant_entity_id,
              merchantName: plaidTransaction.merchant_name,
            },
            update: {
              ...(plaidTransaction.merchant_name && { merchantName: plaidTransaction.merchant_name }),
            },
          });
          updateData.merchant = { connect: { id: merchant.id } };
        } catch (error) {
          this.logger.error(`Error upserting merchant for modified transaction ${plaidTransaction.transaction_id} with plaidEntityId ${plaidTransaction.merchant_entity_id}: ${error.message}`, error.stack);
        }
      } else {
        // If you want to explicitly disconnect a merchant if plaidTransaction.merchant_entity_id is null:
        // updateData.merchant = { disconnect: true };
      }

      try {
        await this.prismaService.accountTransaction.update({
          where: { id: plaidTransaction.transaction_id },
          data: updateData,
        });
      } catch (error) {
        this.logger.error(`Error updating transaction ${plaidTransaction.transaction_id}: ${error.message}`, error.stack);
      }
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
