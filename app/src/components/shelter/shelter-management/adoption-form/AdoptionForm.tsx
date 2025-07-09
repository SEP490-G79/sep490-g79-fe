import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, LucideArrowLeft, PenBox, PenLine, Plus } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../question/QuestionCard";
import type { AdoptionForm } from "@/types/AdoptionForm";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Question } from "@/types/Question";

export default function AdoptionForm() {
  const { shelterId, formId } = useParams<{
    shelterId: string;
    formId: string;
  }>();
  const { coreAPI, shelterForms, setShelterForms } = useContext(AppContext);
  const [adoptionForm, setAdoptionForm] = useState<AdoptionForm>();
  const [questionsList, setQuestionsList] = useState<Question[]>([]);

  const authAxios = useAuthAxios();

  useEffect(() => {
    if (!shelterId || !formId) return;
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
          toast.error("Không tìm thấy form nhận nuôi");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu form nhận nuôi");
      });
  }, [coreAPI, shelterId, formId]);

  const handleCreateQuestion = () => {
    const now = new Date();
    const newQuestion: Question = {
      _id: `${adoptionForm?._id}-question-${Date.now()}`,
      title: `Câu hỏi ${questionsList.length + 1}`,
      priority: "none",
      options: [],
      status: "active",
      type: "",
      createdAt: now,
      updatedAt: now,
    };

    setQuestionsList((prev) => [...prev, newQuestion]);
  };
  return (
    <div className="w-full flex flex-wrap">
      <Breadcrumb className="basis-full mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-(--muted-foreground) flex gap-2"
              href={`/shelters/${shelterId}/management/adoption-forms`}
            >
              <LucideArrowLeft className="w-4 h-4 translate-0.5" />
              <span className="hover:underline">Quản lý form nhận nuôi</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
        s
      </Breadcrumb>

      <div className="basis-full">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList>
            <TabsTrigger value="edit">
              <PenLine /> Chỉnh sửa
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye /> Xem trước
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <div className="basis-full flex mb-3 ">
              <div className="basis-full sm:basis-2/3 sm:text-left">
                <h1 className="text-xl font-medium mb-2 hover:text-(--primary)">
                  {/* <EditDialog
                    adoptionTemplate={adoptionTemplate}
                    setAdoptionTemplate={setAdoptionTemplate}
                  /> */}
                  <Button variant={"link"}>
                    <PenBox strokeWidth={2} />
                  </Button>
                  Tiêu đề: {adoptionForm?.title}
                </h1>
                {/* <h1 className="text-md font-medium ml-10 mb-2">
                  Loài: {adoptionTemplate?.species?.name}
                </h1> */}
                <div className=" flex gap-3 ml-10 mb-2 ">
                  {/* <p className="text-sm">Mô tả: </p> */}
                  <p className="text-sm text-(--muted-foreground)">
                    {adoptionForm?.description ||
                      "Mô tả mẫu nhận nuôi chưa được cung cấp."}
                  </p>
                </div>
              </div>
              <div className="basis-full sm:basis-1/3 sm:text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant={"ghost"}
                      className="text-(--primary) hover:text-(--primary) hover:border-(--primary) "
                      onClick={handleCreateQuestion}

                    >
                      <Plus strokeWidth={3} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="text-sm">Thêm câu hỏi</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <Separator />

            <div className="basis-full flex flex-wrap">
              {questionsList?.map((question: Question) => {
                return (
                  <QuestionCard
                    question={question}
                    setQuestionsList={setQuestionsList}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <p>Preview: {adoptionForm?.title}</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
