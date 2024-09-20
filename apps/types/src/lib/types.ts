export interface SignInResponse {
  jwt: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  // accountId: string;
  // name: string;
}
