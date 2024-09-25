import { Exclude, Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber } from "class-validator";

@Exclude()
export class ConnectedAccountEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

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

  @IsString()
  @IsNotEmpty()
  plaidInstitutionId: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  lastBalance?: number;

  @Expose()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nickname?: string;
}
