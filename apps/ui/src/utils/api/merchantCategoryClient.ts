import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";
import { MerchantCategoryEntity } from "@budgeting/api/merchant-categories/dto/merchant-category.entity";
import { CreateMerchantCategoryDto } from "@budgeting/api/merchant-categories/dto/create.dto";

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
