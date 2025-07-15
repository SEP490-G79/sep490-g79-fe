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
import { Globe, GlobeLock, ImageIcon, SmileIcon, X } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useEffect, useContext } from "react";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <Select value={privacy} onValueChange={setPrivacy}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public"><Globe className="w-4 h-4 mr-2" />Công khai</SelectItem>
                            <SelectItem value="private"><GlobeLock className="w-4 h-4 mr-2" />Riêng tư</SelectItem>
                        </SelectContent>
                    </Select>

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Chỉnh sửa nội dung bài viết..."
                        className="resize-none border border-border text-base placeholder:text-muted-foreground overflow-y-auto max-h-[200px] focus:ring-0"
                    />

                    <PhotoProvider>
                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                            {allPreviewImages.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <PhotoView src={item.url}>
                                        <img src={item.url} className="w-full h-40 object-cover rounded-lg cursor-pointer" />
                                    </PhotoView>
                                    <button
                                        onClick={() => item.isNew
                                            ? removeNewImage(item.index)
                                            : removeExistingPhoto(item.index)
                                        }
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </PhotoProvider>

                    <div className="flex gap-4 items-center text-muted-foreground relative pl-1">
                        <label htmlFor="edit-image-upload">
                            <ImageIcon className="w-5 h-5 cursor-pointer" />
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
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => setShowPicker(!showPicker)}
                            />
                            {showPicker && (
                                <div
                                    ref={emojiPickerRef}
                                    className="absolute left-0 bottom-[-200px] z-50"
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
                    </div>
                </div>

                <DialogFooter className="mt-4 flex justify-between items-center">
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
