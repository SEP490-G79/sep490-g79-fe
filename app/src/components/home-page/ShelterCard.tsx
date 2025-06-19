import React from "react";
import { Link } from "react-router-dom";
import Image_1 from "@/assets/card_1jpg.jpg";
import { Badge } from "@/components/ui/badge";
import { HomeIcon } from "lucide-react";
function ShelterCard() {
  return (
    <Link
      to="/"
      className="relative group aspect-square overflow-hidden rounded-xl w-full max-w-sm shadow-lg transition-transform"
    >
      {/* Image */}
      <img src={Image_1} className="w-full h-full object-cover" />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hover Badge */}
      <Badge
        className="absolute bg-transparent top-3 right-3 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <HomeIcon/>
      </Badge>

      {/* Text */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
        <div className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          lỏemrewhno iewonfoewnfeiowbhuvu
        </div>
        <h3 className="text-lg font-bold mt-2">Hảo Trần</h3>
      </div>
    </Link>
  );
}

export default ShelterCard;
