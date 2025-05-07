import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";
import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { PagedRequest, PagedResponse } from "@budgeting/types";
const baseUrl = '/merchants';

export async function fetchMerchant(id: string): Promise<AxiosResponse<MerchantEntity>> {
  return baseClient.get(`${baseUrl}/${id}`);
}

export async function fetchMerchants(
  pagedRequest: PagedRequest,
): Promise<PagedResponse<MerchantEntity>> {
  const resp = await baseClient.get(`${baseUrl}`, { params: pagedRequest });

  return resp.data;
}

export async function updateMerchantCategory(
  merchantId: string,
  merchantCategoryId: string | null,
  // accountId might be implicitly handled by auth or needed if API requires it for namespacing/permission
  // accountId: string 
): Promise<AxiosResponse<MerchantEntity>> {
  return baseClient.patch<MerchantEntity>(`${baseUrl}/${merchantId}`, {
    merchantCategoryId,
  });
}
