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
};

export default function ShelterPostCard({
  post,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
  onViewDetail,
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
    <Card className="shadow-md dark:bg-gray-800">
      <CardHeader className="pt-4 pb-2 relative">
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-start justify-between">
            <div className="flex gap-x-3">
              <Link
                to={`/shelters  /${post.shelter?._id}`}
                className="flex gap-x-3 items-start hover:underline"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.shelter?.avatar || "/placeholder.svg"} alt="shelter avatar" />
                  <AvatarFallback>{post.shelter?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col text-sm">
                <Link
                  to={`/shelters/${post.shelter?._id}`}
                  className="hover:underline"
                >
                  <span className="font-medium">{post.shelter?.name}</span>
                </Link>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{formatCreatedAt(post.createdAt)}</span>
                  {post.privacy === "public" ? <Globe className="w-4 h-4" /> : <GlobeLock className="w-4 h-4" />}
                </div>
              </div>

            </div>

            {(isManager || isOwner) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Ellipsis className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(post)}>
                    <Pencil className="w-4 h-4 text-blue-500 mr-2" /> Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(post._id)}>
                    <Trash2 className="w-4 h-4 text-red-500 mr-2" /> Xóa
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
              className="text-blue-500 underline ml-1 text-xs cursor-pointer"
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
                className="text-blue-500 underline ml-1 text-xs"
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

      <hr />

      {post.latestComment && (
        <div className="flex items-start gap-2 px-4 mt-1 hover:bg-muted/60 rounded-md">
          <img src={post.latestComment.commenter?.avatar} className="w-8 h-8 rounded-full" />
          <div className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
            <p className="text-xs font-semibold">{post.latestComment.commenter?.fullName}</p>
            <p className="text-sm">{post.latestComment.message}</p>
          </div>
        </div>
      )}

      <div className="px-4 pb-3">
        <button
          onClick={() => onViewDetail(post._id)}
          className="text-gray-600 hover:underline text-sm cursor-pointer"
        >
          Xem chi tiết
        </button>
      </div>
    </Card>
  );
}
