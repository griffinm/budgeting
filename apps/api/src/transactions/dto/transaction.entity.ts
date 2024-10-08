import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { Exclude, Expose, Type } from "class-transformer";
import { 
  IsString, 
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsBoolean,
} from "class-validator";

@Exclude()
export class AccountTransactionEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidTransactionId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  connectedAccountId: string;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @Expose()
  @IsString()
  @IsNotEmpty()
  amount: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsDate()
  @IsOptional()
  authorizedDate: Date;

  @Expose()
  @IsString()
  @IsOptional()
  checkNumber: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  currencyCode: string;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  pending: boolean;
  
  @Expose()
  @IsString()
  @IsOptional()
  plaidCategoryPrimary: string;

  @Expose()
  @IsString()
  @IsOptional()
  plaidCategoryDetail: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @Expose()
  @Type(() => ConnectedAccountEntity)
  connectedAccount: ConnectedAccountEntity;
}
