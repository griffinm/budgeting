import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class TransactionFilter {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  connectedAccountId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  merchantId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate?: Date;
}
