import { baseClient } from './baseClient';
import { SignInResponse } from '@budgeting/types';
import { AxiosResponse } from 'axios';

export const signIn = async({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse<SignInResponse>> => {
  return baseClient.post('/auth/sign_in', { email, password });
};
