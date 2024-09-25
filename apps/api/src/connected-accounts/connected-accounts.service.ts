import { Injectable } from "@nestjs/common";
import { ConnectedAccountEntity } from "./dto/connected-account.entity";
import { PrismaService } from "../prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";
import { ExchangeTokenDto } from "./dto/exchange-token.dto";
import { PlaidService } from "@budgeting/plaid";
import { ConnectedAccount } from "@prisma/client";
import { UpdateConnectedAccountDto } from "./dto/update.dto";

@Injectable()
export class ConnectedAccountsService {
  private readonly logger = new Logger(ConnectedAccountsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly plaidService: PlaidService,
  ) {}

  async findAllForAccount({
    accountId
  }: {
    accountId: string;
  }): Promise<ConnectedAccount[]> {
    return this.prisma.connectedAccount.findMany({
      where: {
        accountId,
        deletedAt: null,
      },
    });
  }

  public async update({
    accountId,
    connectedAccountId,
    updateConnectedAccountDto,
  }: {
    accountId: string;
    connectedAccountId: string;
    updateConnectedAccountDto: UpdateConnectedAccountDto;
  }): Promise<ConnectedAccount> {
    const connectedAccount = await this.prisma.connectedAccount.update({
      where: { id: connectedAccountId, accountId },
      data: updateConnectedAccountDto,
    });

    return connectedAccount;
  }

  async findAll({
    accountId,
  }: {
    accountId: string;
  }): Promise<ConnectedAccount[]> {
    this.logger.debug(`Finding all connected accounts for user ${accountId.substring(0, 7)}`);

    const connectedAccounts = await this.prisma.connectedAccount.findMany({
      where: { accountId, deletedAt: null },
    });

    return connectedAccounts;
  }

  async exchangeTokenAndCreate({
    accountId,
    exchangeTokenDto,
  }: {
    accountId: string;
    exchangeTokenDto: ExchangeTokenDto;
  }): Promise<ConnectedAccount[]> {
    const privateToken = await this.plaidService.exchangePublicToken({
      accountId,
      publicToken: exchangeTokenDto.accessToken,
    });

    // Save the access token
    const accessToken = await this.prisma.accessToken.create({
      data: {
        token: privateToken,
        accountId,
      },
    });

    const accountData = await this.plaidService.getAccounts(privateToken);
    const connectedAccounts: ConnectedAccount[] = [];

    for (const account of accountData.accounts) {
      const connectedAccount = await this.prisma.connectedAccount.create({
        data: {
          id: account.account_id,
          plaidMask: account.mask,
          plaidName: account.name,
          plaidOfficialName: account.official_name,
          plaidSubtype: account.subtype,
          plaidType: account.type,
          plaidInstitutionId: accountData.institutionId,
          accessToken: {
            connect: {
              id: accessToken.id,
            }
          },
          account: {
            connect: {
              id: accountId,
            }
          }
        },
      });
      connectedAccounts.push(connectedAccount);
    };

    return connectedAccounts;
  }

  async checkIfConnectedAccountBelongsToUser(
    userId: string,
    connectedAccountId: string,
  ): Promise<ConnectedAccount> {
    this.logger.debug(`Checking if connected account ${connectedAccountId.substring(0, 7)} belongs to user ${userId.substring(0, 7)}`);
    const connectedAccount = await this.prisma.connectedAccount.findUnique({
      where: { 
        id: connectedAccountId,
        account: {
          users: {
            some: {
              id: userId,
            }
          }
        },
      },
    });

    this.logger.debug(`Connected account ${connectedAccountId.substring(0, 7)} belongs to user ${userId.substring(0, 7)}: ${!!connectedAccount}`);
    return connectedAccount;
  }
}
