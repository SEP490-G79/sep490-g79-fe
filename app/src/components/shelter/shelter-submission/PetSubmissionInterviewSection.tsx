"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Edit3,
  Send,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  FileText,
  CalendarCheck,
  UserCheck,
  X,
  Save,
  Video,
  MapPin,
  Phone,
} from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

interface InterviewSectionProps {
  selectedSubmission: any
  userProfile: any
  isShelterManager: boolean
  feedback: string
  setFeedback: (feedback: string) => void
  note: string
  setNote: (note: string) => void
  isEditingFeedback: boolean
  setIsEditingFeedback: (editing: boolean) => void
  isEditingNote: boolean
  setIsEditingNote: (editing: boolean) => void
  showConfirmDialog: boolean
  setShowConfirmDialog: (show: boolean) => void
  isEarlyFeedback: boolean
  onTrySubmitFeedback: () => void
  handleSubmitFeedback: () => Promise<void>
  handleSubmitNote: () => Promise<void>
}

const PetSubmissionInterviewSection = ({
  selectedSubmission,
  userProfile,
  isShelterManager,
  feedback,
  setFeedback,
  note,
  setNote,
  isEditingFeedback,
  setIsEditingFeedback,
  isEditingNote,
  setIsEditingNote,
  showConfirmDialog,
  setShowConfirmDialog,
  isEarlyFeedback,
  onTrySubmitFeedback,
  handleSubmitFeedback,
  handleSubmitNote,
}: InterviewSectionProps) => {
  const interview = selectedSubmission?.interview

  // Permission checks
  const canProvideFeedback =
    selectedSubmission.status === "interviewing" &&
    interview?.selectedSchedule &&
    interview?.performedBy?._id === userProfile?._id 

  const canProvideNote = selectedSubmission.status === "reviewed" && isShelterManager

  const canViewFeedback =
    interview?.selectedSchedule &&
    ((selectedSubmission.status === "interviewing" && interview?.performedBy?._id === userProfile?._id) ||
      (["reviewed", "approved", "rejected"].includes(selectedSubmission.status) &&
        (isShelterManager || interview?.performedBy?._id === userProfile?._id)))

  const canViewNote =
    (selectedSubmission.status === "reviewed" && isShelterManager) ||
    ((selectedSubmission.status === "approved" || selectedSubmission.status === "rejected") &&
      (isShelterManager || interview?.performedBy?._id === userProfile?._id))

  // Helper functions
  const getInterviewStatusBadge = () => {
    if (!interview) return null

    if (interview.selectedSchedule) {
      const hasFeedback = !!interview.feedback;
      const isUpcoming = dayjs(interview.selectedSchedule).isAfter(dayjs());

      return (
        <Badge variant={hasFeedback || !isUpcoming ? "secondary" : "default"} className="gap-1 dark:text-white dark:bg-gray-500">
          <CalendarCheck className="w-3 h-3" />
          {hasFeedback || !isUpcoming ? "Đã diễn ra" : "Sắp diễn ra"}
        </Badge>
      );
    }


    if (interview.availableFrom && interview.availableTo) {
      return (
        <Badge variant="outline" className="gap-1 dark:text-white dark:bg-gray-500">
          <Clock className="w-3 h-3" />
          Chờ chọn lịch
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="gap-1 bg-gray-400 dark:text-white dark:bg-gray-500">
        <AlertTriangle className="w-3 h-3" />
        Chưa có lịch
      </Badge>
    )
  }

  const getMethodIcon = (method: string) => {
    if (method?.toLowerCase().includes("trực tiếp")) {
      return <MapPin className="w-4 h-4 text-green-600" />
    }
    if (
      method?.toLowerCase().includes("video") ||
      method?.toLowerCase().includes("meet") ||
      method?.toLowerCase().includes("zoom")
    ) {
      return <Video className="w-4 h-4 text-blue-600" />
    }
    return <Phone className="w-4 h-4 text-orange-600" />
  }

  if (!interview) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2 dark:text-gray-300">Chưa có thông tin phỏng vấn</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Thông tin phỏng vấn sẽ xuất hiện khi có lịch hẹn được tạo</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Interview Overview */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800 ">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Thông tin phỏng vấn
            </CardTitle>
            {getInterviewStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Staff Assignment */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 ">
              <p className="font-medium text-gray-800 text-sm dark:text-white">Nhân viên thực hiện</p>
              {interview.performedBy ? (
                <div className="flex items-center gap-2 mt-1">
                  <img
                    src={interview.performedBy.avatar || "/placeholder-avatar.png"}
                    alt={interview.performedBy.fullName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{interview.performedBy.fullName}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">Chưa được phân công</span>
              )}
            </div>
          </div>

          {/* Interview Method */}
          {interview.method && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center ">
                {getMethodIcon(interview.method)}
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm dark:text-white">Hình thức phỏng vấn</p>
                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">{interview.method}</p>
              </div>
            </div>
          )}

          {/* Schedule Information */}
          <div className="grid gap-3">
            {!interview.selectedSchedule && interview.availableFrom && interview.availableTo && (
              <div className="p-3 bg-white rounded-lg border border-yellow-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-gray-800 text-sm dark:text-white" >Khung thời gian có thể phỏng vấn</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 dark:text-gray-400">
                  <p>
                    <strong>Từ:</strong> {dayjs(interview.availableFrom).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <strong>Đến:</strong> {dayjs(interview.availableTo).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            )}

            {interview.selectedSchedule && (
              <>
                <div className="p-3 bg-white rounded-lg border border-purple-200 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarCheck className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-800 text-sm dark:text-white">Ngày người nhận nuôi chỉ định</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                    {dayjs(interview.selectedSchedule).format("dddd, DD/MM/YYYY")}
                  </p>
                </div>

                {interview.scheduleAt && (
                  <div className="p-3 bg-white rounded-lg border border-green-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-800 text-sm dark:text-white">Ngày thực tế thực hiện</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-6">
                      {dayjs(interview.scheduleAt).format("dddd, DD/MM/YYYY [lúc] HH:mm")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Feedback Section */}
      {canViewFeedback && (
        <Card className="border-0 shadow-sm dark:bg-gray-800">
          <CardHeader >
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Phản hồi phỏng vấn
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interview.feedback && !isEditingFeedback ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 relative">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2 ">
                      <p className="font-medium text-green-800 text-sm">
                        Phản hồi từ {interview.performedBy?.fullName}
                      </p>
                      {canProvideFeedback && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="w-4 h-4 dark:text-black" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setFeedback(interview.feedback || "")
                                setIsEditingFeedback(true)
                              }}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Chỉnh sửa phản hồi
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{interview.feedback}</p>
                  </div>
                </div>
              </div>
            ) : canProvideFeedback ? (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 text-sm">
                      {isEditingFeedback ? "Chỉnh sửa phản hồi" : "Gửi phản hồi phỏng vấn"}
                    </span>
                  </div>
                  <Textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Nhập nội dung phản hồi về buổi phỏng vấn..."
                    className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-100 text-sm"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  {isEditingFeedback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingFeedback(false)
                        setFeedback("")
                      }}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={onTrySubmitFeedback}
                    disabled={feedback.trim() === ""}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    {isEditingFeedback ? "Cập nhật nhận xét" : "Gửi nhận xét"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Chưa có phản hồi phỏng vấn</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manager Note Section */}
      {(interview.note || canProvideNote) && canViewNote && (
        <Card className="border-0 shadow-sm dark:bg-gray-800">
          <CardHeader >
            <CardTitle className="flex items-center gap-2 text-lg ">
              <FileText className="w-5 h-5 text-orange-600" />
              Ghi chú quản lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interview.note && !isEditingNote ? (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200 relative">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-orange-800 text-sm">
                        Ghi chú từ {interview.reviewedBy?.fullName || "Quản lý"}
                      </p>
                      {canProvideNote && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ">
                              <MoreVertical className="w-4 h-4 dark:text-black" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setNote(interview.note || "")
                                setIsEditingNote(true)
                              }}
                            >
                              <Edit3 className="w-4 h-4 mr-2" />
                              Chỉnh sửa ghi chú
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{interview.note}</p>
                  </div>
                </div>
              </div>
            ) : canProvideNote ? (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Edit3 className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-800 text-sm">
                      {isEditingNote ? "Chỉnh sửa ghi chú" : "Thêm ghi chú phỏng vấn"}
                    </span>
                  </div>
                  <Textarea
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú về buổi phỏng vấn..."
                    className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-100 text-sm"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  {isEditingNote && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingNote(false)
                        setNote("")
                      }}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Hủy
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSubmitNote}
                    disabled={note.trim() === ""}
                    className="gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <Save className="w-4 h-4" />
                    {isEditingNote ? "Cập nhật ghi chú" : "Lưu ghi chú"}
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Xác nhận gửi phản hồi
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            {isEarlyFeedback ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 mb-1 text-sm">Cảnh báo: Feedback sớm</p>
                    <p className="text-sm text-yellow-700">
                      Bạn đang gửi nhận xét <strong>sớm hơn</strong> lịch phỏng vấn đã chọn (
                      {dayjs(selectedSubmission?.interview?.selectedSchedule).format("DD/MM/YYYY")}).
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">Vui lòng đảm bảo buổi phỏng vấn đã diễn ra.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1 text-sm">Xác nhận gửi phản hồi</p>
                    <p className="text-sm text-blue-700">
                      {isEditingFeedback
                        ? "Bạn chắc chắn muốn cập nhật phản hồi?"
                        : "Bạn chắc chắn muốn gửi phản hồi cuộc phỏng vấn?"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-sm font-medium text-gray-700 mb-1">Nội dung phản hồi:</p>
              <p className="text-sm text-gray-600 italic">"{feedback}"</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleSubmitFeedback()
                setShowConfirmDialog(false)
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isEditingFeedback ? "Cập nhật" : "Gửi feedback"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default PetSubmissionInterviewSection
