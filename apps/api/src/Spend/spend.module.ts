import { SpendController } from "./spend.controller";
import { SpendService } from "./spend.service";
import { PrismaModule } from "../prisma/prisma.module";
import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [SpendController],
  providers: [SpendService],
})
export class SpendModule {}
