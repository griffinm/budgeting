import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { AppLayout, AuthLayout } from '../layouts';
import { Loading } from "../components";

const SignInPage = lazy(() => import('../pages/auth/SignInPage'));
const HomePage = lazy(() => import('../pages/home'));

export function AppRoutes() {

  const signInRoutes = () => {
    return (
      <Route element={<AuthLayout title="Sign In" />}>
        <Route path="/sign-in" element={withSuspense(SignInPage)} />
      </Route>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {signInRoutes()}
        <Route 
          index 
          element={withSuspense(HomePage)} 
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
