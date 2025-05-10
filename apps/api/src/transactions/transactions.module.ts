import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { ConnectedAccountModule } from "../connected-accounts/connected-account.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { PlaidModule } from "@budgeting/plaid";
import { MerchantsModule } from "../merchants/merchants.module";

@Module({
  imports: [
    ConnectedAccountModule,
    PrismaModule,
    AuthModule,
    PlaidModule,
    MerchantsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
