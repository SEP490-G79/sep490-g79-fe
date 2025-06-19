import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import LandingPage from "@/pages/Common/LandingPage";
import { Navigate, Outlet } from "react-router-dom";
import { Login } from "@/pages/Common/Login";
import EmailVerification from "@/components/EmailVerification";

const ProtectedRoute = () => {
  const user = localStorage.getItem("userInfo");
  if (!user) return <Navigate to="/login" replace={true} />;
  return <Outlet />;
};
function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      <Route path="/verify-email" element={<EmailVerification />} />

      <Route element={<ProtectedRoute />}>
        {/* <Route element={<PrivateRoutes />}>
   
        </Route> */}{" "}
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;
