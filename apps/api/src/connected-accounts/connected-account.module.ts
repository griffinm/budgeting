import { Module } from '@nestjs/common';
import { ConnectedAccountsController } from './connected-accounts.controller';
import { ConnectedAccountsService } from './connected-accounts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PlaidModule } from '@budgeting/plaid';

@Module({
  imports: [PrismaModule, AuthModule, PlaidModule],
  controllers: [ConnectedAccountsController],
  providers: [ConnectedAccountsService],
  exports: [ConnectedAccountsService],
})
export class ConnectedAccountModule {}
