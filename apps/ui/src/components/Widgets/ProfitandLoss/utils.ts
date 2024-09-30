import { format, subMonths } from "date-fns";
import { getMonthlyTotal } from "@budgeting/ui/utils/api";

type AmountType = 'expenses' | 'income';

export interface MonthAndYear {
  month: number;
  year: number;
}

export interface MonthlyTotal extends MonthAndYear {
  type: AmountType;
  amount: number;
}

export interface GroupedMonthlyTotal extends MonthAndYear {
  totals: {
    type: AmountType;
    amount: number;
  }[];
}

export async function fetchData(): Promise<GroupedMonthlyTotal[]> {
  const months = getMonthAndYearSet();

  const month1Expenses = await getMonthlyTotal({
    month: months[0].month,
    year: months[0].year,
    type: 'expenses',
  });

  const month1Income = await getMonthlyTotal({
    month: months[0].month,
    year: months[0].year,
    type: 'income',
  });

  const month2Expenses = await getMonthlyTotal({
    month: months[1].month,
    year: months[1].year,
    type: 'expenses',
  });

  const month2Income = await getMonthlyTotal({
    month: months[1].month,
    year: months[1].year,
    type: 'income',
  });

  const month3Expenses = await getMonthlyTotal({
    month: months[2].month,
    year: months[2].year,
    type: 'expenses',
  });

  const month3Income = await getMonthlyTotal({
    month: months[2].month,
    year: months[2].year,
    type: 'income',
  });

  const data = [
    { 
      month: months[0].month, 
      year: months[0].year, 
      totals: [
        { type: 'expenses' as AmountType, amount: month1Expenses.data.amount },
        { type: 'income' as AmountType, amount: month1Income.data.amount },
    ] },
    { 
      month: months[1].month, 
      year: months[1].year, 
      totals: [
        { type: 'expenses' as AmountType, amount: month2Expenses.data.amount },
        { type: 'income' as AmountType, amount: month2Income.data.amount },
    ] },
    { 
      month: months[2].month, 
      year: months[2].year, 
      totals: [
        { type: 'expenses' as AmountType, amount: month3Expenses.data.amount },
        { type: 'income' as AmountType, amount: month3Income.data.amount },
    ] },
  ];
  
  return data;
}

export const getMonthAndYearSet = (): MonthAndYear[] => {
  const today = new Date();
  const month1: MonthAndYear = {
    month: parseInt(format(today, 'MM')),
    year: parseInt(format(today, 'yyyy')),
  }
  const month2: MonthAndYear = {
    month: parseInt(format(subMonths(today, 1), 'MM')),
    year: parseInt(format(subMonths(today, 1), 'yyyy')),
  }
  const month3: MonthAndYear = {
    month: parseInt(format(subMonths(today, 2), 'MM')),
    year: parseInt(format(subMonths(today, 2), 'yyyy')),
  }

  return [month1, month2, month3];
}

export const chartIncomeSeries = (data: GroupedMonthlyTotal[]) => {
  return data.map((total) => {
    return {
      x: `${total.month}/${total.year}`,
      y: Math.abs(total.totals.find((t) => t.type === 'income')?.amount ?? 0),
    }
  })
}

export const chartExpenseSeries = (data: GroupedMonthlyTotal[]) => {
  return data.map((total) => {
    return {
      x: `${total.month}/${total.year}`,
      y: Math.abs(total.totals.find((t) => t.type === 'expenses')?.amount ?? 0),
    }
  })
}

export const get3MonthChange = (data: GroupedMonthlyTotal[]) => {
  const allExpensesRecords = data.map((total) => total.totals.find((t) => t.type === 'expenses')?.amount ?? 0);
  const allIncomeRecords = data.map((total) => total.totals.find((t) => t.type === 'income')?.amount ?? 0);

  const expenseTotal = allExpensesRecords.reduce((acc, curr) => acc + curr, 0);
  const incomeTotal = allIncomeRecords.reduce((acc, curr) => acc + curr, 0);

  const change = Math.abs(incomeTotal) - expenseTotal

  return change;
} 

export function getNetForMonth(month: GroupedMonthlyTotal): number {
  const income = month.totals.find((t) => t.type === 'income')?.amount ?? 0;
  const expenses = month.totals.find((t) => t.type === 'expenses')?.amount ?? 0;
  return Math.abs(income) - expenses;
}
