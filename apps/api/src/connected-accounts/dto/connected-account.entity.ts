import { Exclude, Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsDate, IsOptional } from "class-validator";

@Exclude()
export class ConnectedAccountEntity {
  @Expose()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  userId: string;

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
  plaidAccountId: string;

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

  @IsString()
  @IsNotEmpty()
  plaidPersistId: string;

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
  plaidAccessToken: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  plaidInstitutionId: string;
}
