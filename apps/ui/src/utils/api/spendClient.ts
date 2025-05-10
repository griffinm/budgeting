import { SpendSearchDto } from "@budgeting/api/Spend/dto/spend-search.dto";
import { baseClient } from "./baseClient";
import { AxiosResponse } from "axios";
import { SpendSummaryDto } from "@budgeting/api/Spend/dto/spend-summary.dto";

export function fetchSpend(searchSpendDto: SpendSearchDto): Promise<AxiosResponse<SpendSummaryDto>> {
  return baseClient.get('/spend', { params: searchSpendDto });
}
