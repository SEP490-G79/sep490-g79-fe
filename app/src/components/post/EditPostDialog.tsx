import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Globe, GlobeLock, ImageIcon, SmileIcon, X, LocateFixed, MapPinIcon } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect, useContext } from "react";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import axios from "axios";

interface EditPostDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    post: any;
    onSave: (updatedPost: any) => void;
}

const MAX_TOTAL_IMAGES = 5;

const EditPostDialog: React.FC<EditPostDialogProps> = ({ open, onOpenChange, post, onSave }) => {
    const { coreAPI } = useContext(AppContext);
    const authAxios = useAuthAxios();

    const [content, setContent] = useState(post.title || "");
    const [privacy, setPrivacy] = useState(post.privacy || "public");
    const [existingPhotos, setExistingPhotos] = useState<string[]>(post.photos || []);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [address, setAddress] = useState(post.address || "");
    const [location, setLocation] = useState<{ lat: number; lng: number }>(post.location || { lat: 0, lng: 0 });
    const [suggestions, setSuggestions] = useState<{ place_id: string; description: string }[]>([]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setContent(post.title || "");
        setPrivacy(post.privacy || "public");
        setExistingPhotos(post.photos || []);
        setNewImages([]);
        setPreviewUrls([]);
    }, [post]);

    const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = existingPhotos.length + newImages.length + files.length;
        if (totalImages > MAX_TOTAL_IMAGES) {
            toast.error(`Tổng số ảnh không được vượt quá ${MAX_TOTAL_IMAGES}.`);
            return;
        }

        setNewImages(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...previews]);
    };

    const removeExistingPhoto = (index: number) => {
        setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const totalImages = existingPhotos.length + newImages.length;
        if (totalImages > MAX_TOTAL_IMAGES) {
            toast.error(`Chỉ được đăng tối đa ${MAX_TOTAL_IMAGES} ảnh.`);
            return;
        }

        if (!content.trim() && totalImages === 0) {
            toast.error("Bài viết không được để trống.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", content);
            formData.append("privacy", privacy);
            formData.append("address", address);
            formData.append("location", JSON.stringify(location));
            formData.append("existingPhotos", JSON.stringify(existingPhotos));
            newImages.forEach((file) => formData.append("photos", file));

            const res = await authAxios.put(`${coreAPI}/posts/${post._id}/edit`, formData);
            onSave(res.data.data);
            toast.success("Cập nhật bài viết thành công");
            onOpenChange(false);
        } catch (error: any) {
            const message = error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
            toast.error(`Lỗi chỉnh sửa: ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const allPreviewImages = [
        ...existingPhotos.map((url, idx) => ({ url, isNew: false, index: idx })),
        ...previewUrls.map((url, idx) => ({ url, isNew: true, index: idx }))
    ];


    //goong api
    const fetchAddressSuggestions = async (query: string) => {
        if (!query.trim()) return setSuggestions([]);
        try {
            const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
                params: { input: query, api_key: import.meta.env.VITE_GOONG_API_KEY },
            });
            setSuggestions(res.data.predictions || []);
        } catch (error) {
            console.error("Autocomplete error:", error);
        }
    };

    const fetchPlaceDetail = async (placeId: string) => {
        try {
            const res = await axios.get("https://rsapi.goong.io/Place/Detail", {
                params: { place_id: placeId, api_key: import.meta.env.VITE_GOONG_API_KEY },
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
        if (!navigator.geolocation) return alert("Trình duyệt không hỗ trợ định vị.");
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
            (err) => console.error("Lỗi định vị:", err),
            { enableHighAccuracy: true }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2 flex-1 overflow-y-auto pr-1">
                    <Select value={privacy} onValueChange={setPrivacy}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public"><Globe className="w-4 h-4 mr-2" />Công khai</SelectItem>
                            <SelectItem value="private"><GlobeLock className="w-4 h-4 mr-2" />Riêng tư</SelectItem>
                        </SelectContent>
                    </Select>

                    {address && (
                        <div className="text-xs text-primary font-medium bg-muted px-2 py-1 rounded-full inline-flex items-center w-fit">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {address}
                        </div>
                    )}

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Chỉnh sửa nội dung bài viết..."
                        className="resize-none border border-border text-base placeholder:text-muted-foreground overflow-y-auto max-h-[200px] focus:ring-0"
                    />

                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                        {allPreviewImages.map((item, idx) => (
                            <div key={idx} className="relative">
                                <img
                                    src={item.url}
                                    alt={`Ảnh ${idx + 1}`}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() =>
                                        item.isNew ? removeNewImage(item.index) : removeExistingPhoto(item.index)
                                    }
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 cursor-pointer"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 items-center text-muted-foreground relative pl-1">
                        <label htmlFor="edit-image-upload">
                            <ImageIcon className="w-5 h-5 cursor-pointer shrink-0" />
                            <input
                                id="edit-image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleNewImages}
                            />
                        </label>

                        <div className="relative">
                            <SmileIcon
                                className="w-5 h-5 cursor-pointer shrink-0"
                                onClick={() => setShowPicker(!showPicker)}
                            />
                            {showPicker && (
                                <div
                                    ref={emojiPickerRef}
                                    className="absolute left-0 top-full mt-2 z-50"
                                >
                                    <EmojiPicker
                                        onEmojiClick={(emojiData) => {
                                            setContent((prev: string) => prev + emojiData.emoji);
                                        }}
                                        autoFocusSearch={false}
                                    />
                                </div>
                            )}

                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <MapPinIcon className="w-5 h-5 cursor-pointer shrink-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="p-3 space-y-2 w-[320px]">
                                <div className="flex gap-2">
                                    <Input
                                        value={address}
                                        onChange={(e: any) => {
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
                </div>

                <DialogFooter className="mt-4 shrink-0 flex flex-wrap items-center justify-end gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">Hủy</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bạn có chắc muốn hủy thay đổi?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Các chỉnh sửa sẽ bị mất và không được lưu.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Không</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        setContent(post.title || "");
                                        setPrivacy(post.privacy || "public");
                                        setExistingPhotos(post.photos || []);
                                        setNewImages([]);
                                        setPreviewUrls([]);
                                        setShowPicker(false);
                                        onOpenChange(false);
                                    }}
                                >
                                    Hủy thay đổi
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostDialog;
