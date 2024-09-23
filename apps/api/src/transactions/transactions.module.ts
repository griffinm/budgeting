import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { ConnectedAccountModule } from "@budgeting/api/connected-accounts/connected-account.module";
import { PrismaModule } from "@budgeting/api/prisma/prisma.module";
import { AuthModule } from "@budgeting/api/auth/auth.module";
import { PlaidModule } from "@budgeting/plaid";
    
@Module({
  imports: [
    ConnectedAccountModule,
    PrismaModule,
    AuthModule,
    PlaidModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
