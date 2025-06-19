import HeroSection from "@/components/home-page/HeroSection";
import Posts from "@/components/home-page/Posts";
import Shelters from "@/components/home-page/Shelters";
import Pets from "@/components/landing-page/Pets";
import React from "react";

function HomePage() {
  return (
    <>
      <HeroSection />
      <Posts />
      <Shelters />
      <div className="bg-(--muted) py-5 mt-10">
        <Pets />
      </div>
    </>
  );
}

export default HomePage;
