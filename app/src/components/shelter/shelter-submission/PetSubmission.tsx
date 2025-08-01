import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { format, startOfDay } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Pet } from "@/types/Pet";
import type { MissionForm } from "@/types/MissionForm";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CalendarCheck2, Check, ChevronsUpDown, EllipsisVertical, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DateTimePicker } from "./DateTimePicker";
import PetSubmissionInterviewSection from "./PetSubmissionInterviewSection";
import CreateDialog from "@/components/shelter/shelter-management/consent-form/CreateDialog";

function getColorBarClass(total: number): string {
  if (total <= 29) return "bg-red-500";
  if (total >= 30 && total <= 59) return "bg-yellow-400";
  if (total >= 60 && total <= 79) return "bg-blue-400";
  return "bg-green-500";
}

export default function PetSubmission() {
  const { shelterId, petId } = useParams();
  const {
    petsList,
    submissionsByPetId,
    setSubmissionsByPetId,
    coreAPI,
    userProfile,
    shelters,
  } = useAppContext();
  const authAxios = useAuthAxios();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const pet = petsList.find((p: Pet) => p._id === petId);
  const submissions = submissionsByPetId[petId ?? ""] || [];
  const [selectedSubmission, setSelectedSubmission] =
  useState<MissionForm | null>(null);
  const navigate = useNavigate();
  const [showAnswers, setShowAnswers] = useState(true);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [filterByPerformer, setFilterByPerformer] = useState<string>("all");
  const [interviewingSubFilter, setInterviewingSubFilter] = useState<
    "all" | "withSchedule" | "withoutSchedule"
  >("withSchedule");
  const [selectedTab, setSelectedTab] = useState<"answers" | "interview">(
    "answers"
  );
  const [feedback, setFeedback] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEarlyFeedback, setIsEarlyFeedback] = useState(false);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [note, setNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [openPerformer, setOpenPerformer] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    availableFrom: new Date(),
    availableTo: new Date(),
    method: "",
    performedBy: "",
  });
  const resetForm = () => {
    setScheduleData({
      availableFrom: new Date(),
      availableTo: new Date(),
      method: "",
      performedBy: "",
    });
    setSelectedStaff(null);
  };

  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const isShelterManager: boolean =
    shelters?.some((shelter) => {
      if (shelter._id !== shelterId) return false;

  return shelter.members?.some((member: any) => {
    const roles = member.roles;
    return (
      member._id === userProfile?._id &&
      (roles === "manager" || (Array.isArray(roles) && roles.includes("manager")))
    );
  });
}) ?? false; 



  useEffect(() => {
    if (!submissions.length && petId) fetchSubmissions();
  }, [petId]);

  const fetchSubmissions = async () => {
    try {
      const res = await authAxios.post(
        `${coreAPI}/adoption-submissions/by-pet-ids`,
        {
          petIds: [petId],
        }
      );
      const submissions: MissionForm[] = res.data;
      setSubmissionsByPetId({ [petId!]: submissions });
    } catch (err) {
      console.error("Lỗi khi fetch submissions:", err);
    }
  };

  const updateSubmissionStatus = async (
    submissionId: string,
    status: string
  ) => {
    try {
      if (
        selectedSubmission?.status === "interviewing" &&
        (status === "reviewed" || status === "rejected")
      ) {
        if (!selectedSubmission?.interview?.feedback?.trim()) {
          toast.error("Vui lòng nhập feedback trước khi cập nhật trạng thái.");
          return;
        }
      }
      if (
        selectedSubmission?.status === "reviewed" &&
        (status === "approved" || status === "rejected")
      ) {
        if (!selectedSubmission?.interview?.note?.trim()) {
          toast.error("Vui lòng nhập note trước khi cập nhật trạng thái.");
          return;
        }
      }
      const updateStatus = await authAxios.patch(
        `${coreAPI}/adoption-submissions/update-submission-status/${shelterId}`,
        { submissionId, status }
      );
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
  };

  const createInterviewSchedule = async () => {
    try {
      const res = await authAxios.post(
        `${coreAPI}/adoption-submissions/schedule-interview/${shelterId}`,
        {
          submissionId: selectedSubmission?._id,
          availableFrom: scheduleData.availableFrom,
          availableTo: scheduleData.availableTo,
          method: scheduleData.method,
          performedBy: scheduleData.performedBy,
        }
      );

      toast.success("Tạo lịch phỏng vấn thành công");
      setShowScheduleDialog(false);
      fetchSubmissions();
      setSelectedSubmission({
        ...selectedSubmission!,
        status: "interviewing",
      });
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi tạo lịch phỏng vấn");
    }
  };

  useEffect(() => {
    if (
      showScheduleDialog &&
      scheduleData.availableFrom &&
      scheduleData.availableTo
    ) {
      fetchInterviewers(scheduleData.availableFrom, scheduleData.availableTo);
    }
  }, [
    showScheduleDialog,
    scheduleData.availableFrom,
    scheduleData.availableTo,
  ]);

  const fetchInterviewers = async (from: Date, to: Date) => {
    try {
      const res = await authAxios.get(
        `${coreAPI}/adoption-submissions/staff-schedule-count/${shelterId}?from=${from.toISOString()}&to=${to.toISOString()}`
      );
      setInterviewers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách nhân viên:", err);
      toast.error("Không thể lấy danh sách nhân viên");
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      if (!selectedSubmission) {
        toast.error("Chưa chọn hồ sơ để gửi feedback");
        return;
      }

      const res = await authAxios.put(
        `${coreAPI}/adoption-submissions/interview-feedback/${shelterId}`,
        {
          submissionId: selectedSubmission?._id,
          feedback: feedback.trim(),
        }
      );
      fetchSubmissions();
      // Cập nhật lại submission sau khi gửi feedback
      const updated = {
        ...selectedSubmission,
        interview: {
          ...selectedSubmission?.interview,
          feedback: res.data.feedback,
          scheduleAt: res.data.scheduleAt,
        },
      };

      setSelectedSubmission((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          interview: {
            ...prev.interview,
            feedback: res.data.feedback,
            scheduleAt: res.data.scheduleAt,
          },
        };
      });

      setFeedback("");
      setIsEditingFeedback(false);
      toast.success(
        selectedSubmission.interview.feedback
          ? "Cập nhật nhận xét thành công!"
          : "Thêm nhận xét phỏng vấn thành công!"
      );
    } catch (err) {
      const error = err as any;
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleSubmitNote = async () => {
    try {
      if (!selectedSubmission) {
        toast.error("Chưa chọn hồ sơ để thêm ghi chú");
        return;
      }

      const res = await authAxios.put(
        `${coreAPI}/adoption-submissions/interview-note/${shelterId}`,
        {
          submissionId: selectedSubmission?._id,
          note: note.trim(),
        }
      );
      fetchSubmissions();
      // Cập nhật lại submission sau khi gửi feedback
      const updated = {
        ...selectedSubmission,
        interview: {
          ...selectedSubmission?.interview,
          note: res.data.note,
        },
      };
      setSelectedSubmission((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          interview: {
            ...prev.interview,
            note: res.data.note,
          },
        };
      });
      setNote("");
      setIsEditingNote(false);
      toast.success(
        selectedSubmission.interview.note
          ? "Cập nhật ghi chú thành công!"
          : "Thêm ghi chú phỏng vấn thành công!"
      );
    } catch (err) {
      const error = err as any;
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const uniquePerformers = Array.from(
    new Set(
      submissions
        .map((s) => s.interview?.performedBy)
        .filter((u) => u?._id)
        .map((u) => JSON.stringify(u))
    )
  ).map((u) => JSON.parse(u));

  const statusOptions = [
    "pending",
    "scheduling",
    "interviewing",
    "reviewed",
    "approved",
    "rejected",
  ];
  const statusLabels: Record<string, string> = {
    pending: "Chờ duyệt",
    scheduling: "Lên lịch phỏng vấn",
    interviewing: "Chờ phỏng vấn",
    reviewed: "Đã phỏng vấn",
    approved: "Đồng ý",
    rejected: "Từ chối",
  };

  const isManager = isShelterManager;
  const isStaff = shelters?.some((shelter) => {
    if (shelter._id !== shelterId) return false;
    return shelter.members?.some(
      (member: any) =>
        member._id === userProfile?._id &&
        (member.roles === "staff" ||
          (Array.isArray(member.roles) && member.roles.includes("staff")))
    );
  });

  const statusCounts = submissions
  .filter((sub) => {
    if (isManager) return true;
    if (isStaff) {
      if (["interviewing", "reviewed"].includes(sub.status)) {
        return sub.interview?.performedBy?._id === userProfile?._id;
      }
      return true;
    }
    return false;
  })
  .reduce<Record<string, number>>((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, {});


  const filteredSubmissions = submissions
    .filter((sub) => {
      if (sub.status !== statusFilter) return false;

      // Filter phụ khi status === 'interviewing'
      if (statusFilter === "interviewing") {
        if (
          interviewingSubFilter === "withSchedule" &&
          !sub.interview?.selectedSchedule
        )
          return false;
        if (
          interviewingSubFilter === "withoutSchedule" &&
          sub.interview?.selectedSchedule
        )
          return false;
      }

      // Các filter theo vai trò
      if (["pending", "scheduling","approved", "rejected"].includes(sub.status)) return true;

      if (isManager) {
        if (filterByPerformer !== "all") {
          return sub.interview?.performedBy?._id === filterByPerformer;
        }
        return true;
      }

      if (isStaff) {
        return sub.interview?.performedBy?._id === userProfile?._id;
      }

      return false;
    })
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Chờ duyệt",
      scheduling: "Lên lịch phỏng vấn",
      interviewing: "Chờ phỏng vấn",
      reviewed: "Đã phỏng vấn",
      approved: "Đồng ý",
      rejected: "Từ chối",
    };
    return statusMap[status] || status;
  };

  const statusOptionsMap: { [key: string]: string[] } = {
    pending: ["pending", "scheduling", "rejected"],
    scheduling: ["scheduling", "pending", "rejected"],
    interviewing: ["interviewing", "reviewed", "rejected"],
    reviewed: ["reviewed", "approved", "rejected"],
    rejected: ["rejected", "pending", "interviewing"],
  };

  const currentStatus = selectedSubmission?.status || "";
  const options = statusOptionsMap[currentStatus] || statusOptions;
  const onTrySubmitFeedback = () => {
    if (!selectedSubmission?.interview?.selectedSchedule) return;
    const selectedDate = dayjs(
      selectedSubmission.interview.selectedSchedule
    ).startOf("day");
    const today = dayjs().startOf("day");
    setIsEarlyFeedback(today.isBefore(selectedDate));
    setShowConfirmDialog(true);
  };

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
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`px-3 py-1 rounded-full border text-sm capitalize ${
                statusFilter === status
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabels[status]} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="px-3 py-1 rounded-full border text-sm bg-white dark:bg-gray-800 flex items-center gap-2 ">
              <Flag className="w-4 h-4" />Chú thích
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>
                Giải thích mức độ phù hợp của đơn yêu cầu
              </DialogTitle>
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

        {isManager && !["pending", "scheduling"].includes(statusFilter) && (
          <div className="flex items-center gap-2">
            <Label>Nhân viên thực hiện:</Label>
            <Popover open={openPerformer} onOpenChange={setOpenPerformer}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-[250px] justify-between"
                >
                  {filterByPerformer === "all"
                    ? "Tất cả nhân viên"
                    : uniquePerformers.find((p) => p._id === filterByPerformer)
                        ?.fullName || "Không rõ"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Tìm nhân viên..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setFilterByPerformer("all");
                        setOpenPerformer(false);
                      }}
                    >
                      Tất cả nhân viên
                      {filterByPerformer === "all" && (
                        <Check className="ml-auto h-4 w-4 text-green-500" />
                      )}
                    </CommandItem>
                    {uniquePerformers.map((p) => (
                      <CommandItem
                        key={p._id}
                        value={p.fullName.toLowerCase()}
                        onSelect={() => {
                          setFilterByPerformer(p._id);
                          setOpenPerformer(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={p.avatar || "/placeholder-avatar.png"}
                            alt={p.fullName}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="truncate">{p.fullName}</span>
                        </div>
                        {filterByPerformer === p._id && (
                          <Check className="ml-auto h-4 w-4 text-green-500" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {statusFilter === "interviewing" && (
          <div className="flex items-center gap-2">
            <Label>Lọc phỏng vấn:</Label>

            <Button
              variant={
                interviewingSubFilter === "withSchedule" ? "default" : "outline"
              }
              onClick={() => setInterviewingSubFilter("withSchedule")}
            >
              Đã có lịch
            </Button>
            <Button
              variant={
                interviewingSubFilter === "withoutSchedule"
                  ? "default"
                  : "outline"
              }
              onClick={() => setInterviewingSubFilter("withoutSchedule")}
            >
              Chờ xác nhận lại lịch
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubmissions.length === 0 ? (
          <p className="flex items-center justify-center text-muted-foreground text-sm col-span-full mt-10">
            Không có đơn
          </p>
        ) : (
          filteredSubmissions.map((submission) => {
            const total = submission.total ?? 0;
            const colorBar = getColorBarClass(total);
            return (
              <div
                key={submission._id}
                className="flex rounded-md shadow-sm overflow-hidden border"
              >
                <div className={`w-2 ${colorBar}`} />
                <div className="flex-1 bg-white">
                  <Card className="shadow-none border-none">
                    <CardHeader>
                      <CardTitle className="text-base">
                        <div className="flex items-center justify-between">
                          <div>
                            Người đăng ký nhận nuôi:{" "}
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
                        Nộp lúc:{" "}
                        {format(
                          new Date(submission.createdAt),
                          "HH:mm dd/MM/yyyy"
                        )}
                      </p>
                      <div>
                        <span className="font-medium">
                          {" "}
                          Nhân viên thực hiện:{" "}
                        </span>
                        <span className="text-primary font-medium">
                          {submission.interview?.performedBy?.fullName ||
                            "Chưa xác định"}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {submission.interview?.selectedSchedule ? (
                          <>
                            Ngày thực hiện:{" "}
                            {dayjs(
                              submission.interview.selectedSchedule
                            ).format("DD/MM/YYYY")}
                          </>
                        ) : submission.interview?.availableFrom &&
                          submission.interview?.availableTo ? (
                          <>
                            Thời gian dự kiến: từ{" "}
                            {dayjs(submission.interview.availableFrom).format(
                              "DD/MM/YYYY"
                            )}{" "}
                            đến{" "}
                            {dayjs(submission.interview.availableTo).format(
                              "DD/MM/YYYY"
                            )}
                          </>
                        ) : (
                          "Chưa có thời gian phỏng vấn"
                        )}
                      </p>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedSubmission(submission) }                   
                        className="text-sm underline text-primary ml-auto"
                      >
                        Xem chi tiết
                      </button>
                    
           
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem  asChild>
                              <CreateDialog submission= {submission}/>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })
        )}
        <Dialog
          open={!!selectedSubmission}
          onOpenChange={() => setSelectedSubmission(null)}
        >
          <DialogContent className="w-full !max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-center w-full ">
                Chi tiết đơn đăng ký
              </DialogTitle>
            </DialogHeader>
            <Separator />
            {selectedSubmission && (
              <div className="flex gap-8 h-[calc(90vh-110px)] ">
                <div className="w-1/3 space-y-2">
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src={
                        selectedSubmission.performedBy?.avatar ||
                        "/placeholder.svg"
                      }
                      alt="Avatar"
                      className="w-35 h-35 rounded-full border-1 border-gray-100 shadow-md object-cover object-center "
                    />
                  </div>
                  <p>
                    <strong>Người yêu cầu:</strong>{" "}
                    {selectedSubmission.performedBy?.fullName || "Ẩn danh"}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong>{" "}
                    {selectedSubmission.performedBy?.dob
                      ? dayjs(selectedSubmission.performedBy?.dob).format(
                          "DD/MM/YYYY"
                        )
                      : "Chưa có thông tin"}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {selectedSubmission.performedBy?.phoneNumber || "Không có"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedSubmission.performedBy?.email || "Không có"}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedSubmission.performedBy?.address || "Không có"}
                  </p>
                  <div className="pt-2">
                    <Button
                      className="w-full bg-primary text-white hover:bg-primary/90 transition rounded-md text-sm flex items-center justify-center gap-1"
                      onClick={() =>
                        navigate(
                          `/profile/${selectedSubmission.performedBy?._id}`
                        )
                      }
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
                      <span>
                        Tài khoản bị cảnh báo do vi phạm quy định về nhận nuôi
                        thú cưng – mức cảnh báo nhẹ.
                      </span>
                    </div>
                  )}

                  {selectedSubmission?.performedBy?.warningCount === 2 && (
                    <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-2 rounded flex items-center gap-2 text-sm">
                      <span className="text-xl">🚫</span>
                      <span>
                        Tài khoản bị cảnh báo do vi phạm nhiều lần quy định về
                        nhận nuôi thú cưng – mức cảnh báo cao.
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <strong>Trạng thái: </strong>
                    <AlertDialog
                      open={!!pendingStatus}
                      onOpenChange={(open) => !open && setPendingStatus(null)}
                    >
                      {currentStatus === "approved" ||
                      (currentStatus === "reviewed" && !isShelterManager) ? (
                        <Badge
                          className={`text-sm px-2 py-1 font-medium text-foreground rounded ${
                            currentStatus === "approved"
                              ? "bg-green-400"
                              : "bg-primary"
                          }`}
                        >
                          {statusLabels[currentStatus]}
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
                      <AlertDialog
                        open={!!pendingStatus}
                        onOpenChange={(open) => !open && setPendingStatus(null)}
                      >
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
                                  const updatedStatus =
                                    await updateSubmissionStatus(
                                      selectedSubmission._id,
                                      pendingStatus
                                    );
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

                    {selectedSubmission?.status === "scheduling" &&
                      isShelterManager && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="ml-2 bg-primary dark:bg-primary text-white hover:bg-primary/90 transition rounded-md text-sm flex items-center justify-center gap-1  "
                          onClick={() => setShowScheduleDialog(true)}
                        >
                          <CalendarCheck2 />
                          Tạo lịch phỏng vấn
                        </Button>
                      )}

                    <Dialog
                      open={showScheduleDialog}
                      onOpenChange={setShowScheduleDialog}
                    >
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Tạo lịch phỏng vấn</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <DateTimePicker
                              label={
                                <span>
                                  Thời gian bắt đầu{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                              }
                              date={scheduleData.availableFrom}
                              onChange={(d) =>
                                setScheduleData({
                                  ...scheduleData,
                                  availableFrom: startOfDay(d),
                                })
                              }
                              minDate={new Date()}
                            />

                            <DateTimePicker
                              label={
                                <span>
                                  Thời gian kết thúc{" "}
                                  <span className="text-red-500">*</span>
                                </span>
                              }
                              date={scheduleData.availableTo}
                              onChange={(d) =>
                                setScheduleData({
                                  ...scheduleData,
                                  availableTo: startOfDay(d),
                                })
                              }
                              minDate={new Date()}
                            />
                          </div>
                          <div className="w-full">
                            <label>
                              <span className="text-sm font-medium mb-1 block">
                                Chọn người thực hiện{" "}
                                <span className="text-red-500">*</span>
                              </span>
                            </label>
                            <p className="text-sm text-muted-foreground italic mb-2">
                              Danh sách được sắp xếp theo số lịch phỏng vấn (ít
                              → nhiều)
                            </p>

                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-full justify-between"
                                >
                                  {selectedStaff ? (
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={
                                          selectedStaff.avatar ||
                                          "/placeholder-avatar.png"
                                        }
                                        alt=""
                                        className="w-5 h-5 rounded-full"
                                      />
                                      <span>
                                        {selectedStaff.fullName} (
                                        {selectedStaff.interviewCount} lịch)
                                      </span>
                                    </div>
                                  ) : (
                                    "Chọn nhân viên thực hiện phỏng vấn"
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-full p-0 left-0 "
                                side="bottom"
                                align="start"
                              >
                                <Command>
                                  <CommandInput placeholder="Tìm nhân viên..." />
                                  <CommandList>
                                    {interviewers.map((staff) => (
                                      <CommandItem
                                        key={staff.staffId}
                                        value={staff.fullName.toLowerCase()}
                                        onSelect={() => {
                                          if (
                                            selectedStaff?.staffId ===
                                            staff.staffId
                                          ) {
                                            // Nếu đang chọn staff này → bỏ chọn
                                            setSelectedStaff(null);
                                            setScheduleData({
                                              ...scheduleData,
                                              performedBy: "",
                                            });
                                          } else {
                                            // Chọn staff mới
                                            setSelectedStaff(staff);
                                            setScheduleData({
                                              ...scheduleData,
                                              performedBy: staff.staffId,
                                            });
                                          }
                                          setOpen(false);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <img
                                            src={
                                              staff.avatar ||
                                              "/placeholder-avatar.png"
                                            }
                                            alt=""
                                            className="w-5 h-5 rounded-full"
                                          />
                                          <span className="truncate">
                                            {staff.fullName} (
                                            {staff.interviewCount} lịch)
                                          </span>
                                        </div>
                                        {selectedStaff?.staffId ===
                                          staff.staffId && (
                                          <Check className="ml-auto h-4 w-4 text-green-500" />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <label className="text-sm font-medium">
                              Hình thức phỏng vấn{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                              placeholder="Nhập hình thức: Trực tiếp / Google Meet / Zoom..."
                              value={scheduleData.method}
                              onChange={(e) =>
                                setScheduleData({
                                  ...scheduleData,
                                  method: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={createInterviewSchedule}
                              disabled={
                                !scheduleData.availableFrom ||
                                !scheduleData.availableTo ||
                                !scheduleData.method ||
                                !scheduleData.performedBy
                              }
                            >
                              Xác nhận tạo lịch
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex items-center gap-2">
                    <p>
                      <strong>Mức độ phù hợp:</strong>
                    </p>
                    <Badge
                      className={getColorBarClass(selectedSubmission.total)}
                    >
                      {selectedSubmission.total}%
                    </Badge>
                  </div>

                  <p>
                    <strong>Thời gian gửi yêu cầu:</strong>{" "}
                    {format(
                      new Date(selectedSubmission.createdAt),
                      "HH:mm dd/MM/yyyy"
                    )}
                  </p>
                  <p>
                    <strong>Số lượng thú cưng nhận nuôi trong 1 tháng:</strong>{" "}
                    {selectedSubmission?.adoptionsLastMonth || "Không có"}{" "}
                  </p>
                  <div className="flex gap-2 border-b mb-4">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        selectedTab === "answers"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setSelectedTab("answers")}
                    >
                      Câu trả lời
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        selectedTab === "interview"
                          ? "border-b-2 border-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => setSelectedTab("interview")}
                    >
                      Thông tin phỏng vấn
                    </button>
                  </div>

                  {/* Thêm các trường khác nếu có */}
                  {selectedTab === "answers" && selectedSubmission.answers && (
                    <div className="space-y-4 pt-4">
                      {selectedSubmission.answers.map((ans, i) => {
                        const question = ans.questionId;
                        const selections = ans.selections;

                        return (
                          <div
                            key={i}
                            className="rounded-lg border bg-muted/40 p-4 space-y-2"
                          >
                            <p className="font-medium text-sm text-foreground">
                              {question.title}
                            </p>

                            {/* === TYPE HANDLING === */}
                            {question.type === "TEXT" && (
                              <p className="text-sm text-muted-foreground">
                                {selections[0] || "Không có câu trả lời"}
                              </p>
                            )}

                            {(question.type === "SINGLECHOICE" ||
                              question.type === "MULTIPLECHOICE" ||
                              question.type === "YESNO") && (
                              <div className="space-y-1 pl-2">
                                {question.options.map((option) => {
                                  const isSelected = selections.includes(
                                    option.title
                                  );

                                  return (
                                    <div
                                      key={option._id}
                                      className={`flex items-center gap-2 text-sm
                                      ${
                                        option.isTrue
                                          ? "text-green-600"
                                          : isSelected
                                          ? "text-red-600"
                                          : "text-muted-foreground"
                                      }
                                     
                                  `}
                                    >
                                      <div
                                        className={`${
                                          question.type === "MULTIPLECHOICE"
                                            ? "w-4 h-4 rounded-sm"
                                            : "w-4 h-4 rounded-full"
                                        }
                                        border
                                        ${
                                          isSelected
                                            ? option.isTrue
                                              ? "bg-green-500 border-green-500"
                                              : "bg-red-500 border-red-500"
                                            : "border-gray-400"
                                        }
                                  `}
                                      />
                                      <span>{option.title}</span>
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
                  {selectedTab === "interview" && (
                    <PetSubmissionInterviewSection
                      selectedSubmission={selectedSubmission}
                      userProfile={userProfile}
                      isShelterManager={isShelterManager}
                      feedback={feedback}
                      setFeedback={setFeedback}
                      note={note}
                      setNote={setNote}
                      isEditingFeedback={isEditingFeedback}
                      setIsEditingFeedback={setIsEditingFeedback}
                      isEditingNote={isEditingNote}
                      setIsEditingNote={setIsEditingNote}
                      showConfirmDialog={showConfirmDialog}
                      setShowConfirmDialog={setShowConfirmDialog}
                      isEarlyFeedback={isEarlyFeedback}
                      onTrySubmitFeedback={onTrySubmitFeedback}
                      handleSubmitFeedback={handleSubmitFeedback}
                      handleSubmitNote={handleSubmitNote}
                    />
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
