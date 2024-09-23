import { Injectable } from "@nestjs/common";
import { ConnectedAccountEntity } from "./dto/connected-account.entity";
import { PrismaService } from "../prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";
import { ExchangeTokenDto } from "./dto/exchange-token.dto";
import { PlaidService } from "@budgeting/plaid";

@Injectable()
export class ConnectedAccountsService {
  private readonly logger = new Logger(ConnectedAccountsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly plaidService: PlaidService,
  ) {}

  async findAll(userId: string): Promise<ConnectedAccountEntity[]> {
    this.logger.debug(`Finding all connected accounts for user ${userId.substring(0, 7)}`);
    const connectedAccounts = await this.prisma.connectedAccount.findMany({
      where: { userId, deletedAt: null },
    });
    return plainToInstance(ConnectedAccountEntity, connectedAccounts);
  }

  async exchangeTokenAndCreate(
    userId: string,
    accountId: string,
    exchangeTokenDto: ExchangeTokenDto
  ): Promise<ConnectedAccountEntity[]> {
    const privateToken = await this.plaidService.exchangeToken(
      userId,
      exchangeTokenDto.accessToken,
    );

    const accountData = await this.plaidService.getAccounts(privateToken);
    const connectedAccounts: ConnectedAccountEntity[] = [];

    accountData.accounts.forEach(async (account) => {
      const connectedAccount = await this.prisma.connectedAccount.create({
        data: {
          userId,
          accountId,
          plaidAccountId: account.account_id,
          plaidMask: account.mask,
          plaidName: account.name,
          plaidOfficialName: account.official_name,
          plaidPersistId: account.persistent_account_id,
          plaidSubtype: account.subtype,
          plaidType: account.type,
          plaidAccessToken: privateToken,
          plaidInstitutionId: accountData.institutionId,
        },
      });
      connectedAccounts.push(connectedAccount);
    });

    return plainToInstance(ConnectedAccountEntity, connectedAccounts);
  }
}
