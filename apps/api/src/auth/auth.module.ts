import { Module } from "@nestjs/common";
import { AuthService } from "@budgeting/api/auth";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { PrismaModule } from "../prisma/prisma.module";
import { PlaidModule } from "@budgeting/plaid";

@Module({
  imports: [
    PrismaModule,
    PlaidModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
  ],
  controllers: [
    AuthController,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
