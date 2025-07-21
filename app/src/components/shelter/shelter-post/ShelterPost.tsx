import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Globe,
    GlobeLock,
    SmileIcon,
    ImageIcon,
    MapPinIcon,
    RefreshCcw,
    X,
    Heart,
    MessageSquare,
    Ellipsis,
    Trash2,
    Pencil,
    LocateFixed,
} from "lucide-react";
import {
    Card, CardHeader, CardFooter, CardContent, CardDescription, CardTitle,
} from "@/components/ui/card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
dayjs.extend(relativeTime);
dayjs.locale("vi");

import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import PostDetailDialog from "@/components/post/PostDetail";
import EditPostDialog from "@/components/post/EditPostDialog";
import axios from "axios";

type Location = { lat: number; lng: number };
type GoongSuggestion = { place_id: string; description: string };

function ShelterPosts() {
    const { shelterId } = useParams();
    const authAxios = useAuthAxios();
    const { userProfile, accessToken, coreAPI } = useContext(AppContext);
    const [postContent, setPostContent] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [postsData, setPostsData] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPost, setEditingPost] = useState<any | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [detailPostId, setDetailPostId] = useState<string | null>(null);
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState(7);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isShelterMember, setIsShelterMember] = useState(false);
    const [isManagerOrStaff, setIsManagerOrStaff] = useState(false);
    const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
    const [suggestions, setSuggestions] = useState<GoongSuggestion[]>([]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
            const res = await axios.get(`${coreAPI}/shelters/${shelterId}/posts/get-posts-list`, accessToken ? {
                headers: { Authorization: `Bearer ${accessToken}` }
            } : {});
            setPostsData(res.data);
        } catch {
            toast.error("Không thể tải bài viết từ shelter");
        } finally {
            setTimeout(() => setLoadingPosts(false), 500);
        }
    };

    useEffect(() => {
        if (shelterId) fetchPosts();
    }, [shelterId]);

    useEffect(() => {
        if (userProfile && postsData.length > 0) {
            const members = postsData[0]?.shelter?.members || [];

            const member = members.find(
                (m: any) =>
                    m._id?._id === userProfile._id || m._id === userProfile._id
            );

            const roles = member?.roles || [];

            setIsShelterMember(!!member);
            setIsManagerOrStaff(roles.includes("manager") || roles.includes("staff"));
        } else {
            setIsShelterMember(false);
            setIsManagerOrStaff(false);
        }
    }, [userProfile, postsData]);

    //scroll to load more posts
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;

            if (scrollTop + clientHeight >= scrollHeight - 200 && !loadingMore && visiblePosts < postsData.length) {
                setLoadingMore(true);
                setTimeout(() => {
                    setVisiblePosts((prev) => Math.min(prev + 7, postsData.length));
                    setLoadingMore(false);
                }, 1000);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadingMore, visiblePosts, postsData.length]);


    const handleCreatePost = async () => {
        if (!postContent.trim()) return toast.error("Nội dung không được để trống");
        try {
            const formData = new FormData();
            formData.append("title", postContent);
            formData.append("privacy", privacy);
            formData.append("address", address);
            formData.append("location", JSON.stringify(location));
            selectedImages.forEach((img) => formData.append("photos", img));
            await authAxios.post(`${coreAPI}/shelters/${shelterId}/posts/create`, formData);
            toast.success("Đăng bài thành công");
            setPostContent("");
            setSelectedImages([]);
            setPreviewUrls([]);
            setOpenDialog(false);
            fetchPosts();
        } catch (err: any) {
            toast.error("Lỗi tạo bài viết: " + (err.response?.data?.message || ""));
        }
    };

    const handleLike = async (postId: string) => {
        if (!accessToken) {
            toast.error("Bạn cần đăng nhập để thả tim bài viết.");
            return;
        }
        try {
            await authAxios.post(`${coreAPI}/posts/react/${postId}`);
            setPostsData((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                            ...p,
                            likedBy: p.likedBy.includes(userProfile?._id)
                                ? p.likedBy.filter((id: string) => id !== userProfile?._id)
                                : [...p.likedBy, userProfile?._id],
                        }
                        : p
                )
            );
        } catch {
            toast.error("Lỗi khi like bài viết");
        }
    };

    const handleDeletePost = async (postId: string) => {
        try {
            await authAxios.delete(`${coreAPI}/posts/${postId}`);
            toast.success("Đã xoá bài viết");
            fetchPosts();
        } catch {
            toast.error("Không thể xoá bài viết");
        }
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
                    }
                } catch (error) {
                    console.error("Reverse geocode error:", error);
                }
            },
            (err) => console.error("Lỗi truy cập vị trí:", err),
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            {isManagerOrStaff && (
                <div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => setOpenDialog(true)}
                >
                    <img src={userProfile?.avatar || "/placeholder.svg"} className="w-10 h-10 rounded-full border" />
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 text-muted-foreground px-4 py-2 rounded-full text-sm">
                        Bạn đang nghĩ gì?
                    </div>
                </div>
            )}

            {!accessToken && (
                <>
                </>
            )}

            {accessToken && !isManagerOrStaff && (
                <div className="bg-muted p-4 rounded-xl text-sm text-center text-muted-foreground">
                    Hãy trở thành thành viên của shelter để có thể đăng bài viết.{" "}
                </div>
            )}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Tạo bài viết</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                            <img src={userProfile?.avatar || "/placeholder.svg"} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-medium text-sm">{userProfile?.fullName}</p>
                                <Select value={privacy} onValueChange={setPrivacy}>
                                    <SelectTrigger className="w-[140px] h-7 text-xs mt-1 cursor-pointer">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public"><Globe className="w-4 h-4 mr-2" /> Công khai</SelectItem>
                                        <SelectItem value="private"><GlobeLock className="w-4 h-4 mr-2" /> Riêng tư</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Bạn muốn chia sẻ điều gì?"
                        />
                        <div className="flex gap-4">
                            <label htmlFor="upload-image">
                                <ImageIcon className="w-5 h-5 cursor-pointer" />
                                <input
                                    id="upload-image"
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        setSelectedImages(prev => [...prev, ...files]);
                                        const urls = files.map(f => URL.createObjectURL(f));
                                        setPreviewUrls(prev => [...prev, ...urls]);
                                    }}
                                />
                            </label>
                            <div className="relative">
                                <SmileIcon className="w-5 h-5 cursor-pointer" onClick={() => setShowPicker(!showPicker)} />
                                {showPicker && (
                                    <div ref={emojiPickerRef} className="absolute left-8 z-50">
                                        <EmojiPicker onEmojiClick={(e) => setPostContent(prev => prev + e.emoji)} />
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
                                            }}
                                            placeholder="Nhập địa chỉ..."
                                        />
                                        <Button size="sm" variant="outline" onClick={detectCurrentLocation}>
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
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={url} className="w-full h-24 object-cover rounded" />
                                        <button onClick={() => {
                                            setSelectedImages(prev => prev.filter((_, i) => i !== idx));
                                            setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
                                        }} className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <Button onClick={handleCreatePost} disabled={loading}>
                                {loading ? "Đang đăng..." : "Đăng bài"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex justify-end items-center gap-2 mt-6">
                <Button variant="outline" onClick={fetchPosts} className="flex items-center gap-2 text-sm">
                    <RefreshCcw className={`w-4 h-4 ${loadingPosts ? "animate-spin" : ""}`} />
                    {loadingPosts ? "Đang tải..." : "Tải lại bài viết"}
                </Button>
            </div>

            <div className="space-y-4 mt-4">
                {postsData.length === 0 && !loading && (
                    <p className="text-muted-foreground text-sm">Chưa có bài viết nào.</p>
                )}
                {loadingPosts ? (
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
                ) : (
                    [...postsData]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, visiblePosts)
                        .map((post) => {
                            const currentUserId = userProfile?._id;
                            const members = post.shelter?.members || [];

                            const currentMember = members.find(
                                (m: any) => m._id?._id === currentUserId || m._id === currentUserId
                            );
                            const roles = currentMember?.roles || [];

                            const isManager = roles.includes("manager");
                            const isOwner = post.createdBy?._id === currentUserId;

                            return (
                                <Card key={post._id} className="shadow-md dark:bg-gray-800">
                                    <CardHeader className="pt-4 pb-2 relative">
                                        <CardTitle className="text-lg font-semibold">
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-x-3">
                                                    <img
                                                        src={post.shelter?.avatar || "/placeholder.svg"}
                                                        className="w-14 h-14 rounded-full border"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{post.shelter?.name}</span>
                                                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                            <span>{formatCreatedAt(post.createdAt)}</span>
                                                            {post.privacy === "public" ? (
                                                                <Globe className="w-4 h-4" />
                                                            ) : (
                                                                <GlobeLock className="w-4 h-4" />
                                                            )}
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
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setEditingPost(post);
                                                                    setIsEditOpen(true);
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4 text-blue-500 mr-2" /> Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => setConfirmDeletePostId(post._id)}>
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
                                                        setExpandedPosts((prev) => ({ ...prev, [post._id]: true }))
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
                                                            setExpandedPosts((prev) => ({ ...prev, [post._id]: false }))
                                                        }
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
                                                    {post.photos.map((url: string, idx: number) => {
                                                        const isHidden = idx > 3;
                                                        const isOverlay = idx === 3 && post.photos.length > 4;
                                                        const extraCount = post.photos.length - 4;

                                                        return (
                                                            <PhotoView key={idx} src={url}>
                                                                <div
                                                                    className={`relative cursor-pointer ${isHidden ? "hidden" : ""
                                                                        }`}
                                                                >
                                                                    <img
                                                                        src={url}
                                                                        alt={`Ảnh ${idx + 1}`}
                                                                        className={`w-full h-40 object-cover rounded-lg ${isOverlay ? "brightness-50" : ""
                                                                            }`}
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
                                                onClick={() => handleLike(post._id)}
                                                className={`flex items-center gap-1 cursor-pointer w-1/2 ml-3 ${post.likedBy.includes(userProfile?._id) ? "text-red-500" : ""}`}
                                            >
                                                <Heart className="w-5 h-5" />
                                                <span>{post.likedBy.length}</span>
                                            </div>
                                            <div
                                                className="flex items-center gap-1 justify-start w-1/2 cursor-pointer"
                                                onClick={() => setDetailPostId(post._id)}
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                                <span>Bình luận</span>
                                            </div>
                                        </div>
                                    </CardFooter>

                                    <hr />

                                    {post.latestComment && (
                                        <div className="flex items-start gap-2 px-4 mt-1 hover:bg-muted/60 rounded-md">
                                            <img
                                                src={post.latestComment.commenter?.avatar}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div className="bg-muted px-3 py-2 rounded-xl max-w-[80%]">
                                                <p className="text-xs font-semibold">
                                                    {post.latestComment.commenter?.fullName}
                                                </p>
                                                <p className="text-sm">{post.latestComment.message}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="px-4 pb-3">
                                        <button
                                            onClick={() => setDetailPostId(post._id)}
                                            className="text-gray-600 hover:underline text-sm cursor-pointer"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </Card>
                            );
                        })
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

            </div>

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

            <AlertDialog open={!!confirmDeletePostId} onOpenChange={(open) => !open && setConfirmDeletePostId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xoá bài viết?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeletePostId(null)}>Huỷ</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                if (confirmDeletePostId) {
                                    handleDeletePost(confirmDeletePostId);
                                    setConfirmDeletePostId(null);
                                }
                            }}
                        >
                            Xác nhận xoá
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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

export default ShelterPosts;
