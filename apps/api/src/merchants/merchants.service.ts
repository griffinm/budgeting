import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Merchant } from "@prisma/client";
import { PagedRequest, PagedResponse } from "@budgeting/types";
import { CreateMerchantDto } from "./dto/create-merchant.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class MerchantsService {
  private readonly logger = new Logger(MerchantsService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  public async findAll({
    accountId,
    pagedRequest,
  }: {
    accountId: string;
    pagedRequest: PagedRequest;
  }): Promise<PagedResponse<Merchant>> {
    this.logger.debug(`Finding all merchants for account ${accountId}`);

    const merchants = await this.prismaService.merchant.findMany({
      where: {
        AccountTransaction: {
          some: {
            accountId,
          },
        },
      },
      skip: pagedRequest.page * pagedRequest.pageSize,
      take: pagedRequest.pageSize,
    });

    const total = await this.prismaService.merchant.count({
      where: {
        AccountTransaction: {
          some: {
            accountId,
          },
        },
      },
    });

    return {
      data: merchants,
      totalRecords: total,
      currentPage: pagedRequest.page,
      pageSize: pagedRequest.pageSize,
    };
  }

  public async findById(id: string): Promise<Merchant | null> {
    this.logger.debug(`Finding merchant by id ${id}`);
    
    return this.prismaService.merchant.findUnique({
      where: { id },
    });
  }

  public async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    this.logger.log(
      `Creating a new merchant: ${createMerchantDto.merchantName} for account ${createMerchantDto.accountId}`
    );

    const { accountId, merchantName, merchantCategoryId, plaidEntityId } = createMerchantDto;

    const data: Prisma.MerchantCreateInput = {
      merchantName,
      account: { connect: { id: accountId } },
      ...(merchantCategoryId && { merchantCategory: { connect: { id: merchantCategoryId } } }),
      ...(plaidEntityId && { plaidEntityId }),
    };

    return this.prismaService.merchant.create({
      data,
    });
  }
}
