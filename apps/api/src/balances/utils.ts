import { AccountTransaction, Prisma } from "@prisma/client";

export function allExpensesWithoutCardPayments({
  accountId,
  startDate,
  endDate,
}: {
  accountId: string;
  startDate: Date;
  endDate: Date;
}): Prisma.AccountTransactionWhereInput {
  return {
      accountId,
      ...betweenDates(startDate, endDate),
      ...EXPENSES_ONLY,
      ...EXLUDE_CARD_PAYMENTS,
      ...EXCLUDE_TRANSFERS,
  }
}

export function betweenDates(startDate: Date, endDate: Date): Prisma.AccountTransactionWhereInput {
  return {
    date: {
      gte: startDate,
      lte: endDate,
    },
  };
}

export const EXLUDE_CARD_PAYMENTS: Prisma.AccountTransactionWhereInput = {
  plaidCategoryDetail: {
    not: 'LOAN_PAYMENTS_CREDIT_CARD_PAYMENT',
  },
};

export const EXCLUDE_TRANSFERS: Prisma.AccountTransactionWhereInput = {
  plaidCategoryDetail: {
    not: { in: ['TRANSFER_IN', 'TRANSFER_OUT'] },
  },
};

export const EXPENSES_ONLY: Prisma.AccountTransactionWhereInput = {
  amount: { gt: 0 },
}

export const INCOME_ONLY: Prisma.AccountTransactionWhereInput = {
  amount: { lt: 0 },
}

export function sumTransactions(transactions: AccountTransaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
}
