import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import PostCard from "@/components/post/PostCard";
import EditPostDialog from "@/components/post/EditPostDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Textarea, } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmileIcon, ImageIcon, MapPinIcon, Globe, GlobeLock, X, RefreshCcw, LocateFixed } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EmojiPicker from "emoji-picker-react";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import axios from "axios";
import type { PostType } from "@/types/Post";
import PostDetailDialog from "@/components/post/PostDetail";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { sortPostsByDistance } from "@/utils/sortByDistance";
import type { LatLng } from "@/utils/sortByDistance";
type Location = { lat: number; lng: number };
type GoongSuggestion = { place_id: string; description: string };


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
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  const [visiblePosts, setVisiblePosts] = useState(7);
  const [loadingMore, setLoadingMore] = useState(false);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
  const [suggestions, setSuggestions] = useState<GoongSuggestion[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [postAs, setPostAs] = useState<"user" | string>("user");
  const [myShelters, setMyShelters] = useState<{ _id: string; name: string; avatar: string }[]>([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirmText: "Xác nhận",
    cancelText: "Hủy",
    onConfirm: () => { },
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);


  useEffect(() => {
    if (postId) {
      setDetailPostId(postId);
    }
  }, [postId]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (err) => {
        console.error("Không lấy được vị trí:", err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (!userProfile?._id) return;

    authAxios.get(`${coreAPI}/shelters/get-all`)
      .then(res => {
        const allShelters = res.data || [];
        const filtered = allShelters.filter((shelter: any) =>
          shelter.members?.some((member: any) => member._id === userProfile._id)
        );
        setMyShelters(filtered.map(({ _id, name, avatar }: any) => ({ _id, name, avatar })));
      })
      .catch(err => console.error("Lỗi lấy danh sách shelter:", err));
  }, [userProfile?._id]);

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
        address: post.address || "",
        location: post.location,
        status: post.status,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        createdBy: post.createdBy._id,
        user: {
          avatar: post.createdBy.avatar,
          fullName: post.createdBy.fullName,
        },
        shelter: post.shelter
          ? {
            _id: post.shelter._id,
            name: post.shelter.name,
            avatar: post.shelter.avatar,
            members: post.shelter.members || [],
          }
          : null,
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
      setTimeout(() => {
        setLoadingPosts(false);
      }, 1000);
    }
  }, [coreAPI, accessToken]);

  useEffect(() => {
    if (accessToken && !userProfile) {
      authAxios.get(`${coreAPI}/users/get-user`)
        .then(res => setUserProfile(res.data))
        .catch(console.error);
    }
    if (!accessToken) {
      setUserProfile(null);
    }
    fetchPosts();
  }, [accessToken, userProfile, coreAPI, fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 200 && !loadingMore && visiblePosts < posts.length) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisiblePosts(prev => Math.min(prev + 7, posts.length));
          setLoadingMore(false);
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, visiblePosts, posts.length]);


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
    if (address && !addressConfirmed) {
      toast.error("Vui lòng chọn địa chỉ từ gợi ý.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", postContent);
      formData.append("privacy", privacy);
      formData.append("address", address);
      formData.append("location", JSON.stringify(location));
      if (postAs !== "user") {
        formData.append("shelter", postAs);
      }
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

  const sortedPosts = (() => {
    const now = new Date();
    const recentThreshold = 1000 * 60 * 60 * 24;
    const recentPosts = posts.filter(post => new Date(now).getTime() - new Date(post.createdAt).getTime() < recentThreshold);
    const otherPosts = posts.filter(post => !recentPosts.includes(post));

    const sortedRecent = [...recentPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const sortedOther = userLocation
      ? sortPostsByDistance(otherPosts, userLocation)
      : [...otherPosts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return [...sortedRecent, ...sortedOther];
  })();


  //goong
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
    } catch (error) {
      console.error("Autocomplete error:", error);
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
    } catch (error) {
      console.error("Place detail error:", error);
    }
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Trình duyệt không hỗ trợ định vị");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await axios.get("https://rsapi.goong.io/Geocode", {
            params: {
              latlng: `${coords.latitude},${coords.longitude}`,
              api_key: import.meta.env.VITE_GOONG_API_KEY,
              has_deprecated_administrative_unit: true,
            },
          });
          const place = res.data.results?.[0];
          if (place) {
            setAddress(place.formatted_address);
            setLocation({ lat: coords.latitude, lng: coords.longitude });
            setAddressConfirmed(true);
          }
        } catch (error) {
          console.error("Reverse geocode error:", error);
        }
      },
      (err) => console.error("Lỗi định vị:", err),
      { enableHighAccuracy: true }
    );
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
            <Avatar className="w-10 h-10">
              <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt="avatar" />
              <AvatarFallback>{userProfile.fullName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 text-muted-foreground px-4 py-2 rounded-full text-sm">
              Bạn đang nghĩ gì?
            </div>
          </div>

          <Dialog open={openCreateDialog} onOpenChange={(open) => {
            setOpenCreateDialog(open);
            if (!open) {
              setAddressConfirmed(false);
              setAddress("");
              setLocation({ lat: 0, lng: 0 });
            }
          }}>
            <DialogContent className="sm:max-w-[600px] bg-background rounded-xl overflow-visible border border-border p-0">
              <DialogHeader className="bg-background px-6 pt-4 pb-2">
                <DialogTitle className="text-lg font-semibold">Tạo bài viết</DialogTitle>
              </DialogHeader>

              <div className="bg-background px-6 pb-6 pt-4 space-y-4">
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt="avatar" />
                      <AvatarFallback>{userProfile.fullName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{userProfile.fullName}</span>
                      <Select value={privacy} onValueChange={setPrivacy}>
                        <SelectTrigger className="w-[140px] h-7 text-xs mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            <Globe className="mr-2 h-4 w-4" /> Công khai
                          </SelectItem>
                          <SelectItem value="private">
                            <GlobeLock className="mr-2 h-4 w-4" /> Riêng tư
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-xs">
                    <span className="mb-1 text-muted-foreground">Đăng bài với tư cách:</span>
                    <Select value={postAs} onValueChange={setPostAs}>
                      <SelectTrigger className="w-[200px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <img src={userProfile.avatar} className="w-5 h-5 rounded-full" />
                            <span>{userProfile.fullName} (Cá nhân)</span>
                          </div>
                        </SelectItem>
                        {myShelters.map((shelter) => (
                          <SelectItem key={shelter._id} value={shelter._id}>
                            <div className="flex items-center gap-2">
                              <img src={shelter.avatar} className="w-5 h-5 rounded-full" />
                              <span>{shelter.name}</span>
                            </div>
                          </SelectItem>
                        ))}
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
                            setAddressConfirmed(false);
                            fetchAddressSuggestions(value);
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

                <div className="flex justify-end pt-2">
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
                          setAddress("");
                          setLocation({ lat: 0, lng: 0 });
                          setAddressConfirmed(false);
                          setPrivacy("public");
                          setPostAs("user");
                          setShowPicker(false);
                          setSuggestions([]);
                          setOpenCreateDialog(false);
                        },
                      });
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handlePostSubmit}
                    disabled={loading || (!postContent.trim() && selectedImages.length === 0)}
                  >
                    {loading ? "Đang đăng..." : "Đăng bài"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      {!userProfile?._id && (
        <div className="text-center text-muted-foreground py-6">
          <p>
            Hãy{" "}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", "/newfeed");
                navigate("/login");
              }}
            >
              đăng nhập
            </span>{" "}
            để tạo bài viết.
          </p>
        </div>
      )}
      <div className="flex justify-end">
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
        sortedPosts
          .slice()
          .slice(0, visiblePosts)
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
      {loadingMore && (
        <div className="space-y-6 mt-4">
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

      <PostDetailDialog
        postId={detailPostId || ""}
        open={!!detailPostId}
        onOpenChange={(open) => {
          if (!open) setDetailPostId(null);
        }}
        onPostUpdated={(updatedPost) => {
          setPosts(prev =>
            prev.map(p => {
              if (p._id !== updatedPost._id) return p;
              return {
                ...p,
                ...updatedPost,
                createdBy: (updatedPost.createdBy as any)._id || updatedPost.createdBy,
                latestComment: updatedPost.latestComment ?? p.latestComment,
              };
            })
          );
        }}
      />

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
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
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                confirmDialog.onConfirm();
                setConfirmDialog((prev) => ({ ...prev, open: false }));
              }}
            >
              {confirmDialog.confirmText || "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
};

export default Newfeed;
