import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import type { User } from "@/types/User";

export default function PrivateRoutes() {

  const userJson = localStorage.getItem("user");

  let user: User | null = null;
  try {
    if (userJson) {
      user = JSON.parse(userJson) as User;
    }
  } catch (e) {
    console.error("Lỗi khi parse user từ localStorage", e);
    user = null;
  }

  if (!user ||  !user.roles.includes("user")) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
}
