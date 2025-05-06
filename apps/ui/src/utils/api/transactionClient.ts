import { PagedRequest, PagedResponse } from "@budgeting/types";
import { baseClient } from "./baseClient";
import { AccountTransactionEntity } from "@budgeting/api/transactions/dto/transaction.entity";
import { AxiosResponse } from "axios";
import { TransactionFilter } from "@budgeting/api/transactions/dto/transaction-filter";

const baseUrl = '/transactions';

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
  const url = buildUrl({ pagedRequest, filter, endpoint: 'search' });

  return baseClient.get(url);
}

export async function getTransactionTotal({
  filter,
}: {
  filter: TransactionFilter;
}): Promise<AxiosResponse<number>> {
  const url = buildUrl({ filter, endpoint: 'total' });

  return baseClient.get(url);
}

function buildUrl({
  pagedRequest,
  filter,
  endpoint,
}: {
  pagedRequest?: PagedRequest;
  filter: TransactionFilter;
  endpoint: 'total' | 'search';
}) {
  let url = `${baseUrl}`;

  if (endpoint === 'search') {
    url += '?';
  } else {
    url += '/total?';
  }

  if (filter.merchantId) {
    url += `&merchantId=${encodeURIComponent(filter.merchantId)}`;
  }

  if (filter.startDate) {
    url += `&startDate=${encodeURIComponent(filter.startDate.toISOString())}`;
  }
  
  if (filter.connectedAccountId) {
    url += `&connectedAccountId=${encodeURIComponent(filter.connectedAccountId)}`
  }

  if (pagedRequest?.page) {
    url += `&page=${pagedRequest.page}`;
  }

  if (pagedRequest?.pageSize) {
    url += `&pageSize=${pagedRequest.pageSize}`;
  }

  return url;
}