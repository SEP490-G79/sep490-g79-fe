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
import { CheckCircle, FileText } from 'lucide-react';


interface Step3Props {
  submissionId: string | null;
  onNext: () => void;
  onBack: () => void;
  onLoadedSubmission?: (submission: any) => void;
  submission?: any;  
}

const Step3_SubmissionForm = ({ submissionId, onNext, onBack, onLoadedSubmission, submission }: Step3Props) => {
  // const [submission, setSubmission] = useState<any>(null);
  const authAxios = useAuthAxios();
  const { coreAPI } = useContext(AppContext);

  useEffect(() => {
    if (submission || !submissionId) return;
    (async () => {
      const res = await authAxios.get(`${coreAPI}/adoption-submissions/${submissionId}`);
      onLoadedSubmission?.(res.data); 
    })().catch(console.error);
  }, [submissionId, submission]);


  const statusList: Record<string, string> = {
    pending: "Đang chờ xét duyệt",
    scheduling: "Đang lên lịch phỏng vấn",
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

      <Card className="max-w-3xl mx-auto shadow-lg dark:border-primary">
          <CardHeader className="flex items-center gap-3">
          {submission.status === "rejected" ? (
            <>
              <FileText className="text-red-500 w-6 h-6" />
              <CardTitle className="text-xl font-semibold text-red-600">
                Rất tiếc, đơn đăng ký nhận nuôi của bạn đã bị từ chối.
              </CardTitle>
            </>
          ) : (
            <>
              <CheckCircle className="text-green-500 w-6 h-6" />
              <CardTitle className="text-xl font-semibold text-green-700">
                Đơn đăng ký nhận nuôi đã được gửi thành công!
              </CardTitle>
            </>
          )}
        </CardHeader>


        <Separator />

        <CardContent className="space-y-4">
  {submission.status === "rejected" && (
       <div className="bg-red-50 p-4 rounded-md text-red-700 border border-red-300 text-sm">
      Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng việc đăng ký nhận nuôi bé{" "}
      <strong>{submission.adoptionForm?.pet?.name}</strong> đã được{" "}
      <strong>{submission.adoptionForm?.shelter?.name}</strong> ưu tiên cho một hồ sơ khác.
      <br />
      Cảm ơn bạn đã quan tâm và mong rằng bạn sẽ tiếp tục đồng hành, yêu thương và lan tỏa tình yêu
      thương tới các bé thú cưng khác trong tương lai.
    </div>
  )}
          {submission.status !== "approved" && submission.status !== "rejected" && (
            <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 border border-yellow-300 text-sm">
              Đơn đăng ký nhận nuôi bé <strong>{submission.adoptionForm?.pet?.name}</strong> hiện đang được{" "}
              <strong>{submission.adoptionForm?.shelter?.name}</strong> xem xét.
              <br />
              Nhân viên của trung tâm sẽ chủ động liên hệ qua số điện thoại hoặc email nếu hồ sơ đạt yêu cầu.
              Vui lòng kiên nhẫn chờ đợi phản hồi trong thời gian sớm nhất.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Ngày gửi:</strong> {dayjs(submission.createdAt).format('DD/MM/YYYY')}
              </p>
              {(submission.status === "approved" || submission.status === "rejected") && (
                <p className="md:col-span-2">
                  <strong>Ngày nhận phản hồi:</strong>{" "}
                  {dayjs(submission.updatedAt).format('DD/MM/YYYY [lúc] HH:mm')}
                </p>
              )}
            </div>

            <p>
              <strong>Trạng thái:</strong>{" "}
              <Badge className="capitalize bg-primary text-sm">
                {statusList[submission.status] || "Không xác định"}
              </Badge>
            </p>
          </div>
        </CardContent>


        <CardFooter className="flex justify-start">

          <p
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-primary mt-4 underline cursor-pointer hover:text-foreground"
          >
            <FileText />
            Bạn có thể xem lại đơn đăng ký của bạn
          </p>


        </CardFooter>
      </Card>

    </div>
  );
};

export default Step3_SubmissionForm;
