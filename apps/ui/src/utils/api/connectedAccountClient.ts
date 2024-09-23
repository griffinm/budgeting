import { baseClient } from "./baseClient";
import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { AxiosResponse } from "axios";

const baseUrl = 'connected-accounts';

export async function fetchConnectedAccounts(): Promise<AxiosResponse<ConnectedAccountEntity[]>> {
  return baseClient.get<ConnectedAccountEntity[]>(baseUrl);
}
