import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailySpend } from '@budgeting/types';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { GetCumlativeMonthlySpendDto } from './dto/get-cumlative-monthly-spend.dto';


@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  public async cumlativeDailySpendForMonth({
    accountId,
    date,
  }: {
    accountId: string;
    date: Date;
  }): Promise<DailySpend[]> {
    this.logger.debug(`Getting cumulative daily spend for month for account ${accountId} and date ${date}`);

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // Get all the spend transactions for the month
    const transactions = await this.prisma.accountTransaction.findMany({
      where: {
        accountId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
        amount: { gt: 0 },
        // Exclude credit card payments
        plaidCategoryDetail: { not: 'LOAN_PAYMENTS_CREDIT_CARD_PAYMENT' }
      },
    });

    // Create a series of all days in this month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Create a map of the days in the month to the transactions
    const daysMap = daysInMonth.map((day) => {
      return {
        date: day,
        spend: 0,
      };
    });
    
    // Loop through the transactions and add the amount to the correct day
    transactions.forEach((transaction) => {
      const day = daysMap.find((day) => isSameDay(day.date, transaction.date));
      if (day) {
        day.spend += transaction.amount;
      }
    });

    // Return the cumulative spend for the month by day
    let runningTotal = 0;
    const spendByDay = daysMap.map((day) => {
      runningTotal += day.spend;
      return {
        date: day.date,
        spend: Math.round(runningTotal * 100) / 100,
      };
    });

    return spendByDay;
  }
}
