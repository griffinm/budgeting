import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";
import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";
import { PagedRequest, PagedResponse } from "@budgeting/types";
import { UpdateMerchantDto } from "@budgeting/api/merchants/dto/update-merchant.dto";

const baseUrl = '/merchants';

export async function fetchMerchant(id: string): Promise<AxiosResponse<MerchantEntity>> {
  return baseClient.get(`${baseUrl}/${id}`);
}

export interface MerchantsRequest extends PagedRequest {
  search?: string;
}

export async function fetchMerchants(
  request: MerchantsRequest,
): Promise<PagedResponse<MerchantEntity>> {
  const resp = await baseClient.get(`${baseUrl}`, { params: request }) as AxiosResponse<PagedResponse<MerchantEntity>>;
  
  return resp.data;
}

export async function updateMerchant({
  id,
  updateMerchantDto,
}: {
  id: string;
  updateMerchantDto: UpdateMerchantDto;
}): Promise<AxiosResponse<MerchantEntity>> {
  return baseClient.patch<MerchantEntity>(`${baseUrl}/${id}`, updateMerchantDto);
}

export function searchMerchants(query: string) {
  return baseClient.get<MerchantEntity[]>(`${baseUrl}/search`, {
    params: { query }
  });
}
