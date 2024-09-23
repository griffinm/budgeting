import { Module } from '@nestjs/common';
import { ConnectedAccountModule } from '../connected-accounts/connected-account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    ConnectedAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
