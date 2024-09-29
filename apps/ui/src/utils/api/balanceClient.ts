import { AxiosResponse } from "axios";
import { baseClient } from "./baseClient";
import { DailySpend } from "@budgeting/types";

const baseUrl = '/balances';  

interface GetCumlativeDailySpendParams {
  month: number;
  year: number;
}

export async function getCumlativeDailySpend(
  params: GetCumlativeDailySpendParams,
): Promise<AxiosResponse<DailySpend[]>> {
  const {
    month,
    year,
  } = params;

  return baseClient.get(`${baseUrl}/cumlative-daily-spend`, {
    params: {
      month,
      year,
    },
  });
}
