import { Injectable, Logger } from "@nestjs/common";
import {
  PlaidApi,
  PlaidEnvironments,
  Configuration,
  CountryCode,
  Products,
} from "plaid";
import { ConfigService } from "@nestjs/config";
import { AccountBase } from "plaid";
import { format } from "date-fns";

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

  public async createLinkToken(userId: string): Promise<string> {
    this.logger.debug(`Creating link token for user ${userId.substring(0, 7)}`);

    this.plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Budgeting',
      language: 'en',
      country_codes: [CountryCode.Us],
      products: [Products.Transactions, Products.Auth],
    }).catch((err) => {
      debugger
      this.logger.error(`Error creating link token: ${err}`);
      throw err;
  });

    const linkToken = await this.plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'Budgeting',
      language: 'en',
      country_codes: [CountryCode.Us],
      products: [Products.Transactions, Products.Auth],
    });

    return linkToken.data.link_token;
  }

  public async getAccounts(
    accessToken: string,
  ): Promise<{
    institutionId?: string | null;
    accounts: AccountBase[];
  }> {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const accountsResponse = await this.plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: format(endDate, 'yyyy-MM-dd'),
    });

    return {
      institutionId: accountsResponse.data.item.institution_id,
      accounts: accountsResponse.data.accounts,
    };
  }

  public async exchangeToken(
    userId: string, 
    accessToken: string,
  ): Promise<string> {
    this.logger.debug(`Exchanging token for user ${userId.substring(0, 7)}`);
    const exchangeResponse = await this.plaidClient.itemPublicTokenExchange({
      public_token: accessToken,
    });
    return exchangeResponse.data.access_token;
  }

  private plaidClientConfiguration(): Configuration {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const basePath = isProduction ? PlaidEnvironments['production'] : PlaidEnvironments['sandbox'];
    this.logger.log(`Plaid basePath: ${basePath}`);
    debugger
    return new Configuration({
      basePath,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.configService.get('PLAID_CLIENT_ID'),
          'PLAID-SECRET': this.configService.get('PLAID_SECRET'),
        },
      },
    });
  }
}
