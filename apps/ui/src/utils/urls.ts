export const urls = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  transactions: '/transactions',
  merchants: '/merchants',
  merchant: (merchantId: string) => `/merchants/${merchantId}`,
}
