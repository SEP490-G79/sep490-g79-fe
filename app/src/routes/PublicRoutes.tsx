import LandingPage from "@/pages/Common/LandingPage";
import { Login } from "@/pages/Common/Login";
import { Register } from "@/pages/Common/Register";

import React from "react";
import { Route } from "react-router-dom";

function PublicRoutes() {
  return (
    <>
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
    </>
  );
}

export default PublicRoutes;
