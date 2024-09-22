import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '@budgeting/api/auth';
import { PlaidModule } from '@budgeting/plaid';
@Module({
  imports: [PrismaModule, AuthModule, PlaidModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
