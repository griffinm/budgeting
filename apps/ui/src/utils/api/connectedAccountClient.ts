import { baseClient } from "./baseClient";
import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { AxiosResponse } from "axios";

const baseUrl = 'connected-accounts';

export async function fetchConnectedAccounts(): Promise<AxiosResponse<ConnectedAccountEntity[]>> {
  return baseClient.get<ConnectedAccountEntity[]>(baseUrl);
}

export async function exchangeTokenAndCreateAccounts(
  accessToken: string,
): Promise<AxiosResponse<ConnectedAccountEntity[]>> {
  return baseClient.post<ConnectedAccountEntity[]>(baseUrl, { accessToken });
}
