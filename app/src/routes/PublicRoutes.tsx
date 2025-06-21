import LandingPage from "@/pages/Common/LandingPage";
import { Login } from "@/pages/Common/Login";
import { Register } from "@/pages/Common/Register";
import HomePage from "@/pages/Common/HomePage";
import Newfeed from "@/pages/Common/NewFeed";
import ProfilePage from "@/pages/user/profile/ProfilePage";
import ProfileSettings from "@/components/user-profile/ProfileSetting";

import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import HandleVerify from "@/pages/Common/HandleVerify";
import EmailVerification from "@/components/EmailVerification";
import type { User } from "@/types/User";

function PublicRoutes() {
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

  if (user) {
    return <Navigate to="/home" replace={true} />;
  }
  return <Outlet />;
  
}

export default PublicRoutes;
