
import LandingPage from "@/pages/Common/LandingPage";
import { Login } from "@/pages/Common/Login";
import { Register } from "@/pages/Common/Register";
import HomePage from '@/pages/Common/HomePage'


import React from "react";
import { Route } from "react-router-dom";
import HandleVerify from "@/pages/Common/HandleVerify";

function PublicRoutes() {
  return (
    <>

      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/active-account" element={<HandleVerify />} />

        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>

    </>
  );
}

export default PublicRoutes;
