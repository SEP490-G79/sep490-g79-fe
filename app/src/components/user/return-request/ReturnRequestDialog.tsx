import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, useContext } from "react";
import { toast } from "sonner";
import useAuthAxios from "@/utils/authAxios";
import type { ReturnRequest } from "@/types/ReturnRequest";
import AppContext from "@/context/AppContext";

type PetInfo = ReturnRequest["pet"];
type ShelterInfo = ReturnRequest["shelter"];

interface ReturnRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pet: PetInfo;
    shelter: ShelterInfo;
}


export default function ReturnRequestDialog({ open, onOpenChange, pet, shelter }: ReturnRequestDialogProps) {
    const { returnRequestAPI } = useContext(AppContext);
    const [reason, setReason] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const authAxios = useAuthAxios();

    const handleSubmit = async () => {
        if (!reason.trim()) return toast.error("Vui lòng nhập lý do");
        if (files.length === 0) return toast.error("Vui lòng chọn ít nhất 1 ảnh");
        if (files.length > 5) return toast.error("Tối đa 5 ảnh");

        const formData = new FormData();
        formData.append("pet", pet._id);
        formData.append("shelter", shelter._id);
        formData.append("reason", reason);
        files.forEach((file) => formData.append("photos", file));

        try {
            setLoading(true);
            await authAxios.post(`${returnRequestAPI}/create`, formData);
            toast.success("Gửi yêu cầu trả thú cưng thành công");
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Gửi yêu cầu thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []).filter((file) =>
            file.type.startsWith("image/")
        );

        if (files.length + selectedFiles.length > 5) {
            toast.error("Chỉ được chọn tối đa 5 ảnh");
            return;
        }

        setFiles((prev) => [...prev, ...selectedFiles]);
    };

    const handleRemoveImage = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yêu cầu trả thú cưng</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Label>Lý do trả thú cưng</Label>
                    <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />

                    <Label>Ảnh minh chứng (tối đa 5 ảnh)</Label>

                    <div className="relative">
                        <Input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="fileInput"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/80 transition"
                        >
                            <UploadIcon className="w-4 h-4" />
                            Chọn ảnh
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Ảnh ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                                    >
                                        <XIcon className="w-4 h-4 cursor-pointer" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DialogFooter className="pt-4">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
