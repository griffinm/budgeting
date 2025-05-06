import { Module } from "@nestjs/common";
import { MerchantsService } from "./merchants.service";
import { MerchantController } from "./merchant.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [MerchantsService],
  controllers: [MerchantController],
  exports: [MerchantsService],
})
export class MerchantsModule {}