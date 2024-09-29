import { Module } from '@nestjs/common';
import { ConnectedAccountModule } from '../connected-accounts/connected-account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from '../transactions/transactions.module';
import { BalanceModule } from '../balances/balance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BalanceModule,
    ConnectedAccountModule,
    PrismaModule,
    TransactionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
