import { Exclude, Expose } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

@Exclude()
export class MerchantEntity {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  @IsOptional()
  plaidEntityId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  merchantName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  friendlyName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  logoUrl?: string;
  
  @Expose()
  @IsString()
  @IsOptional()
  website?: string;

  @Expose()
  @IsString()
  @IsOptional()
  address?: string;

  @Expose()
  @IsString()
  @IsOptional()
  city?: string;

  @Expose()
  @IsString()
  @IsOptional()
  state?: string;

  @Expose()
  @IsString()
  @IsOptional()
  zipCode?: string;

  @Expose()
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @Expose()
  @IsString()
  @IsOptional()
  merchantCategoryId?: string;
}