
import { useState, useEffect, useContext } from "react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { SimpleDateSelector } from './SimpleDateSelector';
import { AlertCircle, Calendar, Clock, MapPin, Phone, Video, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
dayjs.locale("vi");
import isBetween from "dayjs/plugin/isBetween";
import { toast } from 'sonner';
dayjs.extend(isBetween);
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

interface Step4Props {
  submissionId: string | null;
  onNext: () => void;
  onBack: () => void;
  onLoadedSubmission?: (submission: any) => void;
}

const Step4_ScheduleConfirm = ({ onNext, onBack, onLoadedSubmission, submissionId }: Step4Props) => {
  const [submission, setSubmission] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const authAxios = useAuthAxios();
  const { coreAPI } = useContext(AppContext);
  const formattedSchedule = dayjs(selectedTime)
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DDTHH:mm:ssZ");
  const isScheduleConfirmed = !!submission?.interview?.selectedSchedule;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  useEffect(() => {
    if (!submissionId) return;
    const fetchSubmission = async () => {
      try {
        const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
        setSubmission(res.data);
        setSelectedTime(res.data.interview?.selectedSchedule || null);
        onLoadedSubmission?.(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn nhận nuôi", error);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  const handleConfirmSchedule = async () => {
    if (!submissionId || !selectedTime) return;

    try {
      await authAxios.put(
        `${coreAPI}/adoption-submissions/select-schedule`,
        {
          submissionId,
          selectedSchedule: formattedSchedule,
        }
      );

      const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
      setSubmission(res.data);
      onLoadedSubmission?.(res.data);
      toast.success("Đã xác nhận lịch phỏng vấn!");
    } catch (error) {
      console.error("Lỗi khi xác nhận lịch:", error);
      toast.error("Có lỗi xảy ra khi xác nhận lịch.");
    }
  };



  const isValidDateInRange = (date: Date | null) => {
    if (!date) return false;
    const from = new Date(submission.interview.availableFrom);
    const to = new Date(submission.interview.availableTo);
    return dayjs(date).isBetween(from, to, 'day', '[]');
  };

  if (!submission?.interview) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
      
        <p className="text-lg text-gray-600">Chưa có lịch phỏng vấn được tạo.</p>
      </div>
    );
  }

  const deadline = new Date(submission.interview.availableTo);
  deadline.setDate(deadline.getDate());


  return (
    <div className="max-w-6xl mx-auto space-y-8 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Hãy xác nhân lịch phỏng vấn!</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chúng tôi rất vui khi bạn quan tâm đến việc nhận nuôi. Hãy chọn thời gian phù hợp để chúng ta có thể trò chuyện.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img
                    src={submission.performedBy?.avatar || "/placeholder.svg?height=80&width=80"}
                    alt={submission?.performedBy?.fullName}
                    className="w-20 h-20 rounded-full object-cover border-1 border-white shadow-lg"
                  />

                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Xin chào, {submission?.performedBy?.fullName}! </h3>
                  <p className="text-gray-600">
                    Bạn đang nhận nuôi{" "}
                    <span className="font-semibold text-blue-600">bé {submission?.adoptionForm?.pet?.name}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">

                  <span className="font-medium text-gray-800">Trung tâm {submission?.adoptionForm?.shelter?.name}</span>
                </div>
                <p className="text-sm">Địa chỉ: {submission?.adoptionForm?.shelter?.address}</p>
                <p className="text-sm">Hotline: {submission?.adoptionForm?.shelter?.hotline}</p>
                <p className="text-sm">Email: {submission?.adoptionForm?.shelter?.email}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Chi tiết phỏng vấn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  {isScheduleConfirmed ? (
                    <div>
                      <p className="font-medium text-gray-800">Thời gian phỏng vấn</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Ngày:</strong> {dayjs(submission.interview?.selectedSchedule).format(" DD/MM/YYYY")}
                      </p>
                    </div>

                  ) : (
                    <div>
                      <p className="font-medium text-gray-800">Thời gian có thể phỏng vấn</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Từ:</strong> {dayjs(submission.interview.availableFrom).format(" DD/MM/YYYY")}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Đến:</strong> {dayjs(submission.interview.availableTo).format(" DD/MM/YYYY")}
                      </p>
                    </div>
                  )}

                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  {submission.interview.method.includes("trực tiếp") ? (
                    <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : submission.interview.method.includes("video") ? (
                    <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                  ) : (
                    <Phone className="w-5 h-5 text-orange-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">Hình thức phỏng vấn</p>
                    <p className="text-sm text-gray-600 mt-1">{submission.interview.method}</p>
                  </div>
                </div>

                {isScheduleConfirmed ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                    <CardContent className="pl-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">💡</span>
                        </div>
                        <h3 className="font-semibold text-gray-800">Lời khuyên cho buổi phỏng vấn</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          Chuẩn bị sẵn các câu hỏi về thú cưng
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          Mang theo giấy tờ tùy thân (nếu phỏng vấn trực tiếp)
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          Đến đúng giờ hoặc sớm 5-10 phút
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          Thể hiện sự chân thành và yêu thương động vật
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Hạn chót chọn lịch</p>
                      <p className="text-sm text-red-600 mt-1">
                        {dayjs(deadline).format("[Trước ngày] DD/MM/YYYY")}
                      </p>
                      <p className="text-xs text-red-500 mt-2">
                        Nếu không chọn lịch đúng hạn, đơn của bạn có thể bị hủy
                      </p>
                    </div>
                  </div>
                )}


              </div>
            </CardContent>
          </Card>

        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800">Chọn thời gian phù hợp với bạn</CardTitle>
              <p className="text-sm text-gray-600">Vui lòng chọn ngày và giờ bạn muốn tham gia phỏng vấn</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <SimpleDateSelector
                value={selectedTime}
                onChange={isScheduleConfirmed ? () => { } : setSelectedTime}
                minDate={new Date(submission.interview.availableFrom)}
                maxDate={new Date(submission.interview.availableTo)}
              />


              {selectedTime && (
                <div className="mt-6 w-full max-w-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Thời gian đã chọn</span>
                    </div>
                    <p className="text-green-700 font-medium">
                      {dayjs(selectedTime).format("dddd, DD/MM/YYYY ")}
                    </p>
                  </div>
                </div>
              )}

              {isScheduleConfirmed ? (
                <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600  text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform ">
                  <CheckCircle2 className="inline w-5 h-5 mr-2" />
                  Bạn đã xác nhận lịch phỏng vấn
                </div>) : (
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="lg"
                      className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                      disabled={!isValidDateInRange(selectedTime) || isScheduleConfirmed}
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Xác nhận lịch phỏng vấn
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn sẽ không thể thay đổi lại thời gian phỏng vấn sau khi xác nhận.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={handleConfirmSchedule}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              )}

            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="px-6 py-2 border-2 hover:bg-gray-50 bg-transparent">
          ← Quay lại
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValidDateInRange(selectedTime)}
          className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
        >
          Tiếp tục →
        </Button>
      </div>
    </div>
  );
};

export default Step4_ScheduleConfirm;
