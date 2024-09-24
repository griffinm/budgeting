import { PagedRequest, PagedResponse } from "@budgeting/types";
import { baseClient } from "./baseClient";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { AxiosResponse } from "axios";

export async function syncTransactions(
  connectedAccountId: string,
): Promise<void> {
  return baseClient.post(`/accounts/${connectedAccountId}/transactions/sync`);
}

export async function fetchTransactions({
  connectedAccountId,
  pagedRequest,
}: {
  connectedAccountId?: string;
  pagedRequest: PagedRequest;
}): Promise<AxiosResponse<PagedResponse<AccountTransactionEntity>>> {
  const { page, pageSize } = pagedRequest;
  let url = `/transactions?page=${page}&pageSize=${pageSize}`;
  if (connectedAccountId) {
    url += `accountId=${connectedAccountId}`;
  }
  return baseClient.get(url);
}
