import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Heart, MessageSquare, Globe, GlobeLock, MoreHorizontal } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import dayjs from "dayjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import ReportPostDialog from "./ReportPost";

interface PostType {
  id: string;
  createdBy: string;
  title: string;
  privacy: string;
  photos: string[];
  likedBy: string[];
  status: string;
  createdAt: string;
  user: {
    avatar: string;
    fullName: string;
  };
}

interface PostCardProps {
  post: PostType;
  currentUserId: string;
    onLike: (postId: string | number) => void;
}

  const formatCreatedAt = (date: string | Date): string => {
    const now = dayjs();
    const target = dayjs(date);

    if (now.isSame(target, 'day')) {
      return target.fromNow();
    }

    return target.format('DD/MM/YYYY');
  };

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId,onLike }) => {
  return (
    <Card className="shadow-md dark:bg-gray-800">
      <CardHeader className="flex justify-between">
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-center gap-x-3">
            <img
              src={post?.user.avatar || "/placeholder.svg"}
              alt="Avatar"
              className="w-14 h-14 rounded-full border border-secondary shadow-md"
            />
            <div className="flex flex-col justify-top h-14">
              <span>{post.createdBy}</span>
              <div className="text-xs text-sidebar-ring flex items-center gap-2">
                <span>{formatCreatedAt(post.createdAt)}</span>
                {post.privacy === "private" ? (
                  <GlobeLock size={16} className="text-sidebar-ring" />
                ) : (
                  <Globe size={16} className="text-sidebar-ring" />
                )}
              </div>
            </div>
          </div>
        </CardTitle>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <ReportPostDialog postId={post.id} key={post.id} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardDescription className="px-6 pb-2 text-sm text-foreground dark:text-gray-300">
        {post.title}
      </CardDescription>

      {post?.photos.length > 0 && (
        <CardContent>
          <PhotoProvider maskOpacity={0}>
            {post.photos.length === 1 && (
              <PhotoView src={post.photos[0]}>
                <img
                  src={post.photos[0]}
                  alt="Single"
                  className="w-full h-80 object-cover rounded-lg cursor-pointer"
                />
              </PhotoView>
            )}

            {post.photos.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {post.photos.map((url, idx) => (
                  <PhotoView key={idx} src={url}>
                    <img
                      src={url}
                      alt={`Photo ${idx}`}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer"
                    />
                  </PhotoView>
                ))}
              </div>
            )}

            {post.photos.length === 3 && (
              <div className="grid grid-cols-3 gap-2">
                <PhotoView src={post.photos[0]}>
                  <img
                    src={post.photos[0]}
                    alt="Photo 0"
                    className="col-span-2 h-64 object-cover rounded-lg cursor-pointer"
                  />
                </PhotoView>
                <div className="flex flex-col gap-2">
                  {post.photos.slice(1).map((url, idx) => (
                    <PhotoView key={idx} src={url}>
                      <img
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        className="h-31 object-cover rounded-lg cursor-pointer"
                      />
                    </PhotoView>
                  ))}
                </div>
              </div>
            )}

            {post.photos.length > 3 && (
              <div className="grid grid-cols-2 gap-2 relative">
                {post.photos.slice(0, 3).map((url, idx) => (
                  <PhotoView key={idx} src={url}>
                    <img
                      src={url}
                      alt={`Photo ${idx}`}
                      className="w-full h-40 object-cover rounded-lg cursor-pointer"
                    />
                  </PhotoView>
                ))}
                <PhotoView src={post.photos[3]}>
                  <div className="relative cursor-pointer">
                    <img
                      src={post.photos[3]}
                      alt="Photo 3"
                      className="w-full h-40 object-cover rounded-lg brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white  bg-secondary/30 text-base font-medium px-2 py-1 rounded-md backdrop-blur-none">
                        +{post.photos.length - 4}
                      </span>
                    </div>
                  </div>
                </PhotoView>
              </div>
            )}

            {post.photos.length === 0 && (
              <p className="text-gray-400 italic">No photos</p>
            )}
          </PhotoProvider>
        </CardContent>
      )}

      <CardFooter className="text-sm text-gray-500 px-4">
        <div className="flex w-full justify-between">
          {/* Nửa trái: Like */}
          <div
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1 cursor-pointer w-1/2 ml-3 ${
              post.likedBy.includes(currentUserId) ? "text-red-500" : ""
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>{post.likedBy.length}</span>
          </div>

          {/* Nửa phải: Bình luận */}
          <div className="flex items-center gap-1 justify-start w-1/2 cursor-pointer">
            <MessageSquare className="w-5 h-5" />
            <span>Bình luận</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;