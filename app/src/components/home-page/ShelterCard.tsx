import React from "react";
import { Link } from "react-router-dom";
import Image_1 from "@/assets/card_1jpg.jpg";
import { Badge } from "@/components/ui/badge";
import { HomeIcon } from "lucide-react";
import type { Shelter } from "@/types/Shelter";

interface ShelterCardProps {
  shelter: Shelter;
}
function ShelterCard({ shelter }: ShelterCardProps) {
  return (
    <Link
      to={`/shelters/${shelter?._id}`}
      className="relative group aspect-square overflow-hidden rounded-xl max-w-50 max-h-50 min-w-40 min-h-40  shadow-lg transition-transform"
    >
      {/* Image */}
      <img src={shelter?.avatar} className="w-full h-full object-cover" />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Hover Badge */}
      <Badge className="absolute text-white bg-transparent top-3 right-3 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <HomeIcon />
      </Badge>

      {/* Text */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
        <div className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {shelter?.bio}
        </div>
        <h3 className="text-lg font-bold mt-2 line-clamp-1">{shelter?.name}</h3>
      </div>
    </Link>
  );
}

export default ShelterCard;
