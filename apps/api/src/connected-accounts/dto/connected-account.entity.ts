import { Exclude, Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber } from "class-validator";

@Exclude()
export class ConnectedAccountEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @IsDate()
  @IsOptional()
  deletedAt: Date;
  
  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidMask: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidOfficialName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidSubtype: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidType: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidInstitutionId: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  lastBalance?: number;
}
