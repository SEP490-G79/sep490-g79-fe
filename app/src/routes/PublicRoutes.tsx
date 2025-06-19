import LandingPage from '@/pages/Common/LandingPage'
import ProfilePage from '@/pages/user/profile/ProfilePage'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

function PublicRoutes() {
  return (
    <>
        <Route path='/landing-page' element={<LandingPage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
    </>
  )
}

export default PublicRoutes
