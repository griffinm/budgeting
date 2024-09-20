import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import { AppLayout } from '../layouts';

const HomePage = lazy(() => import('../pages/home'));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route 
          index 
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <HomePage />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  )
}
