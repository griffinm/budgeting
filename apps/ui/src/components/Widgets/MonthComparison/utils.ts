import { DailySpend } from "@budgeting/types";

export function getSpendTotalOnDay(spend: DailySpend[], dayOfMonth: string): number {
  const spendOnDay = spend.find((day) => new Date(day.date).getDate() === parseInt(dayOfMonth));
  return spendOnDay?.spend ?? 0;
}

export function getFinalSpendTotal(spend: DailySpend[]): number {
  if (spend.length === 0) {
    return 0;
  }

  const largestDate = spend.reduce((acc, curr) => acc.date > curr.date ? acc : curr, spend[0]);
  
  const largestDateAsDate = new Date(largestDate.date);
  const finalSpend = spend.find((day) => new Date(day.date).getTime() === largestDateAsDate.getTime());
  return finalSpend?.spend ?? 0;
}
