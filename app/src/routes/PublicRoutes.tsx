import LandingPage from '@/pages/Common/LandingPage'
import ProfileSettings from '@/components/user-profile/ProfileSetting'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

function PublicRoutes() {
  return (
    <>
        <Route path='/landing-page' element={<LandingPage/>}/>
        <Route path='/profile-setting' element={<ProfileSettings/>}/>
    </>
  )
}

export default PublicRoutes
