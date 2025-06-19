import HomePage from '@/pages/Common/HomePage'
import LandingPage from '@/pages/Common/LandingPage'
import Newfeed from '@/pages/Common/NewFeed'
import Newsfeed from '@/pages/Common/NewFeed'
import ProfilePage from '@/pages/user/profile/ProfilePage'

import React from 'react'
import { Route, Routes } from 'react-router-dom'

function PublicRoutes() {
  return (
    <>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/home' element={<HomePage/>}/>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='/newfeed' element={<Newfeed/>}/>
    </>
  )
}

export default PublicRoutes
