import { IsArray, IsString, ValidateNested, IsObject } from "class-validator";
import { Type } from "class-transformer";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";

export class CategoryTransactionsDto {
  @IsString()
  categoryId: string;

  @IsString()
  categoryName: string;

  @IsString()
  categoryColor: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccountTransactionEntity)
  transactions: AccountTransactionEntity[];

  @IsString()
  totalAmount: string; // Formatted as string to preserve decimal precision
}

export class MonthDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTransactionsDto)
  categories: CategoryTransactionsDto[];

  @IsString()
  totalAmount: string;
}

export class SpendSummaryDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MonthDataDto)
  months: Record<string, MonthDataDto>; // Keys are month strings like '2025-05'
  
  @IsString()
  totalAmount: string; // Formatted as string to preserve decimal precision
}
