import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";

export function getMerchantName(transaction: AccountTransactionEntity) {
  return transaction.merchant?.friendlyName || transaction.merchant?.merchantName || transaction.name
}