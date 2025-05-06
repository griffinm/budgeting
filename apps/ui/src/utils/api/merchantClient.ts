import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";
import { MerchantEntity } from "@budgeting/api/merchants/dto/merchant.entity";

const baseUrl = '/merchants';

export async function fetchMerchant(id: string): Promise<AxiosResponse<MerchantEntity>> {
  return baseClient.get(`${baseUrl}/${id}`);
}