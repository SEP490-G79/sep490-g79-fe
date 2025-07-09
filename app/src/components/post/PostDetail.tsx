import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useEffect, useState, useContext } from "react";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import type { PostType } from "@/types/Post";
import type { CommentType } from "@/types/Comment";
import { Globe, GlobeLock, Heart, Ellipsis, MessageSquare, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";

import Comment from "@/components/post/Comment";
import EditPostDialog from "@/components/post/EditPostDialog";
import axios from "axios";
export default function PostDetailDialog({
    postId,
    open,
    onOpenChange,
}: {
    postId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const authAxios = useAuthAxios();
    const { accessToken, coreAPI, userProfile, setUserProfile } = useContext(AppContext);

    const [post, setPost] = useState<PostType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const fetchUser = async () => {
        try {
            if (!userProfile && accessToken) {
                const res = await authAxios.get(`${coreAPI}/users/get-user`);
                setUserProfile(res.data);
            }
        } catch (err) {
            console.error("Lỗi lấy thông tin người dùng:", err);
        }
    };
    const fetchPostDetail = async () => {
        try {
            const res = await axios.get(`${coreAPI}/posts/${postId}`, accessToken ? {
                headers: { Authorization: `Bearer ${accessToken}` }
            } : {});
            setPost({
                ...res.data,
                likedBy: res.data.likedBy.map((u: any) =>
                    typeof u === "string" ? u : u._id
                ),
            });
        } catch {
            toast.error("Không thể tải bài viết");
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${coreAPI}/posts/${postId}/comments`, accessToken ? {
                headers: { Authorization: `Bearer ${accessToken}` }
            } : {});
            setComments(res.data);
        } catch {
            toast.error("Không thể tải bình luận");
        }
    };

    const handleLike = async () => {
        if (!userProfile?._id) return toast.warning("Bạn cần đăng nhập để thả tim.");
        try {
            await authAxios.post(`${coreAPI}/posts/react/${postId}`);
            setPost((prev) => {
                if (!prev) return prev;
                const liked = prev.likedBy.includes(userProfile._id);
                return {
                    ...prev,
                    likedBy: liked
                        ? prev.likedBy.filter((id) => id !== userProfile._id)
                        : [...prev.likedBy, userProfile._id],
                };
            });
            setIsLiked((prev) => !prev);
            fetchPostDetail();
        } catch {
            toast.error("Lỗi khi thả tim");
        }
    };

    const handleDelete = async () => {
        try {
            await authAxios.delete(`${coreAPI}/posts/${postId}`);
            toast.success("Xóa bài viết thành công");
            onOpenChange(false);
            setPost(null);
            setComments([]);
            fetchPostDetail();
        } catch {
            toast.error("Không thể xóa bài viết");
        }
    };

    const handlePostUpdated = (updatedPost: PostType) => {
        setPost(updatedPost);
        setIsEditOpen(false);
    };

    useEffect(() => {
        if (open) {
            fetchUser();
            fetchPostDetail();
            fetchComments();
        }
    }, [open]);

    if (!open || loading || !post) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full max-h-[90vh] max-w-[40vw] sm:max-w-[40vw] p-0 overflow-y-auto">

                    <DialogHeader className="border-b p-4 pt-4 items-center">
                        <DialogTitle className="text-base font-semibold">
                            Bài viết của {post.createdBy.fullName}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.createdBy.avatar}
                                        className="w-10 h-10 rounded-full border"
                                    />
                                    <div>
                                        <p className="font-semibold">{post.createdBy.fullName}</p>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span>{new Date(post.createdAt).toLocaleString()}</span>
                                            {post.privacy.includes("public") ? (
                                                <Globe className="w-4 h-4" />
                                            ) : (
                                                <GlobeLock className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {userProfile?._id === post.createdBy._id && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-muted rounded-full">
                                                <Ellipsis className="w-5 h-5" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                                <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleDelete}>
                                                <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>

                            {/* Nội dung bài viết */}
                            <div className="relative">
                                <p
                                    className={clsx(
                                        "text-base whitespace-pre-line transition-all",
                                        !expanded && "line-clamp-4"
                                    )}
                                >
                                    {post.title}
                                </p>

                                {post.title.length > 400 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-blue-500 text-sm mt-2 underline"
                                    >
                                        {expanded ? "Ẩn bớt" : "Xem thêm"}
                                    </button>
                                )}
                            </div>

                            {/* Hiển thị ảnh nếu có */}
                            {post.photos && post.photos.length > 0 && (
                                <div className="mt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {post.photos.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`Post photo ${index + 1}`}
                                                className="w-full h-auto rounded-lg object-cover"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Like & comment count */}
                            <div className="flex items-center justify-between px-1 pt-2 text-sm">
                                <button
                                    onClick={handleLike}
                                    className={clsx(
                                        "flex items-center gap-1 hover:text-red-500 transition duration-200 cursor-pointer",
                                        post.likedBy.includes(userProfile?._id || "")
                                            ? "text-red-500"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <Heart className="w-5 h-5" />
                                    <span>{post.likedBy.length}</span>
                                </button>

                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MessageSquare className="w-5 h-5" />
                                    <span>{comments.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Comment section */}
                        <div className="w-full max-w-2xl mx-auto px-4">
                            <Comment
                                comments={comments}
                                postId={post._id}
                                fetchComments={fetchComments}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {post && (
                <EditPostDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    post={post}
                    onSave={handlePostUpdated}
                />
            )}
        </>
    );
}
