import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Globe,
    GlobeLock,
    SmileIcon,
    ImageIcon,
    MapPinIcon,
    RefreshCcw,
    X,
    LocateFixed,
} from "lucide-react";
import "react-photo-view/dist/react-photo-view.css";
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
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
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import PostDetailDialog from "@/components/post/PostDetail";
import EditPostDialog from "@/components/post/EditPostDialog";
import ShelterPostCard from "@/components/shelter/shelter-post/ShelterPostCard";
import { sortPostsByDistance } from "@/utils/sortByDistance";
import type { LatLng } from "@/utils/sortByDistance";
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
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState(7);
    const [loadingMore, setLoadingMore] = useState(false);

    const [isManagerOrStaff, setIsManagerOrStaff] = useState(false);
    const [confirmDeletePostId, setConfirmDeletePostId] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState<Location>({ lat: 0, lng: 0 });
    const [suggestions, setSuggestions] = useState<GoongSuggestion[]>([]);
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);
    const [addressConfirmed, setAddressConfirmed] = useState(false);
    const [shelterInfo, setShelterInfo] = useState<any>(null);
    const [sortOption, setSortOption] = useState<"latest" | "oldest" | "nearest" | "farthest">("latest");
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        description: "",
        confirmText: "Xác nhận",
        cancelText: "Hủy",
        onConfirm: () => { },
    });

    const fetchShelterInfo = async () => {
        try {
            const res = await axios.get(`${coreAPI}/shelters/get-by-id/${shelterId}`);
            setShelterInfo(res.data);

            // Kiểm tra role nếu user là thành viên
            const member = res.data.members.find(
                (m: any) =>
                    m._id?._id === userProfile?._id || m._id === userProfile?._id
            );

            const roles = member?.roles || [];
            setIsManagerOrStaff(roles.includes("manager") || roles.includes("staff"));
        } catch {
            console.error("Không lấy được thông tin shelter");
        }
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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


    const fetchPosts = async () => {
        setLoadingPosts(true);
        try {
            const res = await axios.get(`${coreAPI}/shelters/${shelterId}/posts/get-posts-list`, accessToken ? {
                headers: { Authorization: `Bearer ${accessToken}` }
            } : {});
            setPostsData(res.data);
            if (res.data.length > 0 && res.data[0].shelter) {
                setShelterInfo(res.data[0].shelter);
            }
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
        if (shelterId && userProfile) {
            fetchShelterInfo();
        }
    }, [shelterId, userProfile]);

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
        if (address && !addressConfirmed) {
            toast.error("Vui lòng chọn địa chỉ hợp lệ từ gợi ý.");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", postContent);
            formData.append("privacy", privacy);
            formData.append("address", address);
            formData.append("location", JSON.stringify(location));
            if (shelterId) {
                formData.append("shelter", shelterId);
            }
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
        } finally {
            setLoading(false);
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


    function getSortedShelterPosts(posts: any[], userLocation: LatLng | null): any[] {
        if (sortOption === "latest") {
            return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        if (sortOption === "oldest") {
            return [...posts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }

        if ((sortOption === "nearest" || sortOption === "farthest") && userLocation) {
            const postsWithLocation = posts.filter(post => post.location?.lat && post.location?.lng);
            const postsWithoutLocation = posts.filter(post => !post.location?.lat || !post.location?.lng);

            const sorted = sortPostsByDistance(postsWithLocation, userLocation);
            const sortedByDirection = sortOption === "farthest" ? sorted.reverse() : sorted;

            return [...sortedByDirection, ...postsWithoutLocation.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )];
        }

        return posts;
    }


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
            (err) => console.error("Lỗi truy cập vị trí:", err),
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            {isManagerOrStaff && (
                <div
                    className="bg-(--card) rounded-xl shadow-md p-4 flex items-center gap-4 cursor-pointer"
                    onClick={() => setOpenDialog(true)}
                >
                    <Avatar className="w-10 h-10 object-center object-cover ring-2 ring-(--primary)">
                        {/* shelter avatar */}
                        <AvatarImage src={shelterInfo?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{shelterInfo?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
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
                <DialogContent className="sm:max-w-[600px] bg-background rounded-xl overflow-visible border border-border">
                    <DialogHeader>
                        <DialogTitle>Tạo bài viết</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                            <img src={shelterInfo?.avatar || "/placeholder.svg"} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-medium text-sm">{shelterInfo?.name}</p>
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
                        {address && (
                            <div className="text-xs text-primary font-medium mb-1 bg-muted px-2 py-1 rounded-full inline-flex items-center w-fit">
                                <MapPinIcon className="w-3 h-3 mr-1" />
                                {address}
                            </div>
                        )}
                        <Textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Bạn muốn chia sẻ điều gì?"
                            className="resize-none border border-border text-base placeholder:text-muted-foreground overflow-y-auto max-h-[200px] focus:ring-0"
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
                                    <div ref={emojiPickerRef} className="absolute left-15 bottom-[-200px] z-50 ">
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
                            <Button
                                variant="ghost"
                                disabled={loading || (!postContent.trim() && selectedImages.length === 0)}
                                className="cursor-pointer"
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
                                            setShowPicker(false);
                                            setSuggestions([]);
                                            setOpenDialog(false);
                                        },
                                    });
                                }}
                            >
                                Hủy
                            </Button>
                            <Button onClick={handleCreatePost}  disabled={loading || (!postContent.trim() && selectedImages.length === 0)} className="flex items-center gap-2 cursor-pointer ml-2">
                                {loading ? "Đang đăng..." : "Đăng bài"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex justify-between items-center gap-2 mt-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Sắp xếp:</span>
                    <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
                        <SelectTrigger className="w-[160px] h-8 text-sm cursor-pointer">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="latest">Mới nhất</SelectItem>
                            <SelectItem className="cursor-pointer" value="oldest">Cũ nhất</SelectItem>
                            <SelectItem className="cursor-pointer" value="nearest">Gần nhất</SelectItem>
                            <SelectItem className="cursor-pointer" value="farthest">Xa nhất</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" onClick={fetchPosts} className="flex items-center gap-2 text-sm cursor-pointer">
                    <RefreshCcw className={`w-4 h-4 ${loadingPosts ? "animate-spin" : ""}`} />
                    {loadingPosts ? "Đang tải..." : "Tải lại bài viết"}
                </Button>
            </div>

            <div className="space-y-4 mt-4">
                {postsData.length === 0 && !loading && (
                    <p className="text-muted-foreground text-sm text-center">Chưa có bài viết nào.</p>
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
                    getSortedShelterPosts(postsData, userLocation)
                        .slice(0, visiblePosts)
                        .map((post) => (
                            <ShelterPostCard
                                key={post._id}
                                post={post}
                                currentUserId={userProfile?._id || ""}
                                onLike={handleLike}
                                onEdit={(p) => {
                                    setEditingPost(p);
                                    setIsEditOpen(true);
                                }}
                                onDelete={(id) => setConfirmDeletePostId(id)}
                                onViewDetail={(id) => setDetailPostId(id)}
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
                                    ...updated,
                                    createdBy: updated.createdBy?._id || updated.createdBy,
                                    user: updated.user || p.user,
                                    shelter: updated.shelter || p.shelter,
                                    latestComment: updated.latestComment ?? p.latestComment,
                                }
                                : p
                        )
                    );
                }}
            />

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
        </div>
    );
}

export default ShelterPosts;
