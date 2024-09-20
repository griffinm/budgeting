import { User } from "@prisma/client";

export interface RequestWithUser extends Request {
  user: User;
}

export interface SignInResponse {
  jwt: string;
  user: {
    id: string;
    name: string;
    email: string;
    accountId: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  accountId: string;
  name: string;
}
