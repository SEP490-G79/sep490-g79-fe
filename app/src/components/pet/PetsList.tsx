import { useState, useContext, useEffect } from "react";
import { ArrowRight, Dog, Heart, TrainFrontTunnel, Cake, Weight, Cat, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Pet } from "@/types/Pet";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { Skeleton } from "../ui/skeleton";
import ReturnRequestDialog from "@/components/user/return-request/ReturnRequestDialog";
interface PetCardProps {
    pet: Pet;
    user: {
        _id: string;
        wishList: string[];
    } | null;
    isLoading: boolean;
}


function PetsList({ pet, user, isLoading, }: PetCardProps) {
    const { coreAPI, refreshUserProfile } = useContext(AppContext);
    const navigate = useNavigate();
    const authAxios = useAuthAxios();
    const [isWished, setIsWished] = useState(user?.wishList.includes(pet._id) || false);
    const [ReturnDialog, setReturnDialog] = useState(false);
    const isAdoptedByUser = typeof pet.adopter === "object" && pet.adopter?._id === user?._id;


    useEffect(() => {
        if (user && user.wishList.includes(pet._id)) {
            setIsWished(true);
        } else {
            setIsWished(false);
        }
    }, [user, pet._id]);

    const handleToggleWishlist = async () => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập để sử dụng tính năng này.");
            setTimeout(() => navigate("/login"), 800);
            return;
        }

        try {
            const res = await authAxios.put(`${coreAPI}/users/wishlist/${pet._id}`);
            setIsWished(res.data.isWished);
            await refreshUserProfile();
            toast.success(res.data.message);
        } catch (err) {
            console.error("Lỗi wishlist:", err);
            toast.error("Không thể cập nhật wishlist. Vui lòng thử lại.");
        }
    };


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

    if (isLoading) {
        return (
            <div
                className="max-w-sm h-full flex flex-col justify-between rounded-xl bg-(--card)
                         shadow-sm border border-border overflow-hidden
                         transform transition-all duration-300
                         hover:shadow-lg hover:-translate-y-1 hover:scale-[1.005] cursor-pointer"
            >
                {/* Image section */}
                <div className="relative h-64">
                    <Skeleton className="w-full h-full" />
                    {/* Heart icon placeholder */}
                    <Skeleton className="absolute top-2 right-2 w-6 h-6" />
                </div>

                {/* Content section */}
                <div className="flex flex-col flex-grow justify-between p-3 relative">
                    {/* Badges row */}
                    <div className="flex flex-wrap gap-2 pb-3">
                        <Skeleton className="w-16 h-6" />
                        <Skeleton className="w-16 h-6" />
                        <Skeleton className="w-16 h-6" />
                    </div>

                    {/* Text lines */}
                    <div className="space-y-2">
                        {/* Title */}
                        <Skeleton className="w-3/4 h-6" />
                        {/* Four lines of details */}
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-2/3 h-4" />
                    </div>

                    {/* Button placeholder */}
                    <div className="mt-auto pt-4">
                        <Skeleton className="w-20 h-8 rounded" />
                    </div>
                </div>
            </div>
        );
    }
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
                {isAdoptedByUser ? (
                    <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition hover:text-primary cursor-pointer">
                                    <Ellipsis className="w-6 h-6" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setReturnDialog(true)}>
                                    Yêu cầu trả thú cưng
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                className={`absolute top-2 right-2 z-10 p-1 hover:scale-130 transition-transform duration-200 ${isWished ? "text-red-600" : "text-gray-400"}`}
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`w-6 h-6 ${isWished ? "text-red-500" : ""}`} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{isWished ? "Bỏ yêu thích" : "Yêu thích"}</TooltipContent>
                    </Tooltip>
                )}
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
            {pet.petCode && pet.shelter && (
                <ReturnRequestDialog
                    open={ReturnDialog}
                    onOpenChange={setReturnDialog}
                    pet={{
                        _id: pet._id,
                        name: pet.name,
                        petCode: pet.petCode, 
                        photos: pet.photos || [],
                    }}
                    shelter={{
                        _id: pet.shelter._id,
                        name: pet.shelter.name,
                        avatar: pet.shelter.avatar,
                    }}
                />
            )}
        </div>
    );
}

export default PetsList;
