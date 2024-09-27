import { Injectable, Logger } from "@nestjs/common";
import {
  PlaidApi,
  PlaidEnvironments,
  Configuration,
  CountryCode,
  Products,
  Transaction,
  RemovedTransaction,
} from "plaid";
import { ConfigService } from "@nestjs/config";
import { AccountBase } from "plaid";

export interface PlaidTransactionsResponse {
  cursor?: string;
  has_more: boolean;
  transactionsAdded: Transaction[];
  transactionsRemoved: RemovedTransaction[];
  transactionsModified: Transaction[];
}

@Injectable()
export class PlaidService {
  private plaidClient: PlaidApi;
  private readonly logger = new Logger(PlaidService.name);

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.logger.log('Initializing Plaid client');
    this.plaidClient = new PlaidApi(this.plaidClientConfiguration());
  }

  public async fetchTransactions({
    accessToken,
    cursor,
  }: {
    accessToken: string,
    cursor?: string,
  }): Promise<PlaidTransactionsResponse> {
    const transactionsResponse = await this.plaidClient.transactionsSync({
      access_token: accessToken,
      cursor: cursor,
    });

    const transactionsAdded = transactionsResponse.data.added;
    const transactionsRemoved = transactionsResponse.data.removed;
    const transactionsModified = transactionsResponse.data.modified;

    return {
      cursor: transactionsResponse.data.next_cursor,
      has_more: transactionsResponse.data.has_more,
      transactionsAdded,
      transactionsRemoved,
      transactionsModified,
    };
  }

  public async createLinkToken(userId: string): Promise<string> {
    this.logger.debug(`Creating link token for user ${userId.substring(0, 7)}`);

    const linkToken = await this.plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Budgeting',
      language: 'en',
      country_codes: [CountryCode.Us],
      products: [Products.Transactions],
    });

    return linkToken.data.link_token;
  }

  public async getAccounts(
    accessToken: string,
  ): Promise<{
    institutionId?: string | null;
    accounts: AccountBase[];
  }> {
    const accountsResponse = await this.plaidClient.accountsGet({
      access_token: accessToken,
    });

    return {
      institutionId: accountsResponse.data.item.institution_id,
      accounts: accountsResponse.data.accounts,
    };
  }

  public async exchangePublicToken({
    accountId,
    publicToken,
  }: {
    accountId: string;
    publicToken: string;
  }): Promise<string> {
    this.logger.debug(`Exchanging token for account ${accountId.substring(0, 7)}`);

    const exchangeResponse = await this.plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return exchangeResponse.data.access_token;
  }

  private plaidClientConfiguration(): Configuration {
    const isProduction = this.configService.get('PLAID_ENV') === 'production';
    const secret = isProduction ? this.configService.get('PLAID_SECRET_PRODUCTION') : this.configService.get('PLAID_SECRET_SANDBOX');
    const clientId = this.configService.get('PLAID_CLIENT_ID');
    const basePath = isProduction ? PlaidEnvironments['production'] : PlaidEnvironments['sandbox'];

    this.logger.log(`Plaid basePath: ${basePath}`);

    return new Configuration({
      basePath,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
  }
}
