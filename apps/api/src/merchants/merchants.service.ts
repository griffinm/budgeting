import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Merchant } from "@prisma/client";
import { PagedRequest, PagedResponse } from "@budgeting/types";
import { CreateMerchantDto } from "./dto/create-merchant.dto";
import { Prisma } from "@prisma/client";
import { UpdateMerchantDto } from "./dto/update-merchant.dto";

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
      include: {
        merchantCategory: true,
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

  public async findByPlaidNameOrPlaidId({
    plaidName,
    plaidId,
    accountId,
  }: {
    plaidName?: string;
    plaidId?: string;
    accountId: string;
  }): Promise<Merchant | null> {
    let merchant: Merchant | null = null;

    if (plaidId) {
      merchant = await this.prismaService.merchant.findFirst({
        where: { plaidEntityId: plaidId, accountId },
      });

      if (merchant) {
        return merchant;
      }
    }

    if (plaidName) {
      merchant = await this.prismaService.merchant.findFirst({
        where: { merchantName: plaidName, accountId },
      });

      if (merchant) {
        return merchant;
      }
    }
  }

  public async update({
    id,
    accountId,
    updateMerchantDto,
  }: {
    id: string;
    accountId: string;
    updateMerchantDto: UpdateMerchantDto;
  }): Promise<Merchant> {
    return this.prismaService.merchant.update({
      where: { id, accountId },
      data: updateMerchantDto,
      include: {
        merchantCategory: true,
      },
    });
  }

  public async findOrCreate({
    plaidName,
    plaidId,
    accountId,
  }: {
    plaidName: string;
    plaidId: string;
    accountId: string;
  }): Promise<Merchant> {
    this.logger.debug(`Finding or creating a merchant: Name: "${plaidName}" ID: "${plaidId}" for account ${accountId}`);
    // First look for an existing merchant
    let merchant = await this.findByPlaidNameOrPlaidId({ plaidName, plaidId, accountId });
    if (merchant) {
      // if found, update it
      merchant = await this.update({
        id: merchant.id,
        accountId,
        updateMerchantDto: {
          merchantName: plaidName,
          plaidEntityId: plaidId,
        },
      });
      this.logger.debug(`Found existing merchant: Name: "${merchant.merchantName}" ID: "${merchant.plaidEntityId}" for account ${accountId}`);
      return merchant;
    }

    // if not found, create it
    merchant = await this.prismaService.merchant.create({
      data: {
        merchantName: plaidName,
        plaidEntityId: plaidId,
        accountId,
      },
    });

    this.logger.debug(`Created new merchant: Name: "${merchant.merchantName}" ID: "${merchant.plaidEntityId}" for account ${accountId}`);
    return merchant;
  }
}
