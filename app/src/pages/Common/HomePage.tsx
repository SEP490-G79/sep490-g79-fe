import HeroSection from "@/components/home-page/HeroSection";
import Posts from "@/components/home-page/Posts";
import Shelters from "@/components/home-page/Shelters";
import Pets from "@/components/landing-page/Pets";
import React from "react";

function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="bg-(--muted) py-5">
        <Shelters />
      </div>
      <Posts />
      <Pets />
    </>
  );
}

export default HomePage;
