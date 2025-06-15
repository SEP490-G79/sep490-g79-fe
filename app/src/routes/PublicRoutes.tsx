import LandingPage from '@/pages/Common/LandingPage'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

function PublicRoutes() {
  return (
    <>
        <Route path='/landing-page' element={<LandingPage/>}/>
    </>
  )
}

export default PublicRoutes
