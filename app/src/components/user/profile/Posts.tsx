import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import {
  Card, CardAction, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe, GlobeLock, Heart, MessageSquare, Ellipsis, Trash2, Pencil, SmileIcon, ImageIcon, MapPinIcon, X, RefreshCcw } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import type { PostType } from "@/types/Post";
import PostDetailDialog from "@/components/post/PostDetail";
import EditPostDialog from "@/components/post/EditPostDialog";
import axios from "axios";

dayjs.extend(relativeTime);
dayjs.locale("vi");

function Posts() {
  const authAxios = useAuthAxios();
  const { userProfile, accessToken, coreAPI, setUserProfile } = useContext(AppContext);
  const [postsData, setPostsData] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const currentUserId = userProfile?._id || "guest";
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [detailPostId, setDetailPostId] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => { },
  });
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

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await axios.get(`${coreAPI}/posts/get-posts-list`, accessToken ? {
        headers: { Authorization: `Bearer ${accessToken}` }
      } : {});
      const mapped = res.data.map((post: any) => ({
        _id: post._id,
        title: post.title,
        photos: post.photos,
        privacy: post.privacy || "public",
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        createdBy: post.createdBy._id,
        user: {
          avatar: post.createdBy.avatar,
          fullName: post.createdBy.fullName,
        },
        likedBy: post.likedBy.map((u: any) => u._id),
        latestComment: post.latestComment ? {
          _id: post.latestComment._id,
          message: post.latestComment.message,
          commenter: {
            _id: post.latestComment.commenter._id,
            fullName: post.latestComment.commenter.fullName,
            avatar: post.latestComment.commenter.avatar,
          },
        } : null,
      }));
      setPostsData(mapped);
    } catch (err) {
      toast.error("Lỗi tải bài viết");
    } finally {
      setTimeout(() => {
        setLoadingPosts(false);
      }, 1000);
    }
  };



  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);




  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error("Nội dung bài viết không được để trống");
      return;
    }
    try {
      if (selectedImages.length > 5) {
        toast.error("Bạn chỉ có thể đăng tối đa 5 ảnh");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("title", postContent);
      formData.append("privacy", privacy);
      selectedImages.forEach((file) => formData.append("photos", file));
      await authAxios.post(`${coreAPI}/posts/create`, formData);
      toast.success("Đăng bài thành công");
      setPostContent("");
      setSelectedImages([]);
      setPreviewUrls([]);
      setOpenCreateDialog(false);
      await fetchPosts();
    } catch (err: any) {
      toast.error("Lỗi tạo bài viết: " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await authAxios.post(`${coreAPI}/posts/react/${postId}`);
      setPostsData(prev =>
        prev.map(p =>
          p._id === postId
            ? {
              ...p,
              likedBy: p.likedBy.includes(currentUserId)
                ? p.likedBy.filter(id => id !== currentUserId)
                : [...p.likedBy, currentUserId],
            }
            : p
        )
      );
      await fetchPosts();
    } catch (err) {
      toast.error("Lỗi khi like");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await authAxios.delete(`${coreAPI}/posts/${postId}`);
      toast.success("Đã xoá bài viết");
      setPostsData(prev => prev.filter(p => p._id !== postId));
      await fetchPosts();
    } catch (err) {
      toast.error("Không thể xoá bài viết");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const formatCreatedAt = (date: string | Date): string => {
    const now = dayjs();
    const target = dayjs(date);
    if (now.isSame(target, "day")) return target.fromNow();
    return target.format("DD/MM/YYYY");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-10 px-4">
      {userProfile?._id && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => setOpenCreateDialog(true)}
          >
            <img src={userProfile.avatar || "/placeholder.svg"} className="w-10 h-10 rounded-full border" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 text-muted-foreground px-4 py-2 rounded-full text-sm">
              Bạn đang nghĩ gì?
            </div>
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogContent className="sm:max-w-[600px] bg-background rounded-xl overflow-hidden border border-border p-0">
              <DialogHeader className="bg-background px-6 pt-4 pb-2">
                <DialogTitle className="text-lg font-semibold">Tạo bài viết</DialogTitle>
              </DialogHeader>

              <div className="px-6 pb-6 pt-4 space-y-4 bg-background">
                <div className="flex items-start gap-3">
                  <img src={userProfile.avatar || "/placeholder.svg"} className="w-12 h-12 rounded-full border" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{userProfile.fullName}</span>
                    <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger className="w-[140px] h-7 text-xs mt-1 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public"><Globe className="mr-2 h-4 w-4" />Công khai</SelectItem>
                        <SelectItem value="private"><GlobeLock className="mr-2 h-4 w-4" />Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Bạn đang nghĩ gì?"
                  className="resize-none border text-base placeholder:text-muted-foreground"
                />

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 text-muted-foreground">
                  <label htmlFor="upload-image">
                    <ImageIcon className="w-5 h-5 cursor-pointer" />
                    <input
                      type="file"
                      id="upload-image"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <div className="relative">
                    <SmileIcon className="w-5 h-5 cursor-pointer" onClick={() => setShowPicker(!showPicker)} />
                    {showPicker && (
                      <div ref={emojiPickerRef} className="absolute z-50 left-10">
                        <EmojiPicker onEmojiClick={(emojiData) => {
                          setPostContent(prev => prev + emojiData.emoji);
                        }} />
                      </div>
                    )}
                  </div>
                  <MapPinIcon className="w-5 h-5" />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        title: "Xác nhận huỷ bài viết",
                        description: "Bạn có chắc muốn huỷ bài viết? Nội dung và ảnh đã nhập sẽ bị xoá.",
                        confirmText: "Huỷ bài",
                        cancelText: "Quay lại",
                        onConfirm: () => {
                          setPostContent("");
                          setSelectedImages([]);
                          setPreviewUrls([]);
                          setOpenCreateDialog(false);
                        },
                      });

                    }}
                  >
                    Hủy
                  </Button>

                  <Button onClick={handleCreatePost} disabled={loading}>
                    {loading ? "Đang đăng..." : "Đăng bài"}
                  </Button>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          onClick={fetchPosts}
          disabled={loadingPosts}
          className="flex items-center gap-2 text-sm"
        >
          <RefreshCcw className={`w-4 h-4 ${loadingPosts ? "animate-spin" : ""}`} />
          {loadingPosts ? "Đang tải..." : "Tải lại bài viết"}
        </Button>
      </div>
      {loadingPosts ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="p-4 border rounded-xl bg-background shadow space-y-4">
              <div className="flex gap-4 items-center">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-40 w-full rounded" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        [...postsData]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .filter(post => String(post.createdBy) === currentUserId).map(post => (
            <Card key={post._id} className="shadow-md dark:bg-gray-800">
              <CardHeader className="pt-4 pb-2 relative">
                <CardTitle className="text-lg font-semibold">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-x-3">
                      <img src={post.user.avatar || "/placeholder.svg"} className="w-14 h-14 rounded-full border" />
                      <div className="flex flex-col">
                        <span>{post.user.fullName}</span>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{formatCreatedAt(post.createdAt)}</span>
                          {post.privacy.includes("public") ? <Globe className="w-4 h-4" /> : <GlobeLock className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {String(post.createdBy?._id || post.createdBy) === currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-muted rounded-md">
                            <Ellipsis className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingPost(post); setIsEditOpen(true); }}>
                            <Pencil className="w-4 h-4 text-blue-500 mr-2" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() =>
                            setConfirmDialog({
                              open: true,
                              title: "Xác nhận xóa bài viết",
                              description: "Bạn có chắc chắn muốn xóa bài viết này? Thao tác này không thể hoàn tác.",
                              confirmText: "Xoá",
                              cancelText: "Hủy",
                              onConfirm: () => handleDeletePost(post._id),
                            })
                          }>
                            <Trash2 className="w-4 h-4 text-red-500 mr-2" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardDescription className="px-6 pb-2 whitespace-pre-line text-sm text-foreground">
                {post.title.length > 300 && !expandedPosts[post._id] ? (
                  <>
                    {post.title.slice(0, 300)}...
                    <button
                      onClick={() =>
                        setExpandedPosts(prev => ({ ...prev, [post._id]: true }))
                      }
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
                        onClick={() =>
                          setExpandedPosts(prev => ({ ...prev, [post._id]: false }))
                        }
                        className="text-blue-500 underline ml-1 text-xs"
                      >
                        Ẩn bớt
                      </button>
                    )}
                  </>
                )}
              </CardDescription>

              {post.photos.length > 0 && (
                <CardContent>
                  <PhotoProvider>
                    <div className="grid grid-cols-2 gap-2">
                      {post.photos.slice(0, 3).map((url, idx) => (
                        <PhotoView key={idx} src={url}>
                          <img
                            src={url}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-full h-40 object-cover rounded-lg cursor-pointer"
                          />
                        </PhotoView>
                      ))}

                      {post.photos.length > 3 && (
                        <PhotoView src={post.photos[3]}>
                          <div className="relative cursor-pointer">
                            <img
                              src={post.photos[3]}
                              alt="Ảnh thứ 4"
                              className="w-full h-40 object-cover rounded-lg brightness-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white bg-black/50 text-sm font-semibold px-3 py-1 rounded-lg">
                                +{post.photos.length - 3}
                              </span>
                            </div>
                          </div>
                        </PhotoView>
                      )}
                    </div>
                  </PhotoProvider>
                </CardContent>
              )}


              <CardFooter className="text-sm text-gray-500 px-4">
                <div className="flex w-full justify-between">
                  <div onClick={() => handleLike(post._id)} className={`flex items-center gap-1 cursor-pointer ${post.likedBy.includes(currentUserId) ? "text-red-500" : ""}`}>
                    <Heart className="w-5 h-5" />
                    <span>{post.likedBy.length}</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setDetailPostId(post._id)}>
                    <MessageSquare className="w-5 h-5" />
                    <span>Bình luận</span>
                  </div>
                </div>
              </CardFooter>

              <hr />

              {post.latestComment && (
                <div className="flex items-start gap-2 px-4 mt-1 hover:bg-muted/60 rounded-md">
                  <img src={post.latestComment.commenter.avatar} className="w-8 h-8 rounded-full" />
                  <div className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
                    <p className="text-xs font-semibold">{post.latestComment.commenter.fullName}</p>
                    <p className="text-sm">{post.latestComment.message}</p>
                  </div>
                </div>
              )}

              <div className="px-4 pb-3">
                <button onClick={() => setDetailPostId(post._id)} className="text-gray-600 hover:underline text-sm cursor-pointer">
                  Xem thêm
                </button>
              </div>
            </Card>
          )))}

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {confirmDialog.cancelText || "Hủy"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {confirmDialog.confirmText || "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      {editingPost && (
        <EditPostDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          post={editingPost}
          onSave={() => {
            setIsEditOpen(false);
            fetchPosts();
          }}
        />
      )}


      <PostDetailDialog
        postId={detailPostId || ""}
        open={!!detailPostId}
        onOpenChange={(open) => {
          if (!open) setDetailPostId(null);
        }}
        onPostUpdated={(updated) => {
          setPostsData((prev) =>
            prev.map((p) =>
              p._id === updated._id
                ? {
                  ...p,
                  likedBy: updated.likedBy,
                  latestComment: updated.latestComment ?? p.latestComment,
                }
                : p
            )
          );
        }}
      />
    </div>
  );
}

export default Posts;
