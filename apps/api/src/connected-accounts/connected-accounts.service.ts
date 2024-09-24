import { Injectable } from "@nestjs/common";
import { ConnectedAccountEntity } from "./dto/connected-account.entity";
import { PrismaService } from "../prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";
import { ExchangeTokenDto } from "./dto/exchange-token.dto";
import { PlaidService } from "@budgeting/plaid";
import { ConnectedAccount } from "@prisma/client";

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

    for (const account of accountData.accounts) {
      const connectedAccount = await this.prisma.connectedAccount.create({
        data: {
          id: account.account_id,
          userId,
          plaidMask: account.mask,
          plaidName: account.name,
          plaidOfficialName: account.official_name,
          plaidSubtype: account.subtype,
          plaidType: account.type,
          plaidInstitutionId: accountData.institutionId,
        },
      });
      connectedAccounts.push(connectedAccount);
    });

    return plainToInstance(ConnectedAccountEntity, connectedAccounts);
  }

  async updateCursor(userId: string, connectedAccountId: string, cursor: string): Promise<ConnectedAccountEntity> {
    const connectedAccount = await this.prisma.connectedAccount.updateMany({
      where: { 
        id: connectedAccountId,
        deletedAt: null,
        account: {
          users: {
            some: {
              id: userId,
            }
          }
        }
      },
      data: { nextCursor: cursor },
    });
    
    return plainToInstance(ConnectedAccountEntity, connectedAccount);
  }

  async lastCursor(userId: string,connectedAccountId: string): Promise<string | null> {
    const connectedAccount = await this.prisma.connectedAccount.findUnique({
      where: { 
        id: connectedAccountId,
        deletedAt: null,
        account: {
          users: {
            some: {
              id: userId,
            }
          }
        }
      },
    });
    return connectedAccount?.nextCursor || null;
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
