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
import { useRef, useState } from "react";
import { toast } from "sonner";
import useAuthAxios from "@/utils/authAxios";

const predefinedReasons = [
  "Thông tin thú cưng sai sự thật",
  "Bài viết chứa hình ảnh bạo hành động vật",
  "Rao bán thú cưng trái phép",
  "Vi phạm hợp đồng nhận nuôi",
  "Nội dung vi phạm pháp luật Việt Nam",
  "Spam hoặc quảng cáo không liên quan",
  "Ngôn từ kích động hoặc thiếu tôn trọng",
  "Nội dung không phù hợp với cộng đồng yêu thú cưng",
  "Khác",
];

export default function ReportPostDialog({
  postId,
}: {
  postId: string;
}) {
  const authAxios = useAuthAxios();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;

    if (!reason) {
      toast.error("Vui lòng chọn hoặc nhập lý do báo cáo.");
      return;
    }
    console.log({
        reportType: "post",
        post: postId,
        reason,
      })

    try {
      setLoading(true);
    //   await authAxios.post("/report/report-post", {
    //     reportType: "post",
    //     post: postId,
    //     reason,
    //   });

      toast.success("Đã gửi báo cáo thành công.");
      closeRef.current?.click();
      setSelectedReason("");
      setCustomReason("");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi gửi báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
        <DialogTrigger asChild>
            <p>Báo cáo</p>
        </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Báo cáo bài viết</DialogTitle>
          <DialogDescription>Vui lòng chọn lý do báo cáo phù hợp</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Lý do báo cáo</label>
          <Select
            value={selectedReason}
            onValueChange={(value) => setSelectedReason(value)}
          >
            <SelectTrigger className="w-[30vw]">
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
        </div>

        <DialogFooter>
            <DialogClose asChild>
                <Button ref={closeRef} variant="outline">
            Hủy
          </Button>
            </DialogClose>
          <Button type="submit" variant="default" onClick={handleSubmit}>
            Gửi báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
