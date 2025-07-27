import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pet } from "@/types/Pet";
import type { MissionForm } from "@/types/MissionForm";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
function getColorBarClass(total: number): string {
  if (total <= 29) return "bg-red-500";
  if (total >= 30 && total <= 59) return "bg-yellow-400";
  if (total >= 60 && total <= 79) return "bg-blue-400";
  return "bg-green-500";
}

export default function PetSubmission() {
  const { shelterId, petId } = useParams();
  const { petsList, submissionsByPetId, setSubmissionsByPetId, coreAPI } = useAppContext();
  const authAxios = useAuthAxios();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const pet = petsList.find((p: Pet) => p._id === petId);
  const submissions = submissionsByPetId[petId ?? ""] || [];
  const [selectedSubmission, setSelectedSubmission] = useState<MissionForm | null>(null);
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(true);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  useEffect(() => {
    if (!submissions.length && petId) fetchSubmissions();
  }, [petId]);

  const fetchSubmissions = async () => {
    try {
      const res = await authAxios.post(`${coreAPI}/adoption-submissions/by-pet-ids`, {
        petIds: [petId],
      });
      const submissions: MissionForm[] = res.data;
      setSubmissionsByPetId({ [petId!]: submissions });
    } catch (err) {
      console.error("Lỗi khi fetch submissions:", err);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: string) => {
    try {
      const updateStatus = await authAxios.patch(`${coreAPI}/adoption-submissions/update-submission-status/${shelterId}`, ({ submissionId, status }));
      toast.success("Cập nhật trạng thái thành công");
      fetchSubmissions();
      return updateStatus.data.status;

    } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message || 
      "Không thể cập nhật trạng thái"; 
    toast.error(errorMessage);
    }


  }

  const statusOptions = ["pending", "interviewing", "reviewed", "approved", "rejected"];
  const statusLabels: Record<string, string> = {
    pending: "Chờ duyệt",
    interviewing: "Chờ phỏng vấn",
    reviewed: "Đã phỏng vấn",
    approved: "Đồng ý",
    rejected: "Từ chối",

  };

  const statusCounts = submissions.reduce<Record<string, number>>((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, {});

  const filteredSubmissions = submissions
    .filter((sub) => !statusFilter || sub.status === statusFilter)
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0));
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ duyệt",
      interviewing: "Chờ phỏng vấn",
      reviewed: "Đã phỏng vấn",
      approved: "Đồng ý",
      rejected: "Từ chối",
    };
    return statusMap[status] || status;
  };

  const statusOptionsMap: { [key: string]: string[] } = {
    pending: ["pending", "interviewing", "rejected"],
    interviewing: ["interviewing", "pending", "reviewed"],
    reviewed: ["reviewed", "approved", "rejected"],
    rejected: ["rejected", "pending", "interviewing"],
  };

  const currentStatus = selectedSubmission?.status || "";
  const options = statusOptionsMap[currentStatus] || statusOptions;



  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={pet?.photos?.[0] || "/placeholder-avatar.png"}
          alt={pet?.name}
          className="w-28 h-28 object-cover rounded-lg border"
        />
        <div>
          <h1 className="text-2xl font-semibold">{pet?.name}</h1>
          <p className="text-muted-foreground">Mã thú cưng: {pet?.petCode}</p>
        </div>


      </div>
      <div className="flex items-center flex-wrap justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className={`px-3 py-1  rounded-full border text-sm ${statusFilter === "" ? "bg-primary text-white" : "bg-white dark:bg-gray-800"
              }`}
            onClick={() => setStatusFilter("")}
          >
            Tất cả ({submissions.length})
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`px-3 py-1 rounded-full border text-sm capitalize ${statusFilter === status ? "bg-primary text-white" : "bg-white dark:bg-gray-800"
                }`}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabels[status]} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="px-3 py-1 rounded-full border text-sm bg-white dark:bg-gray-800 ">
              Chú thích
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Giải thích mức độ phù hợp của đơn yêu cầu</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-sm">
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Phù hợp thấp (dưới 30%)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                Phù hợp trung bình (30–59%)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                Phù hợp cao (60–79%)
              </p>
              <p>
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Phù hợp rất cao (trên 80%)
              </p>
            </div>
          </DialogContent>
        </Dialog>


      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {filteredSubmissions.length === 0 ? (
          <p className="flex items-center justify-center text-muted-foreground text-sm col-span-full mt-10">Không có đơn</p>
        ) : (
          filteredSubmissions.map((submission) => {
            const total = submission.total ?? 0;
            const colorBar = getColorBarClass(total);

            return (
              <div key={submission._id} className="flex rounded-md shadow-sm overflow-hidden border">
                <div className={`w-2 ${colorBar}`} />
                <div className="flex-1 bg-white">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle className="text-base">
                        <div className="flex items-center justify-between">
                          <div>
                            Người nộp:{" "}
                            <span className="text-primary font-medium">
                              {submission.performedBy?.fullName || "Ẩn danh"}
                            </span>
                          </div>
                          <Badge className="text-xs uppercase bg-primary text-white">
                            {getStatusLabel(submission.status)}
                          </Badge>
                        </div>
                      </CardTitle>

                      <p className="text-xs text-muted-foreground">
                        Nộp lúc: {format(new Date(submission.createdAt), "HH:mm dd/MM/yyyy")}
                      </p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      {/* <Badge variant="outline" className="text-sm">
                        Tổng điểm: {total}
                      </Badge> */}

                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-sm underline text-primary ml-auto"
                      >
                        Xem chi tiết
                      </button>

                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          }))}
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="w-full !max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader  >
              <DialogTitle className="text-center w-full " >Chi tiết đơn đăng ký</DialogTitle>

            </DialogHeader>
            <Separator />
            {selectedSubmission && (
              <div className="flex gap-8 h-[calc(90vh-110px)] ">
                <div className="w-1/3 space-y-2">

                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={selectedSubmission.performedBy?.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-35 h-35 rounded-full border-1 border-gray-100 shadow-md object-cover object-center "
                    />
                  </div>
                  <p><strong>Người yêu cầu:</strong> {selectedSubmission.performedBy?.fullName || "Ẩn danh"}</p>
                  <p><strong>Ngày sinh:</strong>  {selectedSubmission.performedBy?.dob
                    ? dayjs(selectedSubmission.performedBy?.dob).format("DD/MM/YYYY")
                    : "Chưa có thông tin"}</p>
                  <p><strong>Số điện thoại:</strong> {selectedSubmission.performedBy?.phoneNumber || "Không có"}</p>
                  <p><strong>Email:</strong> {selectedSubmission.performedBy?.email || "Không có"}</p>
                  <p><strong>Địa chỉ:</strong> {selectedSubmission.performedBy?.address || "Không có"}</p>
                  <div className="pt-2">
                    <Button
                      className="w-full bg-primary text-white hover:bg-primary/90 transition rounded-md text-sm flex items-center justify-center gap-1"
                      onClick={() => navigate(`/profile/${selectedSubmission.performedBy?._id}`)}
                    >
                      <span>🔍</span> Xem trang cá nhân
                    </Button>
                  </div>
                </div>
                <Separator orientation="vertical" />
                <div className="w-2/3 space-y-2 overflow-y-auto">
                  {selectedSubmission?.performedBy?.warningCount === 1 && (
                    <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-4 py-2 rounded flex items-center gap-2 text-sm">
                      <span className="text-xl">⚠️</span>
                      <span>Tài khoản bị cảnh báo do vi phạm quy định về nhận nuôi thú cưng – mức cảnh báo nhẹ.</span>
                    </div>
                  )}

                  {selectedSubmission?.performedBy?.warningCount === 2 && (
                    <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded flex items-center gap-2 text-sm">
                      <span className="text-xl">🚫</span>
                      <span>Tài khoản bị cảnh báo do vi phạm nhiều lần quy định về nhận nuôi thú cưng – mức cảnh báo cao.</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <strong>Trang thái: </strong>
                    <AlertDialog open={!!pendingStatus} onOpenChange={(open) => !open && setPendingStatus(null)}>
                      {currentStatus === "approved" ? (
                        <Badge className="text-sm px-2 py-1 font-medium text-foreground bg-green-400 rounded">
                          {statusLabels["approved"]}
                        </Badge>
                      ) : (
                        <Select
                          value={currentStatus}
                          onValueChange={(nextStatus) => {
                            if (nextStatus !== currentStatus) {
                              setPendingStatus(nextStatus);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[180px] bg-primary text-white border-none dark:bg-primary ">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((status) => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <AlertDialog open={!!pendingStatus} onOpenChange={(open) => !open && setPendingStatus(null)}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {pendingStatus
                                ? `Xác nhận chuyển trạng thái thành "${statusLabels[pendingStatus]}"`
                                : "Không có trạng thái để cập nhật"}
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                if (pendingStatus) {
                                  const updatedStatus = await updateSubmissionStatus(selectedSubmission._id, pendingStatus);
                                  if (updatedStatus) {
                                    setSelectedSubmission({
                                      ...selectedSubmission,
                                      status: updatedStatus,
                                    });
                                    setPendingStatus(null);
                                  }
                                }
                              }}
                            >
                              Đồng ý
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>


                    </AlertDialog>
                  </div>


                  <div className="flex items-center gap-2">
                    <p ><strong>Mức độ phù hợp:</strong></p>
                    <Badge className={getColorBarClass(selectedSubmission.total)}>{selectedSubmission.total}%</Badge>
                  </div>

                  <p><strong>Thời gian gửi yêu cầu:</strong> {format(new Date(selectedSubmission.createdAt), "HH:mm dd/MM/yyyy")}</p>
                  <p><strong>Số lượng thú cưng nhận nuôi trong 1 tháng:</strong> {selectedSubmission?.adoptionsLastMonth || "Không có"} </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswers((prev) => !prev)}
                  >
                    {showAnswers ? "Ẩn câu trả lời" : "Hiển thị câu trả lời"}
                  </Button>

                  {/* Thêm các trường khác nếu có */}
                  {showAnswers && selectedSubmission.answers && (
                    <div className="space-y-4 pt-4">


                      {selectedSubmission.answers.map((ans, i) => {
                        const question = ans.questionId;
                        const selections = ans.selections;

                        return (
                          <div
                            key={i}
                            className="rounded-lg border bg-muted/40 p-4 space-y-2"
                          >
                            <p className="font-medium text-sm text-foreground">{question.title}</p>

                            {/* === TYPE HANDLING === */}
                            {question.type === "TEXT" && (
                              <p className="text-sm text-muted-foreground">{selections[0] || "Không có câu trả lời"}</p>
                            )}

                            {(question.type === "SINGLECHOICE" || question.type === "MULTIPLECHOICE" || question.type === "YESNO") && (
                              <div className="space-y-1 pl-2">
                                {question.options.map((option) => {
                                  const isSelected = selections.includes(option.title);

                                  return (
                                    <div
                                      key={option._id}
                                      className={`flex items-center gap-2 text-sm
                                      ${option.isTrue ? "text-green-600" : isSelected ? "text-red-600" : "text-muted-foreground"}
                                     
                                  `}
                                    >
                                      <div
                                        className={`${question.type === "MULTIPLECHOICE" ? "w-4 h-4 rounded-sm" : "w-4 h-4 rounded-full"}
                                        border
                                        ${isSelected ? (option.isTrue ? "bg-green-500 border-green-500" : "bg-red-500 border-red-500") : "border-gray-400"}
                                  `}
                                      />
                                      <span>
                                        {option.title}
                                      </span>
                                    </div>

                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
