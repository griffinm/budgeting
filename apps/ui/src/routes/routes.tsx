import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { AppLayout, AuthLayout } from '../layouts';
import { Loading } from "../components";

const SignInPage = lazy(() => import('../pages/auth/SignInPage'));
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'));
const HomePage = lazy(() => import('../pages/home'));
const AccountsPage = lazy(() => import('../pages/accounts'));
const ProfilePage = lazy(() => import('../pages/profile'));
const TransactionsPage = lazy(() => import('../pages/transactions'));

export function AppRoutes() {

  const signInRoutes = () => {
    return (
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={withSuspense(SignInPage)} />
        <Route path="/sign-up" element={withSuspense(SignUpPage)} />
      </Route>
    )
  }

  return (
    <Routes>
      {signInRoutes()}
      <Route path="/" element={<AppLayout />}>
        <Route 
          index 
          element={withSuspense(HomePage)} 
        />
        <Route 
          path="/accounts" 
          element={withSuspense(AccountsPage)} 
        />
        <Route 
          path="/profile" 
          element={withSuspense(ProfilePage)} 
        />
        <Route 
          path="/transactions" 
          element={withSuspense(TransactionsPage)} 
        />
      </Route>
    </Routes>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}
