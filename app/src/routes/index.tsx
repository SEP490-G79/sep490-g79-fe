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
import ShelterEstablishmentPage from "@/pages/shelter/ShelterEstablishmentPage";
import ShelterStaffManagement from "@/components/shelter/manager/ShelterStaffManagement";
import ShelterProfile from "@/components/shelter/manager/ShelterProfile";
import ShelterManagerLayout from "@/components/layouts/shelter/ShelterManagerLayout";
import ViewPetDetails from "@/pages/pets/ViewPetDetails";
import PetManagement from "@/components/pet/PetManagement";
import ShelterDashboard from "@/pages/shelter/ShelterDashboard";
import PetsListPage from "@/pages/Pets/PetsListPage";
import  PetProfilePage  from "@/components/pet/PetProfilePage";
import ShelterPage from "@/pages/Shelter/ShelterPage";
import Shelters from "@/pages/Shelter/Shelters";
import NotFound from "@/pages/Common/NotFound";
import ManageShelter from "@/pages/Shelter/ManageShelter";
import { AdoptionForms } from "@/components/shelter/shelter-management/adoption-form/AdoptionForms";
import { AdoptionTemplates } from "@/components/shelter/shelter-management/adoption-form/AdoptionTemplates";
import ShelterRequestsList from "@/pages/Shelter/ShelterRequestsList";

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

      <Route path="/pets-list" element={<PetsListPage />} />
      <Route path="/pets/:id" element={<PetProfilePage />} />
      <Route path="/shelters" element={<Shelters />} />
      <Route path="/shelters/:shelterId" element={<ShelterPage />} />
      <Route path="/pet/:petId" element={<ViewPetDetails />} />
        <Route path="/shelter/pets" element={<PetManagement />} />
        <Route path="/shelter/dashboard" element={<ShelterDashboard />} />

      <Route path="/shelters/:shelterId/management" element={<ManageShelter />}>
        <Route index element={<ShelterProfile />} />
        <Route path="profile" element={<ShelterProfile />} />
        <Route path="staffs-management" element={<ShelterStaffManagement />} />
        <Route path="pet-profiles" element={<div>Quản lý pets</div>} />
        <Route path="adoption-templates" element={<AdoptionTemplates/>} />
        <Route path="adoption-forms" element={<AdoptionForms/>} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/home" replace={true} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/newfeed" element={<Newfeed />} />
        <Route path="/profile-setting" element={<ProfileSettings />} />
        <Route
          path="/shelter-establishment"
          element={<ShelterEstablishmentPage />}
        />
        <Route
          path="/shelter-request"
          element={<ShelterRequestsList />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
