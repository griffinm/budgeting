import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards, Post, Body, ValidationPipe, Patch } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { MerchantsService } from "./merchants.service";
import { plainToInstance } from "class-transformer";
import { MerchantEntity } from "./dto/merchant.entity";
import { RequestWithUser } from "@budgeting/types";
import { PagedRequestDto } from "../common/dto/paged-request.dto";
import { CreateMerchantDto } from "./dto/create-merchant.dto";
import { UpdateMerchantDto } from "./dto/update-merchant.dto";
@Controller('merchants')
@UseGuards(AuthGuard)
export class MerchantController {
  constructor(
    private readonly merchantsService: MerchantsService
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) createMerchantDto: CreateMerchantDto,
  ) {
    const merchant = await this.merchantsService.create(createMerchantDto);
    return plainToInstance(MerchantEntity, merchant);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMerchantDto: UpdateMerchantDto,
    @Req() req: RequestWithUser,
  ) {
    const merchant = await this.merchantsService.update({
      id,
      accountId: req.user.accountId,
      updateMerchantDto,
    });
    
    return plainToInstance(MerchantEntity, merchant);
  }

  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query() pagedRequest: PagedRequestDto,
  ) {
    const merchants = await this.merchantsService.findAll({
      accountId: req.user.accountId,
      pagedRequest: {
        page: pagedRequest.page,
        pageSize: pagedRequest.pageSize,
      },
    });

    return {
      data: plainToInstance(MerchantEntity, merchants.data),
      totalRecords: merchants.totalRecords,
      currentPage: merchants.currentPage,
      pageSize: merchants.pageSize,
    };
  }
  
  @Get(':id')
  async findById(@Param('id') id: string) {
    const merchant = await this.merchantsService.findById(id);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return plainToInstance(MerchantEntity, merchant);
  }
}