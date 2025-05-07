import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateMerchantDto {
  @IsNotEmpty()
  @IsString()
  merchantName: string;

  @IsNotEmpty()
  @IsUUID()
  accountId: string; // To associate merchant with an account

  @IsOptional()
  @IsUUID()
  merchantCategoryId?: string;

  @IsOptional()
  @IsString()
  plaidEntityId?: string;
  
  // Add any other fields relevant for creating a merchant
  // e.g., logoUrl, website, etc.
} 