import { ArrowRight, Cake, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image_1 from "@/assets/card_1jpg.jpg";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import type { Pet } from "@/types/Pet";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "../ui/avatar";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  return (
    <div className="max-w-sm rounded-xl bg-(--card) shadow-sm border border-border overflow-hidden transition hover:shadow-md cursor-pointer">
      {/* Image section */}
      <div className="relative h-64">
        {/* <img
          src={
            pet?.photos?.[0] ||
            "https://i.pinimg.com/736x/ad/11/3a/ad113a545bc1278f9c5bc4ea770bc839.jpg"
          }
          alt={pet?.name}
          className="w-full h-full object-cover object-top"
        /> */}
        <Avatar className="">
          <AvatarImage
            src={pet?.photos?.[0]}
            className="w-full h-full object-cover object-top"
          />
          <AvatarFallback className="bg-(--secondary) text-(--foreground) text-2xl font-bold rounded-none">
            {pet?.name?.charAt(0).toUpperCase() || "N"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content section */}
      <div className="p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Badge className="cursor-pointer">
                <Cake className="w-4 h-4" />
                <span>
                  {pet?.age == null || pet?.age == 0 || pet?.age == undefined
                    ? "Chưa xác định tuổi"
                    : pet.age >= 12
                      ? `${Math.floor(pet.age / 12)} tuổi`
                      : `${pet.age} tháng tuổi`}
                </span>
              </Badge>

            </div>
          </TooltipTrigger>
          <TooltipContent className=" bg-(--background) text-(--foreground) border border-(--border)">
            <p>
             {pet?.age == null
                    ? "Chưa xác định tuổi"
                    : pet.age >= 12
                      ? `${Math.floor(pet.age / 12)} tuổi`
                      : `${pet.age} tháng tuổi`}
            </p>
          </TooltipContent>
        </Tooltip>
        <h3 className="text-xl font-bold text-foreground mb-2 mt-3 px-1">
          {pet?.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 px-1">
          {pet?.bio}
        </p>
        <Button variant="ghost" className="gap-2" asChild>
          <Link
            to={`/pets/${pet?._id}`}
            onClick={() =>
              window.scrollTo({ top: 0, left: 0, behavior: "instant" })
            }
          >
            Xem thêm <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
