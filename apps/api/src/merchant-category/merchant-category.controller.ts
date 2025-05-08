import { Controller, Get, Logger, UseGuards, Req, Post, Body } from "@nestjs/common";
import { MerchantCategoryService } from "./merchant-category.service";
import { MerchantCategory } from "@prisma/client";
import { AuthGuard } from "../auth/auth.guard";
import { RequestWithUser } from "@budgeting/types";
import { CreateMerchantCategoryDto } from "./dto/create.dto";

@Controller("merchant-categories")
@UseGuards(AuthGuard)
export class MerchantCategoryController {
  private readonly logger = new Logger(MerchantCategoryController.name);

  constructor(private readonly merchantCategoryService: MerchantCategoryService) {}

  @Get()
  async findAllByAccountId(
    @Req() req: RequestWithUser,
  ): Promise<MerchantCategory[]> {
    this.logger.log(
      `Received request to get all merchant categories for account ${req.user.accountId}`,
    );
    return this.merchantCategoryService.findAllByAccountId(req.user.accountId);
  }

  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createMerchantCategoryDto: CreateMerchantCategoryDto,
  ): Promise<MerchantCategory> {
    return this.merchantCategoryService.create({
      accountId: req.user.accountId,
      createMerchantCategoryDto,
    });
  }
} 
