import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState, useContext } from 'react';
import useAuthAxios from '@/utils/authAxios';
import AppContext from '@/context/AppContext';
import dayjs from 'dayjs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';


interface Step3Props {
  submissionId: string | null;
  onNext: () => void;
  onBack: () => void;
   onLoadedSubmission?: (submission: any) => void;
}

const Step3_SubmissionForm = ({ submissionId, onNext, onBack, onLoadedSubmission }: Step3Props) => {
  const [submission, setSubmission] = useState<any>(null);
  const authAxios = useAuthAxios();
  const { coreAPI } = useContext(AppContext);

 useEffect(() => {
  if (!submissionId) return;

  const fetchSubmission = async () => {
    try {
      const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
      setSubmission(res.data);
      onLoadedSubmission?.(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn nhận nuôi", error);
    } 
  };

  fetchSubmission();
}, [submissionId]);


  const statusList: Record<string, string> = {
    pending: "Đang chờ xét duyệt",
    interviewing: "Đang chờ phỏng vấn",
    approved: "Đã được chấp nhận",
    rejected: "Bị từ chối",
    reviewed: "Đã phỏng vấn",
  };


  if (!submission) {
    return <div className="text-center mt-10">Đang tải thông tin đơn nhận nuôi...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">


      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Quay lại</Button>
        <Button onClick={onNext}>Tiếp tục</Button>
      </div>
      <Card className="max-w-3xl mx-auto shadow-lg dark:border-primary">
        <CardHeader className="flex items-center gap-3">
          <CheckCircle className="text-green-500 w-6 h-6" />
          <CardTitle className="text-xl font-semibold text-green-700">
            Đơn đăng ký nhận nuôi đã được gửi thành công!
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          <p className="text-sm">
            Cảm ơn bạn đã quan tâm và gửi đơn đăng ký nhận nuôi bé <strong>{submission?.adoptionForm?.pet?.name}</strong>.
            Trung tâm <strong>{submission.adoptionForm?.shelter?.name}</strong> sẽ xem xét hồ sơ và liên hệ với bạn nếu bạn đáp ứng đủ điều kiện nhận nuôi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Ngày gửi:</strong> {dayjs(submission.createdAt).format('DD/MM/YYYY')}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Badge className="capitalize bg-primary text-sm">
                {statusList[submission.status] || "Không xác định"}
              </Badge>
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 border border-yellow-300 text-sm">
            Đơn đăng ký của bạn đang được xem xét. Nhân viên của trung tâm sẽ chủ động liên hệ qua số điện thoại hoặc email nếu hồ sơ đạt yêu cầu.
            Vui lòng kiên nhẫn chờ đợi phản hồi trong thời gian sớm nhất.
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={onNext}>Tiếp tục</Button>
        </CardFooter>
      </Card>

    </div>
  );
};

export default Step3_SubmissionForm;
