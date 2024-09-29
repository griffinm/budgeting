import { IsNumber, IsOptional, IsString } from "class-validator";

export class GetCumlativeMonthlySpendDto {
  @IsString()
  month: string;

  @IsString()
  year: string;
}
