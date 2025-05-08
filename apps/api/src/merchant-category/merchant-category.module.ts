import { Module } from "@nestjs/common";
import { MerchantCategoryController } from "./merchant-category.controller";
import { MerchantCategoryService } from "./merchant-category.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [MerchantCategoryController],
  providers: [MerchantCategoryService],
  exports: [MerchantCategoryService],
})
export class MerchantCategoryModule {} 
