import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MerchantCategory, Prisma } from "@prisma/client";

@Injectable()
export class MerchantCategoryService {
  private readonly logger = new Logger(MerchantCategoryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async findAllByAccountId(accountId: string): Promise<MerchantCategory[]> {
    this.logger.log(`Fetching all merchant categories for account ${accountId}`);
    return this.prismaService.merchantCategory.findMany({
      where: {
        accountId,
      },
      orderBy: {
        // Optional: Add default ordering if desired, e.g., by name
        // name: "asc", 
      }
    });
  }

  // Future methods for MerchantCategory might include:
  // findOne(id: string, accountId: string): Promise<MerchantCategory | null>
  // create(data: Prisma.MerchantCategoryCreateInput): Promise<MerchantCategory>
  // update(id: string, data: Prisma.MerchantCategoryUpdateInput, accountId: string): Promise<MerchantCategory>
  // remove(id: string, accountId: string): Promise<MerchantCategory>
} 