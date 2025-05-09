import { IsArray, IsDateString, IsOptional, IsString } from "class-validator";

export class SpendSearchDto {
  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];
  
  @IsOptional()
  @IsDateString()
  startDate?: string;
  
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
