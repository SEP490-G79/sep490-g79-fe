import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";
import LandingPage from "@/pages/Common/LandingPage";
import { Navigate, Outlet } from "react-router-dom";
import { Login } from "@/pages/Common/Login";
import EmailVerification from "@/components/EmailVerification";
import ProfilePage from "@/pages/user/profile/ProfilePage";
import Newfeed from "@/pages/Common/NewFeed";
import ProfileSettings from "@/components/user-profile/ProfileSetting";
import HomePage from "@/pages/Common/HomePage";
import HandleVerify from "@/pages/Common/HandleVerify";
import { Register } from "@/pages/Common/Register";
import { FAQ } from "@/pages/Common/FAQ";
import ShelterPage from "@/pages/Shelter/ShelterPage";
import Shelters from "@/pages/Shelter/Shelters";
import NotFound from "@/pages/Common/NotFound";
import ManageShelter from "@/pages/Shelter/ManageShelter";
import { AdoptionForms } from "@/components/shelter/shelter-management/adoption-form/AdoptionForms";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/active-account" element={<HandleVerify />} />
      </Route>
      <Route path="/faq" element={<FAQ />} />
      <Route path="/shelters" element={<Shelters />} />
      <Route path="/shelters/:shelterId" element={<ShelterPage />} />

      <Route path="/shelters/:shelterId/management" element={<ManageShelter />}>
        <Route index element={<div>settings</div>} />
        <Route path="staffs-management" element={<div>Quản lý thành viên</div>} />
        <Route path="pet-profiles" element={<div>Quản lý pets</div>} />
        <Route path="adoption-templates" element={<div>Quản lý adoption templates</div>} />
        <Route path="adoption-forms" element={<AdoptionForms/>} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/home" replace={true} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/newfeed" element={<Newfeed />} />
        <Route path="/profile-setting" element={<ProfileSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
