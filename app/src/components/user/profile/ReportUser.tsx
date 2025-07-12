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

  const handleSubmit = async () => {
    const reason =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;

    if (!reason) {
      toast.error("Vui lòng chọn hoặc nhập lý do báo cáo.");
      return;
    }

    try {
      setLoading(true);
      // Gửi API report user
      // await authAxios.post("/report/report-user", {
      //   reportType: "user",
      //   user: userId,
      //   reason,
      // });

      console.log({
        reportType: "user",
        user: userId,
        reason,
      })
      toast.success("Đã gửi báo cáo người dùng thành công.");
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
        <p className="text-sm text-red-500 cursor-pointer hover:underline">
          Báo cáo người dùng
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
