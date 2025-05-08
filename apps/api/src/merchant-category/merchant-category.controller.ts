import { Controller, Get, Logger, UseGuards, Req, Post, Body } from "@nestjs/common";
import { MerchantCategoryService } from "./merchant-category.service";
import { AuthGuard } from "../auth/auth.guard";
import { RequestWithUser } from "@budgeting/types";
import { CreateMerchantCategoryDto } from "./dto/create.dto";
import { plainToInstance } from "class-transformer";
import { MerchantCategoryEntity } from "./dto/merchant-category.entity";

@Controller("merchant-categories")
@UseGuards(AuthGuard)
export class MerchantCategoryController {
  private readonly logger = new Logger(MerchantCategoryController.name);

  constructor(private readonly merchantCategoryService: MerchantCategoryService) {}

  @Get()
  async findAllByAccountId(
    @Req() req: RequestWithUser,
  ): Promise<MerchantCategoryEntity[]> {
    this.logger.log(
      `Received request to get all merchant categories for account ${req.user.accountId}`,
    );
    const data = await this.merchantCategoryService.findAllByAccountId(req.user.accountId);
    return plainToInstance(MerchantCategoryEntity, data);
  }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createMerchantCategoryDto: CreateMerchantCategoryDto,
  ): Promise<MerchantCategoryEntity> {
    const data = await this.merchantCategoryService.create({
      accountId: req.user.accountId,
      createMerchantCategoryDto,
    });
    return plainToInstance(MerchantCategoryEntity, data);
  }
} 
