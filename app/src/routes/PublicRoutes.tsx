import HomePage from '@/pages/Common/HomePage'
import LandingPage from '@/pages/Common/LandingPage'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

function PublicRoutes() {
  return (
    <>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
    </>
  )
}

export default PublicRoutes
