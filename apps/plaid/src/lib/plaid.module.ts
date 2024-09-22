import { Module } from '@nestjs/common';
import { PlaidService } from './plaid.service';

@Module({
  controllers: [],
  providers: [PlaidService],
  exports: [PlaidService],
})
export class PlaidModule {}
