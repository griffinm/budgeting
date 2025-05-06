import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { MerchantsService } from "./merchants.service";
import { plainToInstance } from "class-transformer";
import { MerchantEntity } from "./dto/merchant.entity";

@Controller('merchants')
@UseGuards(AuthGuard)
export class MerchantController {
  constructor(
    private readonly merchantsService: MerchantsService
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    const merchant = await this.merchantsService.findById(id);

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return plainToInstance(MerchantEntity, merchant);
  }
}