import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TransactionFilter {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  connectedAccountId?: string;
}
