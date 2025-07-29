import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReturnRequest } from "@/types/ReturnRequest";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PhotoView } from "react-photo-view";

const ReturnRequestDialog = ({
  dialogDetail,
  setDialogDetail,
  handleApprove,
  handleReject,
  loading,
  setCurrentIndex,
  setIsPreview,
}: {
  dialogDetail: ReturnRequest | null;
  setDialogDetail: Function;
  handleApprove: (requestId: string) => Promise<void>;
  handleReject: (requestId: string, rejectReason: string) => Promise<void>;
  loading: boolean;
  setCurrentIndex: Function;
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isExpandReason, setIsExpandReason] = useState(false);
  const [isExpandRejectReason, setIsExpandRejectReason] = useState(false);

  const statusTiengViet = (status: string) => {
    switch (status) {
      case "approved":
        return <p className="text-green-500">Chấp thuận</p>;
      case "rejected":
        return <p className="text-destructive">Từ chối</p>;
      case "cancelled":
        return <p className="text-red-400">Đã hủy</p>;
      default:
        return <p className="text-slate-500">Chờ xử lý</p>;
    }
  };
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");


  return (
    <Dialog
      open={dialogDetail !== null}
      onOpenChange={(open) => {
        if (!open) setDialogDetail(null);
      }}
    >
      <DialogContent className="!max-w-[50vw] !max-h-[80vh] overflow-y-auto border border-8 border-white">
        <DialogHeader>
          <DialogTitle>Chi tiết yêu cầu trả thú nuôi</DialogTitle>
          <DialogDescription>
            Kiểm tra và xử lý yêu cầu từ người dùng
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-12 gap-6 py-4 text-sm">
          {/* Thông tin thú nuôi */}
          <div className="col-span-12">
            <h3 className="font-semibold text-base mb-2">Thú nuôi</h3>
            <div className="flex gap-4 items-center bg-muted p-4 rounded-lg">
              <img
                src={dialogDetail?.pet.photos && dialogDetail.pet.photos[0]}
                className="w-24 h-20 rounded object-cover border"
              />
              <div>
                <p className="font-semibold">{dialogDetail?.pet.name}</p>
                <p className="text-muted-foreground text-sm">
                  Mã thú cưng: {dialogDetail?.pet.petCode}
                </p>
              </div>
            </div>
          </div>

          {/* Người gửi yêu cầu */}
          <div className="col-span-6">
            <h3 className="font-semibold text-base mb-2">Người gửi yêu cầu</h3>
            <div className="flex items-center gap-2 bg-muted p-4 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    dialogDetail?.requestedBy &&
                    dialogDetail?.requestedBy.avatar
                  }
                />
              </Avatar>
              <div>
                <p className="font-semibold">
                  {dialogDetail?.requestedBy &&
                    dialogDetail?.requestedBy.fullName}
                </p>
              </div>
            </div>
          </div>

          {/* Trạng thái + thời gian */}
          <div className="col-span-6 text-end space-y-2">
            <div>
              <p className="font-medium">Trạng thái</p>
              {statusTiengViet(
                dialogDetail?.status ? dialogDetail?.status : "rejected"
              )}
            </div>
            <div>
              <p className="font-medium">Thời gian yêu cầu</p>
              <p>{new Date(dialogDetail?.createdAt || new Date()).toLocaleString("vi-VN", {dateStyle: "full"})}</p>
            </div>
            {dialogDetail?.status !== "pending" && (
              <>
                <div className="flex items-center justify-end gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        dialogDetail?.approvedBy &&
                        dialogDetail?.approvedBy.avatar
                      }
                    />
                  </Avatar>
                  <p>
                    Duyệt bởi:{" "}
                    {dialogDetail?.approvedBy &&
                      dialogDetail?.approvedBy.fullName}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Thời gian duyệt</p>
                  <p>{new Date(dialogDetail?.updatedAt || new Date()).toLocaleString("vi-VN", {dateStyle: "full"})}</p>
                </div>
              </>
            )}
          </div>

          {/* Lý do */}
          <div className="col-span-12">
            <p className="font-medium mb-1">Lý do trả thú nuôi</p>
            {dialogDetail?.reason &&
            dialogDetail?.reason?.length > 300 &&
            !isExpandReason ? (
              <>
                <p>{dialogDetail?.reason.slice(0, 300)}...</p>
                <a
                  onClick={() => setIsExpandReason(true)}
                  className="text-blue-500 underline cursor-pointer"
                >
                  Đọc thêm
                </a>
              </>
            ) : dialogDetail?.reason &&
              dialogDetail?.reason?.length > 300 &&
              isExpandReason ? (
              <>
                <p>{dialogDetail?.reason}</p>
                <a
                  onClick={() => setIsExpandReason(false)}
                  className="text-blue-500 underline cursor-pointer"
                >
                  Rút gọn
                </a>
              </>
            ) : (
              <p>{dialogDetail?.reason || "Không có lý do"}</p>
            )}
          </div>

          {/* Lý do  từ chối yêu cầu*/}
          {dialogDetail && dialogDetail.status === "rejected" && <div className="col-span-12">
            <p className="font-medium mb-1">Lý do từ chối yêu cầu</p>
            {dialogDetail?.rejectReason &&
            dialogDetail?.rejectReason?.length > 300 &&
            !isExpandRejectReason ? (
              <>
                <p>{dialogDetail?.rejectReason.slice(0, 300)}...</p>
                <a
                  onClick={() => setIsExpandRejectReason(true)}
                  className="text-blue-500 underline cursor-pointer"
                >
                  Đọc thêm
                </a>
              </>
            ) : dialogDetail?.rejectReason &&
              dialogDetail?.rejectReason?.length > 300 &&
              isExpandRejectReason ? (
              <>
                <p>{dialogDetail?.rejectReason}</p>
                <a
                  onClick={() => setIsExpandRejectReason(false)}
                  className="text-blue-500 underline cursor-pointer"
                >
                  Rút gọn
                </a>
              </>
            ) : (
              <p>{dialogDetail?.rejectReason || "Không có lý do"}</p>
            )}
          </div>}

          {/* Ảnh */}
          {dialogDetail?.photos && dialogDetail?.photos.length > 0 && (
            <div className="col-span-12">
              <p className="font-medium mb-1">Ảnh</p>
              <div className="flex flex-wrap gap-3 p-2 border rounded-md">
                {dialogDetail?.photos.map((photo, idx) => (
                    <img
                    onSelect={(e) => e.preventDefault()}
                    key={idx}
                    src={photo}
                    className="h-24 w-36 object-cover rounded cursor-pointer border hover:scale-105 transition-transform"
                    onClick={() => {
                          setCurrentIndex(idx);
                          setIsPreview(true);
                    }}
                    alt={`proof-${idx}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogDetail(null)}>
            Đóng
          </Button>
          {dialogDetail?.status === "pending" && (
            <>
              <Button
                onClick={() => handleApprove(dialogDetail._id)}
                disabled={loading}
              >
                {loading ? <Loader2Icon className="mr-2 animate-spin" /> : null}
                Chấp thuận
              </Button>
              <Dialog
                open={openRejectDialog}
                onOpenChange={setOpenRejectDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => setOpenRejectDialog(true)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2Icon className="mr-2 animate-spin" />
                    ) : null}
                    Từ chối
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Lý do từ chối</DialogTitle>
                  </DialogHeader>
                  <DialogDescription></DialogDescription>

                  <Textarea
                    placeholder="Nhập lý do từ chối yêu cầu này..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="min-h-[100px]"
                  />

                  <DialogFooter className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectReason("");
                        setOpenRejectDialog(false);
                      }}
                      className="cursor-pointer"
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(dialogDetail._id, rejectReason);
                        setRejectReason("");
                        setOpenRejectDialog(false);
                      }}
                      disabled={!rejectReason.trim()}
                      className="cursor-pointer"
                    >
                      Xác nhận từ chối
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnRequestDialog;
