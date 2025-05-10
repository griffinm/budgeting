import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SpendSearchDto } from "./dto/spend-search.dto";
import { SpendSummaryDto, MonthDataDto, CategoryTransactionsDto } from "./dto/spend-summary.dto";

@Injectable()
export class SpendService {
  constructor(private readonly prisma: PrismaService) {}

  async getSpend({
    accountId,
    searchDto,
  }: {
    accountId: string;
    searchDto: SpendSearchDto;
  }): Promise<SpendSummaryDto> {
    // Build the where clause
    const where: any = {
      accountId,
      merchant: {
        merchantCategoryId: { in: searchDto.categoryIds },
      },
    };
    
    // Add date filters if provided
    if (searchDto.startDate || searchDto.endDate) {
      where.date = {};
      
      if (searchDto.startDate) {
        where.date.gte = new Date(searchDto.startDate);
      }
      
      if (searchDto.endDate) {
        where.date.lte = new Date(searchDto.endDate);
      }
    }
    
    const transactions = await this.prisma.accountTransaction.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      include: {
        merchant: {
          include: {
            merchantCategory: true,
          },
        },
      },
    });

    // Group transactions by month and category
    const groupedByMonth: Record<string, Record<string, any[]>> = {};
    let totalAmount = 0;

    // First pass: group by month and category
    transactions.forEach(transaction => {
      const month = transaction.date.toISOString().substring(0, 7);
      const categoryId = transaction.merchant.merchantCategoryId;
      
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = {};
      }
      
      if (!groupedByMonth[month][categoryId]) {
        groupedByMonth[month][categoryId] = [];
      }
      
      groupedByMonth[month][categoryId].push(transaction);
      
      // Add to total (assuming transaction.amount is a number)
      totalAmount += Number(transaction.amount);
    });
    
    // Transform into the desired structure
    const months: Record<string, MonthDataDto> = {};
    
    // For each month
    for (const [month, categoriesMap] of Object.entries(groupedByMonth)) {
      const categories: CategoryTransactionsDto[] = [];
      let monthTotal = 0;
      
      // For each category in this month
      for (const [categoryId, categoryTransactions] of Object.entries(categoriesMap)) {
        let categoryTotal = 0;
        categoryTransactions.forEach(tx => {
          categoryTotal += Number(tx.amount);
        });
        
        categories.push({
          categoryId,
          categoryColor: categoryTransactions[0].merchant.merchantCategory.color,
          categoryName: categoryTransactions[0].merchant.merchantCategory.name,
          transactions: categoryTransactions,
          totalAmount: categoryTotal.toFixed(2)
        });
        
        monthTotal += categoryTotal;
      }
      
      months[month] = {
        categories,
        totalAmount: monthTotal.toFixed(2)
      };
    }
    
    return {
      months,
      totalAmount: totalAmount.toFixed(2)
    };
  }
}
