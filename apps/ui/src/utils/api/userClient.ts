import { baseClient } from './baseClient';
import { SignInResponse } from '@budgeting/types';
import { AxiosResponse } from 'axios';

export const createUser = async({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<AxiosResponse<SignInResponse>> => {
  return baseClient.post('/users', { name, email, password });
};
