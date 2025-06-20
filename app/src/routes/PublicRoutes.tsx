
import LandingPage from "@/pages/Common/LandingPage";
import { Login } from "@/pages/Common/Login";
import { Register } from "@/pages/Common/Register";
import HomePage from '@/pages/Common/HomePage'
import LandingPage from '@/pages/Common/LandingPage'
import Newfeed from '@/pages/Common/NewFeed'
import ProfilePage from '@/pages/user/profile/ProfilePage'
import ProfileSettings from '@/components/user-profile/ProfileSetting'



import React from "react";
import { Route } from "react-router-dom";
import HandleVerify from "@/pages/Common/HandleVerify";

function PublicRoutes() {
  return (
    <>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/active-account" element={<HandleVerify />} />
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/newfeed' element={<Newfeed/>}/>
        <Route path='/profile-setting' element={<ProfileSettings/>}/>
    </>
  );
}

export default PublicRoutes;
