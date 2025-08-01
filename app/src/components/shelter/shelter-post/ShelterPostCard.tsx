import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Globe, GlobeLock, Ellipsis, Pencil, Trash2, MapPinIcon, Heart, MessageSquare } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";

type ShelterPostCardProps = {
  post: any;
  currentUserId: string;
  onLike: (postId: string) => void;
  onEdit: (post: any) => void;
  onDelete: (postId: string) => void;
  onViewDetail: (postId: string) => void;
  isGuest?: boolean;
};

export default function ShelterPostCard({
  post,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
  onViewDetail,
  isGuest = false,
}: ShelterPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const currentMember = post.shelter?.members?.find((m: any) => m._id?._id === currentUserId || m._id === currentUserId);
  const roles = currentMember?.roles || [];
  const isManager = roles.includes("manager");
  const isOwner = post.createdBy?._id === currentUserId;


  const formatCreatedAt = (date: string | Date): string => {
    const now = dayjs();
    const target = dayjs(date);
    if (now.isSame(target, "day")) return target.fromNow();
    return target.format("DD/MM/YYYY");
  };

  return (
    <Card className="shadow-md bg-(--card)">
      <CardHeader className="pt-4 pb-2 relative">
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-start justify-between">
            <div className="flex gap-x-3">
              <Link
                to={`/shelters/${post.shelter?._id}`}
                className="flex gap-x-3 items-start hover:underline"
              >
                <Avatar className="w-10 h-10 object-center object-cover ring-2 ring-(--primary)">
                  <AvatarImage src={post.shelter?.avatar || "/placeholder.svg"} alt="shelter avatar" />
                  <AvatarFallback>{post.shelter?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col text-sm">

                <span className="font-medium leading-snug">
                  <Link
                    to={`/shelters/${post.shelter._id}`}
                    className="hover:underline"
                  >
                    {post.shelter.name}
                  </Link>

                  <span className="text-xs text-muted-foreground block mt-0.5 flex items-center gap-1">
                    {currentMember && (
                      <>
                        Người đăng: {post.createdBy.fullName}
                        <span className="mx-1">•</span>
                      </>
                    )}
                    {formatCreatedAt(post.createdAt)}
                    {post.privacy === "public" ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <GlobeLock className="w-4 h-4" />
                    )}
                  </span>
                </span>


              </div>

            </div>

            {(isManager || isOwner) && !isGuest && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md cursor-pointer">
                    <Ellipsis className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(post)} className="cursor-pointer">
                    <Pencil className="w-4 h-4 text-blue-500 mr-2" /> Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(post._id)} className="cursor-pointer">
                    <Trash2 className="w-4 h-4 text-red-500 mr-2" /> Xóa bài đăng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardTitle>

        {post.address && (
          <div className="text-xs text-primary font-medium mb-1 bg-muted px-2 py-1 rounded-full inline-flex items-center w-fit">
            <MapPinIcon className="w-3 h-3 mr-1" />
            {post.address}
          </div>
        )}
      </CardHeader>

      <CardDescription className="px-6 pb-2 whitespace-pre-line text-sm text-foreground">
        {post.title.length > 300 && !expanded ? (
          <>
            {post.title.slice(0, 300)}...
            <button
              onClick={() => setExpanded(true)}
              className="ml-2 text-xs cursor-pointer hover:text-primary"
            >
              Xem thêm
            </button>
          </>
        ) : (
          <>
            {post.title}
            {post.title.length > 300 && (
              <button
                onClick={() => setExpanded(false)}
                className="ml-2 text-xs cursor-pointer hover:text-primary"
              >
                Ẩn bớt
              </button>
            )}
          </>
        )}
      </CardDescription>

      {post.photos?.length > 0 && (
        <CardContent>
          <PhotoProvider>
            <div className="grid grid-cols-2 gap-2">
              {post.photos.slice(0, 4).map((url: string, idx: number) => {
                const isOverlay = idx === 3 && post.photos.length > 4;
                const extraCount = post.photos.length - 4;
                return (
                  <PhotoView key={idx} src={url}>
                    <div className="relative cursor-pointer">
                      <img
                        src={url}
                        alt={`Ảnh ${idx + 1}`}
                        className={`w-full h-40 object-cover rounded-lg ${isOverlay ? "brightness-50" : ""}`}
                      />
                      {isOverlay && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white bg-black/50 text-sm font-semibold px-3 py-1 rounded-lg">
                            +{extraCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </PhotoView>
                );
              })}
            </div>
          </PhotoProvider>
        </CardContent>
      )}

      <hr />

      <CardFooter className="text-sm text-gray-500 px-4">
        <div className="flex w-full justify-between">
          <div
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-1 cursor-pointer w-1/2 ml-3 ${post.likedBy.includes(currentUserId) ? "text-red-500" : ""}`}
          >
            <Heart className="w-5 h-5" />
            <span>{post.likedBy.length}</span>
          </div>
          <div
            className="flex items-center gap-1 justify-start w-1/2 cursor-pointer"
            onClick={() => onViewDetail(post._id)}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Bình luận</span>
          </div>
        </div>
      </CardFooter>

      {post.latestComment && <hr />}

      {post.latestComment && (
        <div className="flex items-start gap-2 px-4 mt-1 hover:bg-muted/60 rounded-md">
          <Link
            to={`/profile/${post.latestComment.commenter?._id}`}
          >
            <Avatar className="w-8 h-8 object-center object-cover ring-2 ring-(--primary)">
              <AvatarImage src={post.latestComment.commenter?.avatar || "/placeholder.svg"} alt="commenter avatar" />
              <AvatarFallback>{post.latestComment.commenter?.fullName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
            <Link
              to={`/profile/${post.latestComment.commenter?._id}`}
            >
              <p className="text-xs font-semibold">{post.latestComment.commenter?.fullName}</p>
              <p className="text-sm">{post.latestComment.message}</p>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
