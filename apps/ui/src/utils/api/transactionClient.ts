import { PagedRequest, PagedResponse } from "@budgeting/types";
import { baseClient } from "./baseClient";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { AxiosResponse } from "axios";

const baseUrl = '/transactions';

interface TransactionFilter {
  connectedAccountId?: string,
}

export async function syncTransactions(): Promise<AxiosResponse<{ success: boolean }>> {
  return baseClient.post(`${baseUrl}/sync`);
}

export async function fetchTransactions({
  pagedRequest,
  filter,
}: {
  pagedRequest: PagedRequest;
  filter: TransactionFilter;
}): Promise<AxiosResponse<PagedResponse<AccountTransactionEntity>>> {
  const { page, pageSize } = pagedRequest;
  let url = `${baseUrl}?page=${page}&pageSize=${pageSize}`;

  if (filter.connectedAccountId) {
    url += `&connectedAccountId=${encodeURIComponent(filter.connectedAccountId)}`
  }

  return baseClient.get(url);
}
