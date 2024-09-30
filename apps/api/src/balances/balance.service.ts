import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailySpend } from '@budgeting/types';
import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { 
  sumTransactions,
  EXLUDE_CARD_PAYMENTS,
  EXPENSES_ONLY,
  INCOME_ONLY,
  EXCLUDE_TRANSFERS,
  betweenDates,
  allExpensesWithoutCardPayments,
} from './utils';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  public async totalMonthySpend({
    accountId,
    monthNumber,
    year,
    type,
  }: {
    accountId: string;
    monthNumber: number;
    year: number;
    type: 'expenses' | 'income';
  }): Promise<number> {
    this.logger.debug(`Getting total monthly spend for account ${accountId.substring(0, 7)} and month ${monthNumber} ${year}`);
    
    const monthStart = startOfMonth(new Date(year, monthNumber - 1, 1));
    const monthEnd = endOfMonth(monthStart);

    const transactions = await this.prisma.accountTransaction.findMany({
      where: {
        accountId,
        ...betweenDates(monthStart, monthEnd),
        ...(type === 'expenses' ? EXPENSES_ONLY : INCOME_ONLY),
        ...EXLUDE_CARD_PAYMENTS,
        ...EXCLUDE_TRANSFERS,
      },
    });

    return Math.round(sumTransactions(transactions) * 100) / 100;
  }

  public async cumlativeDailySpendForMonth({
    accountId,
    date,
  }: {
    accountId: string;
    date: Date;
  }): Promise<DailySpend[]> {
    this.logger.debug(`Getting cumulative daily spend for month for account ${accountId} and date ${date}`);
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    // Get all the spend transactions for the month
    const transactions = await this.prisma.accountTransaction.findMany({
      where: allExpensesWithoutCardPayments({
        accountId,
        startDate,
        endDate,
      }),
    });

    // Create a series of all days in this month
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

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
