import {CTA} from '@/components/landing-page/CTA'
import HeroSection from '@/components/landing-page/HeroSection'
import Intro from '@/components/landing-page/Intro'
import Pets from '@/components/landing-page/Pets'
import {Testimonial} from '@/components/landing-page/Testimonial'
import React from 'react'

function LandingPage() {
  return (
    <>
      <HeroSection/>
      <Intro/>
      <CTA/>
      <Pets/>
      <Testimonial/>
      
    </>
  )
}

export default LandingPage
