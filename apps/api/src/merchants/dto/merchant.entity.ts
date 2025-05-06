import { Exclude, Expose } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

@Exclude()
export class MerchantEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidEntityId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  merchantName: string;

  @Expose()
  @IsString()
  @IsOptional()
  friendlyName: string;

  @Expose()
  @IsString()
  @IsOptional()
  logoUrl: string;
  
  @Expose()
  @IsString()
  @IsOptional()
  website: string;

  @Expose()
  @IsString()
  @IsOptional()
  address: string;

  @Expose()
  @IsString()
  @IsOptional()
  city: string;

  @Expose()
  @IsString()
  @IsOptional()
  state: string;

  @Expose()
  @IsString()
  @IsOptional()
  zipCode: string;

  @Expose()
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsOptional()
  updatedAt: Date;
  
}