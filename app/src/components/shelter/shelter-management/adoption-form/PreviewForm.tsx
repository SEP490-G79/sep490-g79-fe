import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Separator } from "@/components/ui/separator";
import AppContext from "@/context/AppContext";
import type { AdoptionForm } from "@/types/AdoptionForm";
import type { Question } from "@/types/Question";
import useAuthAxios from "@/utils/authAxios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function PreviewForm() {
  const { shelterId, formId } = useParams<{
    shelterId: string;
    formId: string;
  }>();
  const { coreAPI, shelterForms, setShelterForms } = useContext(AppContext);
  const [adoptionForm, setAdoptionForm] = useState<AdoptionForm>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);

  const authAxios = useAuthAxios();

  useEffect(() => {
    handleFetchAdoptionForm();
  }, [coreAPI, shelterId, formId]);

  const handleFetchAdoptionForm = async () => {
    if (!shelterId || !formId) return;
    setIsLoading(true);
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionForms/get-by-shelter`)
      .then((res) => {
        const forms: AdoptionForm[] = res.data;
        setShelterForms(forms);
        const found = forms.find((t) => t._id === formId);
        if (found) {
          setAdoptionForm(found);
          setQuestionsList([...found.questions]);
        } else {
          toast.error("Không tìm thấy đơn nhận nuôi");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu đơn nhận nuôi");
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <div>
          <div className="space-y-6 pt-12 pb-5">
            <Card className="dark:border-primary">
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl font-semibold">
                  Đơn đăng ký nhận nuôi {adoptionForm?.pet?.name}
                </CardTitle>

                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-semibold">{adoptionForm?.shelter}</span>
                  {", "}
                  xin chân thành cảm ơn bạn đã quan tâm đến việc nhận nuôi các
                  bé chó/mèo ở sân. Trước khi điền vào biểu đơn đăng ký, bạn vui
                  lòng đọc kỹ các điều kiện nhận nuôi dưới đây. Nếu đồng ý, hãy
                  cung cấp đầy đủ thông tin theo biểu đơn. Những thông tin bạn
                  cung cấp sẽ giúp sân hiểu rõ hơn về nhu cầu và khả năng chăm
                  sóc thú cưng, từ đó hỗ trợ bạn tốt hơn trong quá trình nhận
                  nuôi.
                </p>

                <CardDescription className="flex items-start text-sm text-muted-foreground">
                  <span className="italic">
                    Lưu ý: Thông tin bạn cung cấp chỉ được sử dụng để hỗ trợ tìm
                    kiếm người phù hợp nhất với thú cưng và sẽ không được sử
                    dụng cho bất kỳ mục đích nào khác.
                  </span>
                </CardDescription>
                <CardDescription className="flex items-start text-sm text-muted-foreground">
                  <span className="italic">
                    Điều kiện nhận nuôi:
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="hover:underline">
                          Xem chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Điều kiện nhận nuôi</DialogTitle>
                          <DialogDescription>
                            Điều kiện nhận nuôi các bạn thú cưng tại:{" "}
                            <span className="underline">
                              {adoptionForm?.shelter}
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="w-full h-[30rem] overflow-x-auto">
                          <MinimalTiptapEditor
                            throttleDelay={2000}
                            editorContentClassName="description"
                            output="html"
                            content={adoptionForm?.description}
                            immediatelyRender={false}
                            editable={false}
                            hideToolbar={true}
                            injectCSS
                            editorClassName="focus:outline-none"
                            className="border-none w-full h-full px-5"
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </span>
                </CardDescription>
              </CardHeader>

              <Separator className="dark:bg-primary" />

              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <p className="text-sm">
                    <span className="font-semibold">Họ và tên:</span> Nguyễn Văn
                    A
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Email:</span>{" "}
                    nguyenvanA@gmail.com
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Nơi ở hiện tại:</span> Tổ
                    dân phố 1, Phường 2, Quận 3, TP.HCM ....
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Số điện thoại:</span>{" "}
                    0912345678
                  </p>
                </div>
              </CardContent>

              <Separator className="dark:bg-primary" />

              <CardFooter>
                <p className="text-sm text-red-500 italic">
                  * Biểu thị câu hỏi bắt buộc
                </p>
              </CardFooter>
            </Card>

            {questionsList.map((q) => (
              <Card key={q._id} className="space-y-2 dark:border-primary ">
                <CardHeader>
                  <CardTitle>
                    <p className="font-medium ">
                      {q.title}{" "}
                      {q.priority !== "none" && (
                        <span className="text-red-500">*</span>
                      )}
                    </p>
                  </CardTitle>
                  <CardDescription>
                    {q.type === "SINGLECHOICE" && (
                      <p className="text-sm text-gray-500 italic">
                        Chỉ chọn 1 đáp án
                      </p>
                    )}
                    {q.type === "MULTIPLECHOICE" && (
                      <p className="text-sm text-gray-500 italic">
                        Bạn có thể chọn nhiều đáp án
                      </p>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {q.options.map((opt: any, idx: Number) => {
                    let checked = false;

                    // if (q.type === "SINGLECHOICE") {
                    //   checked = answers[q._id] === opt.title;
                    // }

                    // if (q.type === "MULTIPLECHOICE") {
                    //   checked =
                    //     Array.isArray(answers[q._id]) &&
                    //     answers[q._id].includes(opt.title);
                    // }

                    return (
                      <label className="flex items-center space-x-2 mb-1">
                        <input
                          type={
                            q.type === "SINGLECHOICE" ? "radio" : "checkbox"
                          }
                          name={q._id}
                          value={opt.title}
                          checked={checked}
                          disabled={true}
                        />
                        <span>{opt.title}</span>
                      </label>
                    );
                  })}

                  {q.type === "TEXT" && (
                    <textarea
                      className="w-full border-0 border-b border-gray-300  text-sm
                                                focus:border-b-2 focus:border-primary 
                                                 outline-none p-2 transition-all duration-200 ease-in-out"
                      rows={1}
                      disabled={true}
                      placeholder="Hãy nhập câu trả lời"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewForm;
