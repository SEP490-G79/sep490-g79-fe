import { ArrowRight, Dog, Heart, MapPin, TrainFrontTunnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import type { Pet } from "@/types/Pet";
import type { User } from "@/types/User";
import { Cake, Weight, Cat } from "lucide-react";

interface PetCardProps {
    pet: Pet;
    user: {
        _id: string;
        wishList: string[];
    } | null;
}

function PetsList({ pet, user }: PetCardProps) {
    const isWished = user?.wishList.includes(pet?._id);


    const ageDisplay =
        pet?.age != null
            ? pet.age >= 12
                ? `${Math.floor(pet.age / 12)} tuổi`
                : `${pet.age} tháng`
            : "Chưa xác định";

    const weightDisplay =
        pet?.weight != null ? `${pet.weight} kg` : "Chưa xác định";

    const genderDisplay =
        pet?.isMale === true
            ? "Đực"
            : pet?.isMale === false
                ? "Cái"
                : "Chưa xác định";

    const breedsDisplay = pet?.breeds?.length
        ? pet.breeds.length > 1
            ? `Con lai giữa ${pet.breeds.map((b) => b.name).join(" và ")}`
            : pet.breeds[0].name
        : "Chưa xác định";

    const shelterName = pet?.shelter?.name || "Chưa xác định";
    const shelterAddress = pet?.shelter?.address || "Chưa xác định";

    const tokenMoneyDisplay =
        pet?.tokenMoney === 0
            ? "Miễn phí"
            : pet?.tokenMoney == null
                ? "Chưa xác định"
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                }).format(pet.tokenMoney);

    const speciesName = pet?.species?.name?.toLowerCase();
    const SpeciesIcon =
        speciesName === "chó"
            ? Dog
            : speciesName === "mèo"
                ? Cat
                : TrainFrontTunnel;

    return (
        <div
            className="max-w-sm h-full flex flex-col justify-between rounded-xl bg-(--card) shadow-sm border border-border overflow-hidden 
      transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.005] cursor-pointer"
        >
            {/* Image section */}
            <div className="relative h-64">
                <img
                    src={
                        pet?.photos?.[0] ||
                        "https://i.pinimg.com/736x/ad/11/3a/ad113a545bc1278f9c5bc4ea770bc839.jpg"
                    }
                    alt={pet?.name || "Ảnh thú cưng"}
                    className="w-full h-full object-cover object-top"
                />

                {/* Heart icon wishlist */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className={`absolute top-2 right-2 z-10 p-1 hover:scale-130 transition-transform duration-200 ${isWished ? "text-red-600" : "text-gray-400"
                                }`}
                            onClick={() => {
                                console.log(
                                    `${isWished ? "Remove from" : "Add to"} wishlist:`,
                                    pet._id
                                );
                            }}
                        >
                            <Heart
                                className={`w-6 h-6 ${isWished ? "fill-red-600" : "fill-none"
                                    }`}
                            />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent >
                        {isWished ? "Bỏ yêu thích" : "Yêu thích"}
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-grow justify-between p-3 relative">
                <div className="flex flex-wrap gap-2 pb-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Badge className="cursor-pointer">
                                    <Cake className="w-4 h-4" />
                                    <span>{ageDisplay}</span>
                                </Badge>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] break-words">Tuổi: {ageDisplay}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Badge className="cursor-pointer">
                                    <Weight className="w-4 h-4" />
                                    <span>{weightDisplay}</span>
                                </Badge>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] break-words">Cân nặng: {weightDisplay}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Badge className="cursor-pointer">
                                    <SpeciesIcon className="w-4 h-4" />
                                    <span>{genderDisplay}</span>
                                </Badge>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] break-words">Giới tính: {genderDisplay}</TooltipContent>
                    </Tooltip>
                </div>


                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                        {pet?.name || "Chưa xác định"}
                    </h3>

                    <div className="flex">
                        <div className="min-w-[100px] text-sm font-medium text-foreground">
                            Huyết thống:
                        </div>
                        <div className="text-sm text-muted-foreground">{breedsDisplay}</div>
                    </div>

                    <div className="flex">
                        <div className="min-w-[100px] text-sm font-medium text-foreground">
                            Nơi ở hiện tại:
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {shelterName}, {shelterAddress}
                        </div>
                    </div>

                    <div className="flex">
                        <div className="min-w-[100px] text-sm font-medium text-foreground">
                            Phí nhận nuôi:
                        </div>
                        <div
                            className={`text-sm font-medium ${pet?.tokenMoney === 0
                                    ? "text-lime-600"
                                    : pet?.tokenMoney == null
                                        ? "text-muted-foreground"
                                        : "text-yellow-500"
                                }`}
                        >
                            {tokenMoneyDisplay}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <Button variant="ghost" className="gap-2 pl-0" asChild>
                       <Link to={`/pets/${pet._id}`}>Xem thêm <ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PetsList;
