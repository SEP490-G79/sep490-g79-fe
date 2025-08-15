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
import type { MissionForm } from '@/types/MissionForm';
import type { ConsentForm } from "@/types/ConsentForm";


interface Step6Props {
  onNext: () => void;
  onBack: () => void;
submission: MissionForm | undefined;
consentForm: ConsentForm | undefined | null;
}

const Step6_Result = ({  onBack, submission , consentForm }: Step6Props) => {
  const statusList: Record<string, string> = {
    pending: "Đang chờ xét duyệt",
    scheduling: "Đang lên lịch phỏng vấn",
    interviewing: "Đang chờ phỏng vấn",
    approved: "Đã được chấp nhận",
    rejected: "Bị từ chối",
    reviewed: "Đã phỏng vấn",
    cancelled: "Đã huỷ",
  };


  if (!submission) {
    return <div className="text-center mt-10">Đang tải thông tin đơn nhận nuôi...</div>;
  }
  const isNegative =
  submission.status === "rejected" ||
  consentForm?.status === "rejected" ||
  consentForm?.status === "cancelled";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      <Card className="max-w-3xl mx-auto shadow-lg dark:border-primary">
        <CardHeader className="flex items-center gap-3">
  {isNegative ? (
    <>
      <FileText className="text-red-500 w-6 h-6" />
      <CardTitle className="text-xl font-semibold text-red-600">
        {consentForm?.status === "cancelled"
          ? "Bạn đã hủy yêu cầu nhận nuôi."
          : "Rất tiếc, đơn đăng ký nhận nuôi của bạn đã bị từ chối."}
      </CardTitle>
    </>
  ) : (
    <>
      <CheckCircle className="text-green-500 w-6 h-6" />
      <CardTitle className="text-xl font-semibold text-green-700">
        Đăng kí nhận nuôi thành công!
      </CardTitle>
    </>
  )}
</CardHeader>


        <Separator />

        <CardContent className="space-y-4">
  {(() => {
  if (consentForm?.status === "approved") {
    return (
      <div className="bg-green-50 p-4 rounded-md text-green-700 border border-green-300 text-sm">
        Chúc mừng! Bạn đã hoàn tất quy trình nhận nuôi bé <strong>{submission.adoptionForm?.pet?.name}</strong>.{" "}
        <br />
        Trung tâm <strong>{submission.adoptionForm?.shelter?.name}</strong> rất cảm kích tấm lòng của bạn. Hy vọng bé sẽ có một mái ấm đầy yêu thương bên bạn.
        <br />
        Cảm ơn bạn vì đã đồng hành cùng chương trình nhận nuôi!
      </div>
    );
  } else if (consentForm?.status === "cancelled") {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 border border-red-300 text-sm">
        Sau khi xem xét kỹ lưỡng và không đạt được sự thống nhất về nội dung cam kết, chúng tôi rất tiếc phải thông báo rằng việc nhận nuôi bé{" "}
        <strong>{submission.adoptionForm?.pet?.name}</strong> đã không thể thực hiện.
        <br />
        Cảm ơn bạn đã quan tâm, và hy vọng bạn sẽ tiếp tục lan tỏa yêu thương tới các bé thú cưng khác trong tương lai.
      </div>
    );
  } else if (!consentForm && submission.status === "rejected") {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 border border-red-300 text-sm">
        Sau khi xem xét kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng việc đăng ký nhận nuôi bé{" "}
        <strong>{submission.adoptionForm?.pet?.name}</strong> đã được{" "}
        <strong>{submission.adoptionForm?.shelter?.name}</strong> ưu tiên cho một hồ sơ khác.
        <br />
        Cảm ơn bạn đã quan tâm và mong rằng bạn sẽ tiếp tục đồng hành, yêu thương và lan tỏa tình yêu thương tới các bé thú cưng khác trong tương lai.
      </div>
    );
  } else {
    return null;
  }
})()}


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
    {statusList[consentForm?.status || submission.status] || "Không xác định"}
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

export default Step6_Result;
