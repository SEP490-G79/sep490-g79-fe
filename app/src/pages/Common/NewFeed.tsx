import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import PostCard from "@/components/post/PostCard";
import EditPostDialog from "@/components/post/EditPostDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Textarea, } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SmileIcon, ImageIcon, MapPinIcon, Globe, GlobeLock, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import axios from "axios";
import type { PostType } from "@/types/Post";
import PostDetailDialog from "@/components/post/PostDetail";

const Newfeed = () => {
  const { userProfile, coreAPI, accessToken, setUserProfile } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const currentUserId = userProfile?._id || "guest";
  const [detailPostId, setDetailPostId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const res = await axios.get(`${coreAPI}/posts/get-posts-list`, accessToken ? {
        headers: { Authorization: `Bearer ${accessToken}` }
      } : {});
      //console.log("posts response:", res.data);
      const mapped: PostType[] = res.data.map((post: any) => ({
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
      setPosts(mapped);
    } catch (err) {
      console.error("Lỗi lấy bài viết:", err);
    } finally {
      setLoadingPosts(false);
    }
  }, [coreAPI, accessToken]);

  useEffect(() => {
    if (accessToken && !userProfile) {
      authAxios.get(`${coreAPI}/users/get-user`)
        .then(res => setUserProfile(res.data))
        .catch(console.error);
    }
  }, [accessToken, userProfile, coreAPI]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const handlePostSubmit = async () => {
    if (!postContent.trim() && selectedImages.length === 0) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", postContent);
      formData.append("privacy", privacy);
      selectedImages.forEach(file => formData.append("photos", file));
      await authAxios.post(`${coreAPI}/posts/create`, formData);
      toast.success("Đăng bài thành công");
      setPostContent("");
      setSelectedImages([]);
      setPreviewUrls([]);
      setOpenCreateDialog(false);
      await fetchPosts();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      toast.error(`Lỗi tạo bài viết: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string | number) => {
    if (!userProfile?._id) {
      toast.warning("Bạn cần đăng nhập để thả tim.");
      return;
    }
    try {
      await authAxios.post(`${coreAPI}/posts/react/${postId}`);
      setPosts(prev =>
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
    } catch (err) {
      console.error("Lỗi like:", err);
    }
  };
  const handleDeletePost = async (postId: string | number) => {
    try {
      await authAxios.delete(`${coreAPI}/posts/${postId}`);
      toast.success("Xoá bài viết thành công");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      toast.error("Không thể xoá bài viết");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Bảng tin</h1>

      {userProfile?._id && (
        <>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => setOpenCreateDialog(true)}
          >
            <img src={userProfile.avatar || "/placeholder.svg"} className="w-10 h-10 rounded-full border" />
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 text-muted-foreground px-4 py-2 rounded-full text-sm">
              Bạn đang nghĩ gì?
            </div>
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogContent className="sm:max-w-[600px] p-0">
              <DialogHeader className="border-b px-6 pt-4 pb-2 bg-background">
                <DialogTitle className="text-lg font-semibold">Tạo bài viết</DialogTitle>
              </DialogHeader>

              <div className="px-6 pb-6 pt-4 space-y-4 bg-background">
                <div className="flex items-start gap-3">
                  <img src={userProfile.avatar || "/placeholder.svg"} className="w-12 h-12 rounded-full border" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{userProfile.fullName}</span>
                    <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger className="w-[140px] h-7 text-xs mt-1">
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
                  className="resize-none border border-border text-base placeholder:text-muted-foreground overflow-y-auto max-h-[200px] focus:ring-0"
                />

                {previewUrls.length > 0 && (
                  <div className="max-h-[200px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-3 gap-2">
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
                  </div>
                )}

                <div className="flex gap-4 text-muted-foreground relative pl-1">
                  <label htmlFor="image-upload">
                    <ImageIcon className="w-5 h-5 cursor-pointer" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  <div className="relative">
                    <SmileIcon className="w-5 h-5 cursor-pointer" onClick={() => setShowPicker(!showPicker)} />
                    {showPicker && (
                      <div ref={emojiPickerRef} className="absolute left-15 bottom-[-200px] z-50 ">
                        <EmojiPicker
                          onEmojiClick={(emojiData) => {
                            setPostContent(prev => prev + emojiData.emoji);
                          }}
                          autoFocusSearch={false}
                        />
                      </div>
                    )}
                  </div>

                  <MapPinIcon className="w-5 h-5 cursor-pointer" />
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handlePostSubmit} disabled={loading}>
                    {loading ? "Đang đăng..." : "Đăng bài"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {loadingPosts ? (
        <p className="text-center text-muted-foreground">Đang tải bài viết...</p>
      ) : (
        posts
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onLike={handleLike}
              isGuest={!userProfile?._id}
              onEdit={(post) => {
                setEditingPost(post);
                setIsEditOpen(true);
              }}
              onDelete={(post) => handleDeletePost(post._id)}
              latestComment={post.latestComment}
              onViewDetail={(postId) => setDetailPostId(postId)}
            />
          ))
      )}

      {editingPost && (
        <EditPostDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          post={editingPost}
          onSave={(updatedPost) => {
            setPosts(prev => prev.map(p => (p._id === updatedPost._id ? updatedPost : p)));
            setIsEditOpen(false);
            fetchPosts();
          }}
        />
      )}

      {detailPostId && (
        <PostDetailDialog
          postId={detailPostId}
          open={!!detailPostId}
          onOpenChange={(open) => {
            if (!open) setDetailPostId(null);
          }}
        />
      )}

    </div>
  );
};

export default Newfeed;
