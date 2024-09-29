import { User } from "@prisma/client";

export interface DailySpend {
  date: Date;
  spend: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  accountId: string;
}

export interface SignInResponse {
  jwt: string;
  user: AuthUser;
}

export interface JwtPayload {
  userId: string;
  email: string;
  accountId: string;
  name: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
}

export interface PagedRequest {
  page: number;
  pageSize: number;
}
