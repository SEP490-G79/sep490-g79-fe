import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Card, CardContent, CardDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe, GlobeLock, Heart, MessageSquare, Ellipsis, Trash2, Pencil, SmileIcon, ImageIcon, MapPinIcon, X, RefreshCcw, LocateFixed } from "lucide-react";
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
import { Link } from "react-router-dom";
dayjs.extend(relativeTime);
dayjs.locale("vi");

function Posts({ profileUserId }: { profileUserId?: string }) {
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
  const currentUserId = profileUserId || userProfile?._id;
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [detailPostId, setDetailPostId] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(7);
  const [loadingMore, setLoadingMore] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [suggestions, setSuggestions] = useState<{ place_id: string; description: string }[]>([]);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
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
        address: post.address || "",
        location: post.location ? {
          lat: post.location.lat,
          lng: post.location.lng,
        } : undefined,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        createdBy: post.createdBy._id,
        user: {
          avatar: post.createdBy.avatar,
          fullName: post.createdBy.fullName,
        },
        shelter: post.shelter ? {
          _id: post.shelter._id,
          name: post.shelter.name,
          avatar: post.shelter.avatar,
        } : null,
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
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (bottom && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisiblePosts((prev) => prev + 7);
          setLoadingMore(false);
        }, 800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore]);



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
    if ((address && !addressConfirmed)) {
      toast.error("Vui lòng chọn địa chỉ hợp lệ từ gợi ý.");
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
      formData.append("address", address);
      formData.append("location", JSON.stringify(location));
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
      if (!currentUserId) return;

      setPostsData(prev =>
        prev.map(p =>
          p._id === postId
            ? {
              ...p,
              likedBy: p.likedBy.includes(currentUserId)
                ? p.likedBy.filter(id => id !== currentUserId)
                : [...p.likedBy, currentUserId as string],
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

  //goong api
  const fetchAddressSuggestions = async (query: string) => {
    if (!query.trim()) return setSuggestions([]);
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
        params: {
          input: query,
          api_key: import.meta.env.VITE_GOONG_API_KEY,
        },
      });
      setSuggestions(res.data.predictions || []);
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  const fetchPlaceDetail = async (placeId: string) => {
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/Detail", {
        params: {
          place_id: placeId,
          api_key: import.meta.env.VITE_GOONG_API_KEY,
        },
      });
      const result = res.data.result;
      if (result?.formatted_address && result?.geometry?.location) {
        setAddress(result.formatted_address);
        setLocation({
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        });
        setAddressConfirmed(true);
      }
    } catch (err) {
      console.error("Place detail error:", err);
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        try {
          const res = await axios.get("https://rsapi.goong.io/Geocode", {
            params: {
              latlng: `${lat},${lng}`,
              api_key: import.meta.env.VITE_GOONG_API_KEY,
            },
          });

          const firstResult = res.data.results?.[0];
          if (firstResult) {
            setAddress(firstResult.formatted_address);
            setAddressConfirmed(true);
            toast.success("Lấy địa chỉ thành công!");
          } else {
            toast.error("Không tìm thấy địa chỉ.");
          }
        } catch (err) {
          toast.error("Lỗi khi lấy địa chỉ.");
          console.error("Geocode error:", err);
        }
      },
      (err) => {
        toast.error("Không thể truy cập vị trí của bạn.");
        console.error("Geolocation error:", err);
      }
    );
  };

  const userPosts = [...postsData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .filter(post => String(post.createdBy) === currentUserId && !post.shelter);

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-10 px-4">
      {userProfile?._id && (!profileUserId || profileUserId === userProfile._id) && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer"
            onClick={() => setOpenCreateDialog(true)}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt="avatar" />
              <AvatarFallback>{userProfile.fullName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 text-muted-foreground px-4 py-2 rounded-full text-sm">
              Bạn đang nghĩ gì?
            </div>
          </div>

          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogContent className="sm:max-w-[600px] bg-background rounded-xl overflow-visible border border-border p-0">
              <DialogHeader className="bg-background px-6 pt-4 pb-2">
                <DialogTitle className="text-lg font-semibold">Tạo bài viết</DialogTitle>
              </DialogHeader>

              <div className="px-6 pb-6 pt-4 space-y-4 bg-background">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt="avatar" />
                    <AvatarFallback>{userProfile.fullName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
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

                {address && (
                  <div className="text-xs text-primary font-medium mb-1 bg-muted px-2 py-1 rounded-full inline-flex items-center w-fit">
                    <MapPinIcon className="w-3 h-3 mr-1" />
                    {address}
                  </div>
                )}

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
                      <div ref={emojiPickerRef} className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <EmojiPicker onEmojiClick={(emojiData) => {
                          setPostContent(prev => prev + emojiData.emoji);
                        }} />
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MapPinIcon className="w-5 h-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-3 space-y-2 w-[320px]">
                      <div className="flex gap-2">
                        <Input
                          value={address}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAddress(value);
                            fetchAddressSuggestions(value);
                            setAddressConfirmed(false);
                          }}
                          placeholder="Nhập địa chỉ..."
                        />
                        <Button variant="outline" onClick={detectCurrentLocation}>
                          <LocateFixed className="w-4 h-4" />
                        </Button>
                      </div>

                      {suggestions.length > 0 && (
                        <div className="border rounded-md shadow-sm bg-background max-h-60 overflow-y-auto">
                          {suggestions.map((sug) => (
                            <div
                              key={sug.place_id}
                              className="px-3 py-2 text-sm hover:bg-muted cursor-pointer"
                              onClick={() => {
                                fetchPlaceDetail(sug.place_id);
                                setSuggestions([]);
                                setAddressConfirmed(true);
                              }}
                            >
                              {sug.description}
                            </div>
                          ))}
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                          setConfirmDialog({
                            ...confirmDialog,
                            open: false,
                          });
                          setAddress("");
                          setLocation({ lat: 0, lng: 0 });
                          setAddressConfirmed(false);
                          setPrivacy("public");
                        },
                      });

                    }}
                  >
                    Hủy
                  </Button>

                  <Button onClick={handleCreatePost} disabled={loading || (!postContent.trim() && selectedImages.length === 0)} >
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
      ) : userPosts.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm mt-6">
          Chưa có bài viết nào.
        </p>
      ) : (
        userPosts.slice(0, visiblePosts).map((post) => (
          <Card key={post._id} className="shadow-md dark:bg-gray-800">
            <CardHeader className="pt-4 pb-2 relative">
              <CardTitle className="text-lg font-semibold">
                <div className="flex items-start justify-between">
                  <div className="flex gap-x-3">
                    <Link to={`/profile/${post.createdBy}`}>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt="avatar" />
                        <AvatarFallback>{post.user.fullName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col text-sm">
                      <Link to={`/profile/${post.createdBy}`} className="font-medium hover:underline">
                        {post.user.fullName}
                      </Link>
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
              {post.address && (
                <div className="text-xs text-primary font-medium mb-1 bg-muted px-2 py-1 rounded-full inline-flex items-center w-fit">
                  <MapPinIcon className="w-3 h-3 mr-1" />
                  {post.address}
                </div>
              )}
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

            <hr />

            <CardFooter className="text-sm text-gray-500 px-4">
              <div className="flex w-full justify-between">
                <div onClick={() => handleLike(post._id)} className={`flex items-center gap-1 cursor-pointer w-1/2 ml-3 ${userProfile?._id && post.likedBy.includes(userProfile._id) ? "text-red-500" : ""}`}>
                  <Heart className="w-5 h-5" />
                  <span>{post.likedBy.length}</span>
                </div>
                <div className="flex items-center gap-1 justify-start w-1/2 cursor-pointer" onClick={() => setDetailPostId(post._id)}>
                  <MessageSquare className="w-5 h-5" />
                  <span>Bình luận</span>
                </div>
              </div>
            </CardFooter>

            <hr />

            {post.latestComment && (
              <div className="flex items-start gap-2 px-4 mt-1 hover:bg-muted/60 rounded-md">
                <Link to={`/profile/${post.latestComment.commenter._id}`} className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={post.latestComment.commenter.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.latestComment.commenter.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
                  <Link to={`/profile/${post.latestComment.commenter._id}`} className="text-sm font-medium hover:underline">
                    {post.latestComment.commenter.fullName}
                  </Link>
                  <p className="text-sm">{post.latestComment.message}</p>
                </div>
              </div>
            )}

            <div className="px-4 pb-3">
              <button onClick={() => setDetailPostId(post._id)} className="text-gray-600 hover:underline text-sm cursor-pointer">
                Xem thêm bình luận
              </button>
            </div>
          </Card>
        )))}
      {loadingMore && userPosts.length > visiblePosts && (
        <div className="space-y-6 mt-6">
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
      )}

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
