import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image_1 from "@/assets/card_1jpg.jpg";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link } from "react-router-dom";

export default function PetCard() {
  return (
    <div className="max-w-sm rounded-xl bg-(--card) shadow-sm border border-border overflow-hidden transition hover:shadow-md cursor-pointer">
      {/* Image section */}
      <div className="relative h-64">
        <img
          src={Image_1}
          alt="Kevin the cat"
          className="w-full h-full object-cover"  
        />
      </div>

      {/* Content section */}
      <div className="p-3">
        <Tooltip >
          <TooltipTrigger asChild>
            <div>
              <Badge className="cursor-pointer ">
                <MapPin className="w-4 h-4" />
                <span>
                  6 tháng
                </span>
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className=" bg-(--background) text-(--foreground) border border-(--border)">
            <p>
              6 tháng tuổi
            </p>
          </TooltipContent>
        </Tooltip>
        <h3 className="text-xl font-bold text-foreground mb-2">Kevin</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          He loves people and loves the attention. Likes to go out for long
          walks and is good on the lead. Rex is great!
        </p>
        <Button variant="ghost" className="gap-2" asChild>
          <Link to="/">Xem thêm <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </div>
    </div>
  );
};
