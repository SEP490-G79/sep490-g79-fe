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
import PostDetail from "@/components/post/PostDetail";
import ProfileSettings from "@/pages/user/profile/ProfileSetting";
import HomePage from "@/pages/Common/HomePage";
import HandleVerify from "@/pages/Common/HandleVerify";
import { Register } from "@/pages/Common/Register";
import { FAQ } from "@/pages/Common/FAQ";

import ShelterStaffManagement from "@/components/shelter/manager/ShelterStaffManagement";

import ShelterManagerLayout from "@/components/layouts/shelter/ShelterManagerLayout";

import PetManagement from "@/components/shelter/shelterPet/PetManagement";

import PetsListPage from "@/pages/Pets/PetsListPage";
import PetProfilePage from "@/components/pet/PetProfilePage";
import ShelterPage from "@/pages/Shelter/ShelterPage";
import Shelters from "@/pages/Shelter/Shelters";
import NotFound from "@/pages/Common/NotFound";
import ManageShelter from "@/pages/Shelter/ManageShelter";
import { AdoptionForms } from "@/components/shelter/shelter-management/adoption-form/AdoptionForms";
import TemplateDialog from "@/components/shelter/shelter-management/adoption-template/TemplateDialog";
import ShelterEstablishmentPage from "@/pages/Shelter/ShelterEstablishmentPage";
import { AdoptionTemplates } from "@/components/shelter/shelter-management/adoption-template/AdoptionTemplates";


import ShelterRequestsList from "@/pages/Shelter/ShelterRequestsList";
import ViewPetDetails from "@/pages/Pets/ViewPetDetails";
import ShelterDashboard from "@/pages/Shelter/ShelterDashboard";
import ShelterProfile from "@/components/shelter/manager/ShelterProfile";

import DonationPage from "@/pages/Donation/DonationPage";
import DonateSuccess from "@/pages/Donation/DonateSuccess";
import DonateCancel from "@/pages/Donation/DonateCancel";

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


      <Route path="/shelters/:shelterId/management" element={<ManageShelter />}>
        <Route index element={<ShelterProfile />} />
        <Route path="staffs-management" element={<ShelterStaffManagement />} />
        <Route path="pet-profiles" element={<PetManagement />} />
        <Route path="adoption-templates" element={<AdoptionTemplates />} />
        <Route path="adoption-templates/:templateId" element={<TemplateDialog />} />
        <Route path="adoption-forms" element={<AdoptionForms />} />
        <Route path="dashboard" element={<ShelterDashboard />} />


      </Route>

      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/home" replace={true} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        
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

      <Route path="/donation" element={<DonationPage />} />
      <Route path="/donation/success" element={<DonateSuccess />} />
      <Route path="/donation/cancel" element={<DonateCancel />} />
      <Route path="/newfeed" element={<Newfeed />}/>
      <Route path="/post-detail/:postId" element={<PostDetail />} />
      



      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;