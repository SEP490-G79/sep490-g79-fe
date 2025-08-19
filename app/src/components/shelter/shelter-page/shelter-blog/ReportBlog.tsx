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
import AppContext from "@/context/AppContext";
import { Flag } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const predefinedReasons = [
  "Blog đăng thông tin sai lệch về thú cưng",
  "Chứa hình ảnh hoặc nội dung bạo hành động vật",
  "Quảng cáo mua bán thú cưng trái phép",
  "Xúi giục hoặc vi phạm quy định nhận nuôi thú cưng",
  "Nội dung vi phạm pháp luật Việt Nam",
  "Spam, quảng cáo sản phẩm/dịch vụ không liên quan",
  "Sử dụng ngôn từ thô tục, kích động hoặc thiếu tôn trọng",
  "Không phù hợp với cộng đồng yêu động vật và thú cưng",
  "Khác",
];

export default function ReportBlogDialog({
  blogId,
}: {
  blogId: string;
}) {
  const authAxios = useAuthAxios();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const {reportAPI} = useContext(AppContext)

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files) {
        const selectedPhotos = Array.from(e.target.files);

        // Tính tổng số ảnh hiện tại + mới chọn
        if (photos.length + selectedPhotos.length > 5) {
          toast.error("Chỉ được chọn tối đa 5 ảnh.");
          return;
        }

        setPhotos((prev) => [...prev, ...selectedPhotos]);
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const reason =
        selectedReason === "Khác" ? customReason.trim() : selectedReason;

      if (!reason) {
        toast.error("Vui lòng chọn hoặc nhập lý do báo cáo.");
        return;
      }

      const formData = new FormData();
      formData.append("reportType", "blog");
      formData.append("blogId", blogId);
      formData.append("reason", reason);

      photos &&
        photos.forEach((file) => {
          formData.append("photos", file);
        });

      await authAxios.post(`${reportAPI}/report-blog`, formData);

      toast.success("Đã gửi báo cáo thành công.");
      closeRef.current?.click();
      setPhotos([]);
      setSelectedReason("");
      setCustomReason("");
    } catch (err : any) {
      toast.error(err?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => {
      if(!open){
        setPhotos([]);
        setSelectedReason("");
        setCustomReason("");
      }
    }}>
      <DialogTrigger asChild>
        <p className="flex text-sm underline text-destructive hover:text-amber-500 cursor-pointer">
          <Flag className="w-4 h-4 mr-2 text-destructive" /> Báo cáo
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Báo cáo bài viết blog</DialogTitle>
          <DialogDescription>
            Vui lòng chọn lý do báo cáo phù hợp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 w-full overflow-x-hidden">
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
              className="w-full overflow-y-auto"
              maxLength={500}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}

          {/* upload photo */}
          <label className="block text-sm font-medium">Ảnh bằng chứng</label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadPhoto}
          />
          <div className="flex gap-2 flex-wrap mt-2">
            {photos.map((photo: File, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`${index} photo`}
                  className="h-24 w-24 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPhotos(
                      (prev) => prev?.filter((_, i) => i !== index) || []
                    )
                  }
                  className="absolute top-1 right-1 h-5 cursor-pointer px-2 py-0 "
                  title="Xoá ảnh"
                >
                  <span className="text-destructive mb-1">x</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeRef} variant="outline" hidden={loading}>
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="default"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi báo cáo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
