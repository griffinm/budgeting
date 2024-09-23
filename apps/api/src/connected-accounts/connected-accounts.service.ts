import { Injectable } from "@nestjs/common";
import { ConnectedAccountEntity } from "./dto/connected-account.entity";
import { PrismaService } from "../prisma/prisma.service";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";

@Injectable()
export class ConnectedAccountsService {
  private readonly logger = new Logger(ConnectedAccountsService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(userId: string): Promise<ConnectedAccountEntity[]> {
    this.logger.debug(`Finding all connected accounts for user ${userId.substring(0, 7)}`);
    const connectedAccounts = await this.prisma.connectedAccount.findMany({
      where: { userId, deletedAt: null },
    });
    return plainToInstance(ConnectedAccountEntity, connectedAccounts);
  }
}
