import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Merchant } from "@prisma/client";

@Injectable()
export class MerchantsService {
  private readonly logger = new Logger(MerchantsService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findById(id: string): Promise<Merchant | null> {
    this.logger.debug(`Finding merchant by id ${id}`);
    
    return this.prismaService.merchant.findUnique({
      where: { id },
    });
  }
}
