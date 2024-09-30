import { AxiosResponse } from "axios";
import { baseClient } from "./baseClient";
import { DailySpend } from "@budgeting/types";

const baseUrl = '/balances';  

interface GetCumlativeDailySpendParams {
  month: number;
  year: number;
}

interface GetMonthlyTotalParams {
  month: number;
  year: number;
  type: 'expenses' | 'income';
}

export async function getMonthlyTotal(
  params: GetMonthlyTotalParams,
): Promise<AxiosResponse<{ amount: number }>> {
  const {
    month,
    year,
    type,
  } = params;

  return baseClient.get(`${baseUrl}/monthly-total`, {
    params: {
      month,
      year,
      type,
    },
  });
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
