import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useAuthAxios from "@/utils/authAxios";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";

export default function EditReturnRequestDialog({ open, onOpenChange, request, onUpdated }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    request: any;
    onUpdated: (updated: any) => void;
}) {
    const authAxios = useAuthAxios();
    const { returnRequestAPI } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(request?.reason || "");

    const [existingPhotos, setExistingPhotos] = useState<string[]>(request.photos || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const statusLabels: Record<"approved" | "rejected" | "cancelled" | "pending", string> = {
        approved: "Đã duyệt",
        rejected: "Từ chối",
        cancelled: "Đã huỷ",
        pending: "Chờ duyệt",
    };

    const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const total = existingPhotos.length + newFiles.length + files.length;
        if (total > 5) {
            toast.error("Tối đa 5 ảnh bao gồm cả ảnh cũ và mới");
            return;
        }
        setNewFiles((prev) => [...prev, ...files]);
    };

    const handleRemoveExisting = (index: number) => {
        const updated = [...existingPhotos];
        updated.splice(index, 1);
        setExistingPhotos(updated);
    };

    const handleRemoveNew = (index: number) => {
        const updated = [...newFiles];
        updated.splice(index, 1);
        setNewFiles(updated);
    };

    const handleSubmit = async () => {
        if (!reason.trim()) return toast.error("Lý do không được để trống");
        if (existingPhotos.length + newFiles.length === 0) {
            return toast.error("Cần ít nhất một ảnh");
        }

        const formData = new FormData();
        formData.append("reason", reason);
        formData.append("existingPhotos", JSON.stringify(existingPhotos));
        newFiles.forEach((file) => formData.append("photos", file));

        try {
            setLoading(true);
            const res = await authAxios.put(
                `${returnRequestAPI}/${request._id}/update`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            toast.success("Đã cập nhật yêu cầu");
            onUpdated(res.data.data);
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Không thể cập nhật");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa yêu cầu trả thú cưng</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Thông tin cơ bản */}
                    <div className="text-sm space-y-1">
                        <div><strong>Thú cưng:</strong> {request.pet?.name}</div>
                        <div><strong>Trung tâm:</strong> {request.shelter?.name}</div>
                        <div>
                            <strong>Trạng thái:</strong>{" "}
                            <Badge
                                className={
                                    request.status === "approved"
                                        ? "bg-green-600"
                                        : request.status === "rejected"
                                            ? "bg-red-600"
                                            : request.status === "cancelled"
                                                ? "bg-gray-400"
                                                : "bg-yellow-500"
                                }
                            >
                                {statusLabels[request.status as keyof typeof statusLabels]}
                            </Badge>
                        </div>
                    </div>

                    {/* Lý do */}
                    <div>
                        <Label>Lý do trả thú cưng</Label>
                        <Textarea className="my-2" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>

                    {/* Tải ảnh */}
                    <div>
                        <Label>Ảnh minh hoạ</Label>
                        <input
                            id="photoInput"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAddFiles}
                            className="hidden"
                        />
                        <label
                            htmlFor="photoInput"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/80 transition mt-2"
                        >
                            <UploadIcon className="w-4 h-4" />
                            Chọn ảnh
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {existingPhotos.map((url, i) => (
                                <div key={`old-${i}`} className="relative w-16 h-16">
                                    <img src={url} className="w-full h-full object-cover rounded border" />
                                    <button
                                        onClick={() => handleRemoveExisting(i)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <XIcon className="w-4 h-4 cursor-pointer" />
                                    </button>
                                </div>
                            ))}
                            {newFiles.map((file, i) => (
                                <div key={`new-${i}`} className="relative w-16 h-16">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded border" />
                                    <button
                                        onClick={() => handleRemoveNew(i)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <XIcon className="w-4 h-4 cursor-pointer" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang cập nhật..." : "Cập nhật yêu cầu"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
