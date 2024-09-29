import { BalanceEntity } from "@budgeting/api/balances/entities/balance.entity";
import { format, getDaysInMonth, isSameDay } from "date-fns";

interface GroupedBalances {
  month: string;
  days: {
    date: Date;
    balance: number;
  }[];
}

export function groupTransactionsByMonth(transactions: BalanceEntity[]): GroupedBalances[] {
  const uniqueMonths = getUniqueMonths(transactions);
  
  const grouped = uniqueMonths.map((month) => {
    // loop through each day in the month
    const days = [];
    const monthNumber = parseInt(month.split('-')[1]);
    const year = parseInt(month.split('-')[0]);
    for (let i = 1; i <= getDaysInMonth(month); i++) {
      const currentDay = Date.UTC(year, monthNumber, i).toString();
      days.push({
        date: currentDay,
        balance: getTransactionTotalForDay(transactions, currentDay),
      });
    }

    return {
      month,
      days,
    };
  });
  return grouped;
}

function getTransactionTotalForDay(transactions: BalanceEntity[], date: Date): number {
  const transactionsForDay = transactions.filter((transaction) => isSameDay(transaction.date, date));
  const total = transactionsForDay.reduce((acc, transaction) => acc + transaction.runningBalance, 0);

  return Math.round(total * 100) / 100;
}

function getUniqueMonths(transactions: BalanceEntity[]) {
  const transactionDates = transactions.map((transaction) => new Date(transaction.date).toISOString());
  return [
    ...new Set(transactionDates.map((date) => format(date, 'yyyy-MM'))),
  ];
}

