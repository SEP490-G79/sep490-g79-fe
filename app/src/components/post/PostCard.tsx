import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Heart, MessageSquare, Globe, GlobeLock, MapPinIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import dayjs from "dayjs";
import type { PostType } from "@/types/Post";
import type { CommentType } from "@/types/Comment";
import { useState } from "react";
import ReportPostDialog from "./ReportPost";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: PostType;
  currentUserId: string;
  onLike: (postId: string | number) => void;
  isGuest?: boolean;
  onEdit: (post: PostType) => void;
  onDelete: (post: PostType) => void;
  latestComment?: CommentType | null;
  onViewDetail: (postId: string) => void;
}

const formatCreatedAt = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);

  if (now.isSame(target, 'day')) {
    return target.fromNow();
  }

  return target.format('DD/MM/YYYY');
};

const PostCard: React.FC<PostCardProps> = ({ post, currentUserId, onLike, isGuest, onEdit, onDelete, latestComment, onViewDetail }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = post.title.length > 300;
  const displayedText = !expanded && shouldTruncate
    ? post.title.slice(0, 300) + "..."
    : post.title;
  return (
    <Card className="shadow-md dark:bg-gray-800">
      <CardHeader className="pt-4 pb-2 relative">
        <CardTitle className="text-lg font-semibold">
          <div className="flex items-start justify-between">
            <div className="flex gap-x-3">
              <Link
                to={
                  post.shelter
                    ? `/shelters/${post.shelter._id}`
                    : `/profile/${post.createdBy}`
                }
                className="flex gap-x-3 items-start hover:underline"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={post.shelter?.avatar || post.user.avatar || "/placeholder.svg"}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {(post.shelter?.name || post.user.fullName)?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex flex-col justify-top text-sm">
                <Link
                  to={
                    post.shelter
                      ? `/shelters/${post.shelter._id}`
                      : `/profile/${post.createdBy}`
                  }
                  className="hover:underline"
                >
                  <span className="font-medium">
                    {post.shelter?.name || post.user.fullName}
                  </span>
                </Link>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{formatCreatedAt(post.createdAt)}</span>
                  {post.privacy.includes("public") ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <GlobeLock className="w-4 h-4" />
                  )}
                </div>
              </div>

            </div>

            {/* Chỉ hiển thị khi là chủ bài viết */}
            {String(
              typeof post.createdBy === "object"
                ? post.createdBy._id
                : post.createdBy
            ) === String(currentUserId) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Ellipsis className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 p-1 z-50">
                  <DropdownMenuItem onClick={() => onEdit(post)}>
                    <Pencil className="w-4 h-4 text-blue-500 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                    <Trash2 className="w-4 h-4 text-red-500 mr-2" />
                    Xóa bài đăng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Ellipsis className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 p-1 z-50">
                  <ReportPostDialog postId={post._id} key={post._id} />
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <AlertDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa bài viết này? Thao tác này không
                    thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      onDelete(post);
                      setOpenDeleteDialog(false);
                    }}
                  >
                    Xoá
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>

        {post.address && (
          <div className="text-xs text-primary font-medium mb-1 bg-muted px-2 py-1 rounded-full inline-flex items-center w-fit">
            <MapPinIcon className="w-3 h-3 mr-1" />
            {post.address}
          </div>
        )}
      </CardHeader>

      <CardDescription className="px-6 pb-2 text-sm text-foreground dark:text-gray-300 whitespace-pre-line">
        {displayedText}
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-blue-500 underline text-xs cursor-pointer hover:text-blue-600"
          >
            {expanded ? "Ẩn bớt" : "Xem thêm"}
          </button>
        )}
      </CardDescription>

      {post?.photos.length > 0 && (
        <CardContent>
          <PhotoProvider>
            <div className="grid grid-cols-2 gap-2">
              {/* Hiển thị 3 ảnh đầu */}
              {post.photos.slice(0, 3).map((url, idx) => (
                <PhotoView key={idx} src={url}>
                  <img
                    src={url}
                    alt={`Photo ${idx}`}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                  />
                </PhotoView>
              ))}

              {/* Ảnh thứ 4 có overlay nếu còn ảnh nữa */}
              {post.photos.length > 3 && (
                <PhotoView src={post.photos[3]}>
                  <div className="relative cursor-pointer">
                    <img
                      src={post.photos[3]}
                      alt="Photo 3"
                      className="w-full h-40 object-cover rounded-lg brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white bg-secondary/30 text-base font-medium px-2 py-1 rounded-md">
                        +{post.photos.length - 3}
                      </span>
                    </div>
                  </div>
                </PhotoView>
              )}

              {/* Các ảnh còn lại để PhotoProvider nhận */}
              {post.photos.slice(4).map((url, idx) => (
                <PhotoView key={idx + 4} src={url}>
                  <div className="hidden" />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        </CardContent>
      )}

      <hr />

      <CardFooter className="text-sm text-gray-500 px-4">
        <div className="flex w-full justify-between">
          <div
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-1 cursor-pointer w-1/2 ml-3 ${post.likedBy.includes(currentUserId) ? "text-red-500" : ""
              }`}
          >
            <Heart className="w-5 h-5" />
            <span>{post.likedBy.length}</span>
          </div>
          <div
            className="flex items-center gap-1 justify-start w-1/2 cursor-pointer"
            onClick={() => {
              onViewDetail(post._id);
            }}
          >
            <MessageSquare className="w-5 h-5" />
            <p className="min-w-15"> Bình luận</p>
          </div>
        </div>
      </CardFooter>

      <hr />

      {latestComment && (
        <div className="flex items-start gap-2 px-4  mt-1 hover:bg-muted/60 rounded-md">
          <Link
            to={`/profile/${latestComment.commenter._id}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={latestComment.commenter.avatar || "/placeholder.svg"} />
              <AvatarFallback>{latestComment.commenter.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
            <Link
              to={`/profile/${latestComment.commenter._id}`}
              className="text-foreground hover:underline flex flex-col gap-1"
            >
              <p className="text-xs font-semibold">
                {latestComment.commenter.fullName}
              </p>
            </Link>
            <p className="text-sm text-foreground">{latestComment.message}</p>

          </div>
        </div>
      )}

      <div className="px-4 ">
        <button
          className="text-gray-600 hover:underline text-sm flex items-center gap-1 cursor-pointer"
          onClick={() => onViewDetail(post._id)}
        >
          Xem thêm bình luận
        </button>
      </div>
    </Card>
  );
};

export default PostCard;