import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";

// Ideally, this would come from a shared types definition, e.g., @budgeting/api/merchant-categories/dto/merchant-category.entity
export interface MerchantCategoryEntity {
  id: string;
  name: string;
  accountId: string;
  // Add any other relevant fields from your backend entity
}

const baseUrl = "/merchants";

export async function fetchCategoryById(
  categoryId: string,
  accountId: string
): Promise<AxiosResponse<MerchantCategoryEntity>> {
  // The accountId might be passed as a query param or be part of the baseClient's auth handling
  return baseClient.get<MerchantCategoryEntity>(
    `${baseUrl}/${categoryId}?accountId=${encodeURIComponent(accountId)}`
  );
}

export async function fetchCategoriesByAccount(
  accountId: string
): Promise<AxiosResponse<MerchantCategoryEntity[]>> {
  return baseClient.get<MerchantCategoryEntity[]>(
    `${baseUrl}/account/${encodeURIComponent(accountId)}`
  );
}

export async function createMerchantCategory(
  name: string,
  accountId: string
): Promise<AxiosResponse<MerchantCategoryEntity>> {
  return baseClient.post<MerchantCategoryEntity>(`${baseUrl}`, { name, accountId });
} 