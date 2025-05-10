export const urls = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  transactions: '/transactions',
  merchants: '/merchants',
  merchant: (merchantId: string) => `/merchants/${merchantId}`,
  categories: '/categories',
  category: (categoryId: string) => `/categories/${categoryId}`,
  accounts: '/accounts',
  profile: '/profile',
}
