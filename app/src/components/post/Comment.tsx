import React, { useState, useRef, useContext } from "react";
import type { CommentType } from "@/types/Comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Ellipsis, Pencil, Trash2, Check, X, Smile } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
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
import EmojiPicker from "emoji-picker-react";
import dayjs from "dayjs";
import AppContext from "@/context/AppContext";
import axios from "axios";

interface Props {
    comments: CommentType[];
    postId: string;
    fetchComments: () => void;
}

export default function Comment({ comments, postId, fetchComments }: Props) {
    const { userProfile, coreAPI, accessToken } = useContext(AppContext);
    const authAxios = useAuthAxios();

    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [showEditPicker, setShowEditPicker] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await authAxios.post(`${coreAPI}/posts/${postId}/comment`, {
                message: newComment.trim(),
            });
            setNewComment("");
            fetchComments();
        } catch (err) {
            toast.error("Không thể thêm bình luận");
        }
    };

    const handleEditComment = async (commentId: string) => {
        try {
            await authAxios.put(`${coreAPI}/posts/${postId}/comment/edit/${commentId}`, {
                message: editingContent,
            });
            setEditingId(null);
            fetchComments();
        } catch (err) {
            toast.error("Không thể chỉnh sửa bình luận");
        }
    };

    const handleDeleteComment = async () => {
        if (!commentToDelete) return;
        try {
            await authAxios.delete(`${coreAPI}/posts/${postId}/comment/${commentToDelete}`);
            setCommentToDelete(null);
            fetchComments();
        } catch (err) {
            toast.error("Không thể xoá bình luận");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-base">Bình luận</h3>

            {/* Gửi comment mới */}
            {userProfile?._id ? (
                // Nếu đã đăng nhập thì hiển thị ô nhập bình luận
                <div className="flex gap-3 items-start mt-4 relative">
                    <img src={userProfile?.avatar || "/placeholder.svg"} className="w-9 h-9 rounded-full border" />
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 py-2">
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận..."
                            className="border-none resize-none text-sm bg-transparent"
                        />
                        <div className="flex items-center justify-between mt-1">
                            <Smile
                                className="w-5 h-5 cursor-pointer text-muted-foreground"
                                onClick={() => setShowPicker(!showPicker)}
                            />
                            <Button size="sm" onClick={handleAddComment}>Gửi</Button>
                        </div>
                    </div>
                    {showPicker && (
                        <div className="absolute left-23 top-[100px] z-50">
                            <EmojiPicker
                                onEmojiClick={(emojiData) => setNewComment((prev) => prev + emojiData.emoji)}
                                autoFocusSearch={false}
                            />
                        </div>
                    )}
                </div>
            ) : (
                // Nếu là guest thì hiển thị lời nhắc đăng nhập
                <div className="text-sm text-muted-foreground mt-2">
                    <span>Vui lòng <strong><a href="/login">Đăng nhập</a></strong> để bình luận.</span>
                </div>
            )}


            {/* Danh sách comment */}
            <div className="space-y-4 mt-4">
                {comments.map((cmt) => (
                    <div key={cmt._id} className="flex items-start gap-3 relative group">
                        <img src={cmt.commenter.avatar} className="w-9 h-9 rounded-full" />
                        <div className="flex-1 space-y-1">
                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl inline-block">
                                <div className="font-medium text-sm">{cmt.commenter.fullName}</div>
                                {editingId === cmt._id ? (
                                    <>
                                        <Textarea
                                            rows={2}
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            className="resize-none mt-1 text-sm"
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <Smile className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowEditPicker(!showEditPicker)} />
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                    <X className="w-4 h-4 mr-1" /> Hủy
                                                </Button>
                                                <Button size="sm" onClick={() => handleEditComment(cmt._id)}>
                                                    <Check className="w-4 h-4 mr-1" /> Lưu
                                                </Button>
                                            </div>
                                        </div>
                                        {showEditPicker && (
                                            <div className="z-50 mt-2">
                                                <EmojiPicker
                                                    onEmojiClick={(emojiData) => setEditingContent((prev) => prev + emojiData.emoji)}
                                                    autoFocusSearch={false}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm mt-1">{cmt.message}</p>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground ml-2 mt-1">{dayjs(cmt.createdAt).fromNow()}</p>
                        </div>

                        {/* Elipsis menu */}
                        {userProfile?._id === cmt.commenter._id && (
                            <div className="absolute top-0 right-0 group-hover:opacity-100 opacity-0 transition">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 hover:bg-muted rounded-full">
                                            <Ellipsis className="w-4 h-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => {
                                            setEditingId(cmt._id);
                                            setEditingContent(cmt.message);
                                        }}>
                                            <Pencil className="w-4 h-4 mr-2" /> Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setCommentToDelete(cmt._id)}>
                                            <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Dialog xác nhận xóa bình luận */}
            <AlertDialog open={!!commentToDelete} onOpenChange={(open) => !open && setCommentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa bình luận</AlertDialogTitle>
                        <AlertDialogDescription>Bạn có chắc chắn muốn xóa bình luận này?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCommentToDelete(null)}>Hủy</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteComment}>
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
