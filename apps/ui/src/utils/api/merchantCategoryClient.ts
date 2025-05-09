import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";
import { MerchantCategoryEntity } from "@budgeting/api/merchant-category/dto/merchant-category.entity";
import { CreateMerchantCategoryDto } from "@budgeting/api/merchant-category/dto/create-merchant-category.dto";

const baseUrl = "/merchant-categories";

export async function fetchCategoryById({
  categoryId,
}: {
  categoryId: string;
}): Promise<AxiosResponse<MerchantCategoryEntity>> {
  return baseClient.get<MerchantCategoryEntity>(
    `${baseUrl}/${categoryId}`
  );
}

export async function fetchCategories(): Promise<AxiosResponse<MerchantCategoryEntity[]>> {
  return baseClient.get<MerchantCategoryEntity[]>(
    `${baseUrl}`
  );
}

export async function createMerchantCategory({
  name,
  description,
}: {
  name: string;
  description?: string;
}): Promise<AxiosResponse<MerchantCategoryEntity>> {
  return baseClient.post<MerchantCategoryEntity>(`${baseUrl}`, { name, description });
} 
