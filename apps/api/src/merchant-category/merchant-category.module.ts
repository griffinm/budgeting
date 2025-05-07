import { Module } from "@nestjs/common";
import { MerchantCategoryController } from "./merchant-category.controller";
import { MerchantCategoryService } from "./merchant-category.service";
import { PrismaModule } from "../prisma/prisma.module"; // Adjust path if your PrismaModule is located elsewhere

@Module({
  imports: [PrismaModule],
  controllers: [MerchantCategoryController],
  providers: [MerchantCategoryService],
  exports: [MerchantCategoryService], // Export if other modules need to use this service
})
export class MerchantCategoryModule {} 