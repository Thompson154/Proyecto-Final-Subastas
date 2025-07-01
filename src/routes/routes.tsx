import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoutes from "../guards/ProtectedRoutes";
import LoadingPage from "../pages/LoadingPage";
const Layout = React.lazy(() => import("../layout/Layout"));
const HomePage = React.lazy(() => import("../pages/HomePage"));
const UsersPage = React.lazy(() => import("../pages/UsersPage"));
const ProductPage = React.lazy(() => import("../pages/ProductPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
        
          <Route
            path="/app"
            element={
              <ProtectedRoutes>
                <Layout />
              </ProtectedRoutes>
            }
          >
            <Route path="home" element={<HomePage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products/:productId" element={<ProductPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
