import { Badge } from "@/components/ui/badge";
import AppContext from "@/context/AppContext";
import type { ConsentForm } from "@/types/ConsentForm";
import useAuthAxios from "@/utils/authAxios";
import {
  ArrowRightLeft,
  CheckSquare,
  MessageCircleX,
  NotebookText,
  NotepadTextDashed,
  Paperclip,
  Send,
  Signature,
  SquareX,
} from "lucide-react";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { mockDeliveryMethods, mockStatus } from "@/types/ConsentForm";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { MissionForm } from "@/types/MissionForm";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  submission: MissionForm | undefined;
  onLoadedConsentForm?: (form: ConsentForm) => void;
}
const Step5_ConsentForm = ({ submission, onLoadedConsentForm }: Step4Props) => {
  const { coreAPI } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const [isLoading, setIsLoading] = React.useState(false);
  const [consentForm, setConsentForm] = React.useState<ConsentForm>();
  const [isAgreed, setIsAgreed] = React.useState(false);
  const [userNote, setUserNote] = React.useState("");

  const navigate = useNavigate();
  const fetchConsentForm = async () => {
    setIsLoading(true);
    await authAxios
      .get(`${coreAPI}/consentForms/get-by-user`)
      .then((res) => {
        const consentForm = res?.data?.find(
          (c: ConsentForm) => c?.pet?._id == submission?.adoptionForm?.pet?._id
        );
        // console.log(submission);

        setConsentForm(consentForm);
        onLoadedConsentForm?.(consentForm);
        // const attachments = data.attachments.map((attachment: any) => {
        //   return new File([attachment], attachment.fileName, {
        //     type: attachment.mimeType,
        //   });
        // });
        // console.log(attachments);

        // setFiles(attachments);
      })
      .catch((err) => {
        // console.error("Error fetching consent forms:", err);
        toast.error(
          err.response?.data?.message ||
            "Không thể tải bản đồng ý nhận nuôi! Vui lòng thử lại sau."
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };

  useEffect(() => {
    if (submission) {
      fetchConsentForm();
    }
  }, [submission]);

  const handleChangeStatus = async (status: string, note: string) => {
    // console.log(status);
    setIsLoading(true);
    await authAxios
      .put(`${coreAPI}/consentForms/${consentForm?._id}/change-status-user`, {
        status: status,
        note: userNote,
      })
      .then((res) => {
        setConsentForm(res.data);

        toast.success("Cập nhật trạng thái thành công!");
      })
      .catch((err) => {
        // console.log("Consent form error:"+err);
        toast.error(
          err.response?.data?.message || "Lỗi khi chuyển đổi trạng thái!"
        );
      })
      .finally(() => {
        setUserNote("");
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };

  const mockStatus = [
    {
      value: "draft",
      label: "Đang chuẩn bị",
      color: "secondary",
      icon: <NotepadTextDashed size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "send",
      label: "Chờ chấp nhận",
      color: "chart-3",
      icon: <Send size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "accepted",
      label: "Bạn đã chấp nhận",
      color: "chart-2",
      icon: <CheckSquare size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "approved",
      label: "Nhận nuôi thành công",
      color: "chart-4",
      icon: <Signature size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "rejected",
      label: "Yêu cầu sửa",
      color: "chart-1",
      icon: <MessageCircleX size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "destructive",
      icon: <SquareX size={"15px"} strokeWidth={"2px"} />,
    },
  ];

  if (!consentForm || (consentForm && consentForm?.status == "draft")) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        {submission?.status === "rejected" ? (
          <Card className="max-w-2xl w-full p-6 space-y-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-destructive">
                Rất tiếc! Hồ sơ của bạn đã bị từ chối
              </CardTitle>
              <CardDescription>
                Trạm cứu hộ đã xem xét và quyết định không tiếp tục quy trình
                nhận nuôi với hồ sơ này.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Cảm ơn bạn đã quan tâm đến việc nhận nuôi thú cưng. Dưới đây là
                một số lý do phổ biến có thể dẫn đến việc từ chối hồ sơ:
              </p>
              <ul className="list-disc list-inside">
                <li>Không phù hợp về điều kiện chăm sóc thú cưng.</li>
                <li>Thiếu thông tin cần thiết hoặc thông tin chưa rõ ràng.</li>
                <li>
                  Trạm nhận thấy chưa đủ cơ sở để đảm bảo an toàn cho thú cưng.
                </li>
              </ul>
              <p>
                Cảm ơn bạn đã quan tâm và mong rằng bạn sẽ tiếp tục đồng hành,
                yêu thương và lan tỏa tình yêu thương tới các bé thú cưng khác
                trong tương lai.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl w-full p-6 space-y-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">
                Bạn đã được chọn là người nhận nuôi!
              </CardTitle>
              <CardDescription>
                Hãy chờ trạm cứu hộ hoàn tất và gửi bản đồng ý nhận nuôi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Vui lòng đọc kỹ các cam kết khi nhận nuôi thú cưng. Nếu có điểm
                nào không phù hợp, bạn có thể yêu cầu sửa đổi, đồng ý với nội
                dung hoặc hủy nhận nuôi trước khi trạm xác nhận chính thức.
              </p>
              <ul className="list-disc list-inside">
                <li>Chờ bản đồng ý từ trạm cứu hộ.</li>
                <li>Xem xét kỹ các cam kết.</li>
                <li>
                  Sau khi nhận bản, bạn có thể chọn <b>chấp nhận</b>,{" "}
                  <b>yêu cầu sửa</b>, hoặc <b>hủy nhận nuôi</b>.
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex gap-5 justify-between flex-wrap bg-muted/50 p-5">
        {/* Header */}
        <div className="basis-full flex gap-3 items-center">
          <Skeleton className="h-6 w-24 rounded-3xl" /> {/* Badge */}
          <Skeleton className="h-6 w-48" /> {/* Title */}
        </div>

        {/* Left column - Adopter */}
        <div className="basis-full sm:basis-5/11 p-3 space-y-4">
          <div className="flex gap-3 items-center">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-1 w-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        {/* Right column - Shelter */}
        <div className="basis-full sm:basis-5/11 p-3 space-y-4">
          <div className="flex gap-3 items-center">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-1 w-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>

        {/* Commitments */}
        <div className="basis-full p-5 space-y-3">
          <Skeleton className="h-4 w-1/3" /> {/* Tiêu đề "Cam kết" */}
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>

        {/* Notes */}
        <div className="flex flex-wrap gap-5 justify-between items-start basis-full p-5">
          <div className="basis-full">
            <Skeleton className="h-4 w-20" /> {/* Ghi chú */}
          </div>
          <Skeleton className="h-4 w-10/12 px-5" />
          <Skeleton className="h-4 w-5 px-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex gap-5 justify-between flex-wrap bg-(--card) p-5 shadow">
      <div className="basis-full flex gap-3 ">
        <Badge className={`rounded-3xl px-5 `} variant={"outline"}>
          <span className="flex gap-1">
            {
              mockStatus.find(
                (s) =>
                  s.value.toUpperCase() == consentForm?.status.toUpperCase()
              )?.icon
            }
            {
              mockStatus.find(
                (s) =>
                  s.value.toUpperCase() == consentForm?.status.toUpperCase()
              )?.label
            }
          </span>
        </Badge>

        <span className="text-2xl font-medium">{consentForm?.title}</span>
      </div>
      <div className="basis-full sm:basis-5/11   p-3">
        <div className="w-full flex flex-wrap justify-start items-start gap-3">
          <div className="basis-full flex justify-center">
            <p className="text-xl font-medium">Người nhận nuôi</p>
          </div>
          {/* <div className="basis-full lg:basis-1/7 ">
            <Avatar className="rounded-sm ring-2 ring-(--primary) w-12 h-12">
              <AvatarImage
                src={consentForm?.adopter?.avatar}
                className="object-center object-cover rounded-sm"
              />
              <AvatarFallback className="text-2xl font-medium rounded-sm">
                <span>
                  {consentForm?.adopter?.fullName?.slice(0, 1).toUpperCase()}
                </span>
              </AvatarFallback>
            </Avatar>
          </div> */}
          <div className="basis-full lg:basis-5/7 ">
            <p
              onClick={() => {
                navigate(`/profile/${consentForm?.adopter?._id}`);
              }}
              className="text-sm font-medium hover:text-(--primary) cursor-pointer line-clamp-1 "
            >
              {consentForm?.adopter?.fullName}
            </p>
            <p className="text-xs">
              <strong>Số điện thoại:</strong>{" "}
              {consentForm?.adopter?.phoneNumber}
            </p>
          </div>
        </div>
        <div className="my-2">
          <p className="text-xs my-2 line-clamp-1">
            <strong>Địa chỉ nhận:</strong> {consentForm?.address}
          </p>
          <p className="text-xs my-2 line-clamp-1">
            <strong>Phương thức vận chuyển:</strong>{" "}
            {
              mockDeliveryMethods.find(
                (method) => method?.value == consentForm?.deliveryMethod
              )?.label
            }
          </p>
        </div>
      </div>

      <div className="basis-full sm:basis-5/11  p-3">
        <div className="w-full flex flex-wrap justify-start items-start gap-3">
          <div className="basis-full flex justify-center">
            <p className="text-xl font-medium">Trung tâm cứu hộ</p>
          </div>
          {/* <div className="basis-full lg:basis-1/7 ">
            <Avatar className="rounded-sm ring-2 ring-(--primary) w-12 h-12">
              <AvatarImage
                src={consentForm?.adopter?.avatar}
                className="object-center object-cover rounded-sm"
              />
              <AvatarFallback className="text-2xl font-medium rounded-sm">
                <span>
                  {consentForm?.adopter?.fullName?.slice(0, 1).toUpperCase()}
                </span>
              </AvatarFallback>
            </Avatar>
          </div> */}
          <div className="basis-full lg:basis-5/7">
            <p
              onClick={() => {
                navigate(`/shelters/${consentForm?.shelter?._id}`);
              }}
              className="text-sm font-medium hover:text-(--primary) cursor-pointer line-clamp-1 "
            >
              {consentForm?.shelter?.name}
            </p>
            <p className="text-xs">
              <strong>Người tạo:</strong>{" "}
              <Link
                to={`/profile/${consentForm?.createdBy?._id}`}
                className="hover:text-(--primary)"
              >
                {consentForm?.createdBy?.fullName}
              </Link>
            </p>
          </div>
        </div>
        <div className="my-2">
          <p className="text-xs my-2 line-clamp-1">
            <strong>Tiền vía:</strong> {consentForm?.tokenMoney} (đồng)
          </p>
          <p className="text-xs my-2 line-clamp-1">
            <strong>Ngày tạo đơn:</strong>{" "}
            {consentForm?.createdAt &&
              dayjs(consentForm.createdAt).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>
      <Separator className="" />

      <div className="basis-full flex flex-wrap justify-between gap-1 text-sm p-5">
        <p className="basis-full lg:basis-11/23  flex items-center gap-2">
          <span>Tên người nhận nuôi: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.adopter?.fullName}
          </span>
        </p>
        <p className="basis-full lg:basis-11/23  flex items-center gap-2 ">
          <span>Số điện thoại: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.adopter?.phoneNumber}
          </span>
        </p>
        <p className="basis-full   flex items-center gap-2">
          <span>Địa chỉ: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.adopter?.address}
          </span>
        </p>
        <p className="basis-full lg:basis-11/23  flex items-center gap-2">
          <span>Ngày: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.createdAt &&
              dayjs(consentForm.createdAt).format("DD/MM/YYYY")}
          </span>
        </p>
        <p className="basis-full lg:basis-11/23   flex items-center gap-2">
          <span>Có nhận nuôi (tên thú cưng): </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.pet?.name} {" #"}
            <span className="italic text-xs">{consentForm?.pet?.petCode} </span>
          </span>
        </p>
        <p className="basis-full lg:basis-11/23  flex items-center gap-2">
          <span>Giới tính: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.pet?.isMale == true ? "Đực" : "Cái"}
          </span>
        </p>
        <p className="basis-full lg:basis-11/23   flex items-center gap-2">
          <span>Tình trạng triệt sản: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.pet?.sterilizationStatus == true
              ? "Đã triệt sản"
              : "Chưa triệt sản"}
          </span>
        </p>
        <p className="basis-full   flex items-center gap-2">
          <span>Đặc điểm nhận dạng: </span>
          <span

          // className=" flex-1 border-b border-dashed border-(--foreground)/80 min-h-[1.5rem]) line-camp-1"
          >
            {consentForm?.pet?.identificationFeature ||
              "Không có đặc điểm nhận dạng"}
          </span>
        </p>
        <p className="basis-full mt-2">
          <span>
            Để đáp ứng đầy đủ các điều kiện nhận nuôi, tôi/chúng tôi cam kết
            thực hiện đầy đủ các nội dung sau khi nhận nuôi thú cưng từ trạm cứu
            hộ:{" "}
          </span>
        </p>
        <div className="basis-full h-auto my-2">
          <MinimalTiptapEditor
            editorContentClassName="commitments"
            output="html"
            content={consentForm?.commitments}
            editable={false}
            hideToolbar={true}
            injectCSS
            editorClassName="focus:outline-none"
            className="border-none w-full h-full px-2"
          />
        </div>
        {/* <span>{consentForm?.commitments}</span> */}
      </div>
      {/* {consentForm?.note && (
        <div className=" flex flex-wrap gap-5 justify-between items-start basis-full px-5">
          <div className="basis-full">
            <p className="font-medium">Ghi chú:</p>
          </div>
          <span className="basis-9/11 italic text-sm px-2">
            {" "}
            {consentForm?.note}{" "}
          </span>
          <div className="basis-1/11 items-end px-2">
            <Paperclip
              className="text-(--secondary)"
              size={"15px"}
              strokeWidth={"1px"}
            />
          </div>
        </div>
      )} */}
      <Separator className="my-2" />
      <div className="basis-full flex items-start gap-3 px-5 mb-2">
        {consentForm?.status == "send" && (
          <>
            <Checkbox
              id="agree-terms"
              checked={isAgreed}
              onCheckedChange={(value) => setIsAgreed(!!value)}
            />
            <div className="grid gap-1 leading-tight">
              <Label htmlFor="agree-terms" className="font-medium text-sm">
                Tôi đồng ý với tất cả các điều kiện và cam kết trên.
              </Label>
              <p className="text-muted-foreground text-xs">
                Bằng việc đánh dấu vào ô này, bạn xác nhận rằng đã đọc, hiểu và
                chấp nhận toàn bộ nội dung cam kết nhận nuôi thú cưng từ trạm
                cứu hộ.
              </p>
            </div>
          </>
        )}
        {consentForm?.status == "accepted" && (
          <>
            <div className="grid gap-1 leading-tight">
              <Label htmlFor="agree-terms" className="font-medium text-sm">
                Cảm ơn bạn đã đồng ý nhận nuôi!
              </Label>
              <p className="text-muted-foreground text-xs w-1/2 ">
                Vui lòng chờ trung tâm xác nhận để hoàn tất thủ tục nhận nuôi
                trực tuyến. Sau khi được xác nhận, bạn có thể đến trực tiếp
                trung tâm để đón thú cưng hoặc lựa chọn hình thức giao tận nơi
                nếu đã đăng ký.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="basis-full flex justify-end gap-3">
        {consentForm?.status == "send" && (
          <>
            <Button
              variant={"default"}
              className="cursor-pointer bg-(--chart-4)"
              disabled={!isAgreed}
              onClick={() => {
                handleChangeStatus("accepted", "");
              }}
            >
              Chấp nhận
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"} className="cursor-pointer ">
                  Yêu cầu sửa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yêu cầu sửa chi tiết bản cam kết</DialogTitle>
                  <DialogDescription>
                    Hãy ghi lại những điều cần thay đổi trong bản cam kết này.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2 py-4">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Nhập ghi chú"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                  <Button
                    className="cursor-pointer"
                    disabled={userNote == ""}
                    onClick={() => {
                      handleChangeStatus("rejected", userNote);
                      setUserNote(""); // Reset sau khi gửi
                    }}
                  >
                    Gửi yêu cầu
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {consentForm?.status != "cancelled" &&
          consentForm?.status != "approved" && (
            <Button
              variant={"destructive"}
              className="cursor-pointer "
              onClick={() => {
                handleChangeStatus("cancelled", "");
              }}
            >
              Từ chối nhận nuôi
            </Button>
          )}
      </div>
    </div>
  );
};

export default Step5_ConsentForm;
