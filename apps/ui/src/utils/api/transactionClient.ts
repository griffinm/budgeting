import { PagedRequest, PagedResponse } from "@budgeting/types";
import { baseClient } from "./baseClient";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { AxiosResponse } from "axios";

const baseUrl = '/transactions';

export async function syncTransactions(): Promise<AxiosResponse<{ success: boolean }>> {
  return baseClient.post(`${baseUrl}/sync`);
}

export async function fetchTransactions({
  pagedRequest,
}: {
  connectedAccountId?: string;
  pagedRequest: PagedRequest;
}): Promise<AxiosResponse<PagedResponse<AccountTransactionEntity>>> {
  const { page, pageSize } = pagedRequest;
  let url = `${baseUrl}?page=${page}&pageSize=${pageSize}`;

  return baseClient.get(url);
}
