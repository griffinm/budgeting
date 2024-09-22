import { baseClient } from './baseClient';
import { SignInResponse } from '@budgeting/types';
import { AxiosResponse } from 'axios';

const baseUrl = 'auth';

export const createLinkToken = async({
  userId,
}: {
  userId: string;
}): Promise<AxiosResponse<{ linkToken: string }>> => {
  return baseClient.post(`${baseUrl}/link-token`, { userId });
};

export const signIn = async({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<SignInResponse>> => {
  return baseClient.post(`${baseUrl}/sign-in`, { email, password });
};
