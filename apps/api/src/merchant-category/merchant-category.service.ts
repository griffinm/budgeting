import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MerchantCategory } from "@prisma/client";
import { CreateMerchantCategoryDto } from "./dto/create.dto";

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
        name: "asc",
      }
    });
  }

  public async create({
    accountId,
    createMerchantCategoryDto,
  }: {
    accountId: string;
    createMerchantCategoryDto: CreateMerchantCategoryDto;
  }): Promise<MerchantCategory> {
    return this.prismaService.merchantCategory.create({
      data: {
        ...createMerchantCategoryDto,
        accountId,
      },
    });
  }
} 
