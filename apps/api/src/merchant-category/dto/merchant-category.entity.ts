import { Exclude, Expose } from "class-transformer";
import { IsOptional } from "class-validator";
import { IsString, IsNotEmpty, IsDate } from "class-validator";

@Exclude()
export class MerchantCategoryEntity {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsString()
  @IsOptional()
  color: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
