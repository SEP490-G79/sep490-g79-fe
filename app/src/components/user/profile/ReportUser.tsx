import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import useAuthAxios from "@/utils/authAxios";
import { Input } from "@/components/ui/input";
import { Flag } from "lucide-react";
import AppContext from "@/context/AppContext";

const predefinedReasons = [
  "Người dùng đăng thông tin sai sự thật",
  "Người dùng có hành vi lừa đảo",
  "Lời nói kích động hoặc quấy rối",
  "Vi phạm quy định cộng đồng",
  "Sử dụng tài khoản sai mục đích",
  "Khác",
];

export default function ReportUserDialog({ userId }: { userId: string }) {
  const authAxios = useAuthAxios();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>();
  const {reportAPI} = useContext(AppContext)

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files !== null) {
        const selectedPhotos: FileList = e.target.files;
        if (!selectedPhotos) {
          return;
        }
        const photosArray = Array.from(selectedPhotos);
        setPhotos(photosArray);
      }
      

    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;

    if (!reason) {
      toast.error("Vui lòng chọn hoặc nhập lý do báo cáo.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("reportType", "user");
      formData.append("userId", userId);
      formData.append("reason", reason);

      photos &&
        photos.forEach((file) => {
          formData.append("photos", file);
        });

      await authAxios.post(`${reportAPI}/report-user`, formData);

      console.log({
        reportType: "user",
        userId: userId,
        reason,
        photos,
      });
      toast.success("Đã gửi báo cáo người dùng thành công.");
      closeRef.current?.click();
      setSelectedReason("");
      setCustomReason("");
      setPhotos([]);
    } catch (err : any) {
      toast.error(err?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => {
      if(!open){
              setSelectedReason("");
              setCustomReason("");
              setPhotos([]);
      }
    }}>
      <DialogTrigger asChild>
        <p className="text-xs text-destructive cursor-pointer hover:underline font-semibold flex">
          <Flag className="w-4 h-4"/> Báo cáo
        </p>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Báo cáo người dùng</DialogTitle>
          <DialogDescription>
            Vui lòng chọn lý do báo cáo người dùng này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Lý do báo cáo</label>
          <Select
            value={selectedReason}
            onValueChange={(value) => setSelectedReason(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn lý do" />
            </SelectTrigger>
            <SelectContent>
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
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}

          {/* upload photo */}
          <label className="block text-sm font-medium">Ảnh bằng chứng</label>
          <Input type="file" accept="image/*" multiple  onChange={handleUploadPhoto}/>
          {photos !== undefined && photos.length > 0 && 
          <div className="flex gap-2">
            {photos.map((photo: File, index: number) => {
              return <img src={URL.createObjectURL(photo)} alt={index +" photo"} key={index} className="max-h-15 max-w-20"/>
            })}
          </div>
          }
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeRef} variant="outline">
              Hủy
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi báo cáo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
