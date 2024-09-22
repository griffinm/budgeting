import { Injectable, Logger } from "@nestjs/common";
import {
  PlaidApi,
  PlaidEnvironments,
  Configuration,
  CountryCode,
  Products,
} from "plaid";
import { ConfigService } from "@nestjs/config";

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

  private plaidClientConfiguration(): Configuration {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const basePath = isProduction ? PlaidEnvironments['production'] : PlaidEnvironments['sandbox'];
    this.logger.log(`Plaid basePath: ${basePath}`);

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
