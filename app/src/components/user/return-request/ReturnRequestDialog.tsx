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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PetInfo = ReturnRequest["pet"];
type ShelterInfo = ReturnRequest["shelter"];

interface ReturnRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pet: PetInfo;
    shelter: ShelterInfo;
}

const predefinedReasons = [
  "Không còn đủ điều kiện tài chính để chăm sóc",
  "Không có đủ thời gian dành cho thú cưng",
  "Thú cưng có vấn đề về sức khỏe cần chăm sóc đặc biệt",
  "Thú cưng không hòa hợp với các thú cưng khác trong nhà",
  "Thú cưng không hòa hợp với trẻ em hoặc thành viên trong gia đình",
  "Người nhận nuôi bị dị ứng với thú cưng",
  "Chuyển nhà đến nơi không cho phép nuôi thú cưng",
  "Thay đổi môi trường sống hoặc công việc quá bận rộn",
  "Thú cưng có hành vi khó kiểm soát (cắn, cào, phá phách...)",
  "Không có đủ không gian để nuôi thú cưng",
  "Người nhận nuôi gặp vấn đề sức khỏe cá nhân",
  "Gia đình không đồng thuận việc nuôi thú cưng",
  "Thú cưng cần sự huấn luyện chuyên sâu mà người nuôi không đáp ứng được",
  "Người nhận nuôi đi công tác/du học dài hạn",
  "Người nhận nuôi qua đời hoặc không còn khả năng chăm sóc",
  "Khác",
];


export default function ReturnRequestDialog({ open, onOpenChange, pet, shelter }: ReturnRequestDialogProps) {
    const { returnRequestAPI } = useContext(AppContext);
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [customReason, setCustomReason] = useState<string>("") 
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const authAxios = useAuthAxios();

    const handleSubmit = async () => {
        let reason;
        if (selectedReason.trim().length < 1) return toast.error("Vui lòng chọn lý do");
        if (files.length === 0) return toast.error("Vui lòng chọn ít nhất 1 ảnh");
        if (files.length > 5) return toast.error("Tối đa 5 ảnh");

        if(selectedReason === "Khác"){
            if(customReason.trim().length < 2){
                toast.error("Vui lòng ghi lý do đầy đủ!")
                return;
            }else{
                reason = customReason;
            }
        }else{
            reason = selectedReason;
        }
        

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
            setSelectedReason("");
            setFiles([]);
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
            <Select
              value={selectedReason}
              onValueChange={(value) => setSelectedReason(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {predefinedReasons.map((reason, index) => (
                  <SelectItem key={index} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedReason === "Khác" && (
              <Textarea
                placeholder="Nhập lý do cụ thể..."
                className="w-full overflow-y-auto"
                maxLength={500}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <Label>Ảnh tình trạng thú nuôi hiện tại</Label>

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
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className=" cursor-pointer"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}