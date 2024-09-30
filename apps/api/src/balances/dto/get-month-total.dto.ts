import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetMonthlyTotalDto {
  @IsString()
  @IsNotEmpty()
  type: 'expenses' | 'income';

  @IsNotEmpty()
  @IsEnum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
  month: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

  @IsNotEmpty()
  @IsEnum(['2024', '2025', '2026'])
  year: '2024' | '2025' | '2026';
}
