import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  LucideArrowLeft,
  PenBox,
  PenLine,
  Plus,
  SaveAllIcon,
} from "lucide-react";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Question } from "@/types/Question";
import { Dock, DockIcon } from "@/components/ui/magicui/dock";
import { Skeleton } from "@/components/ui/skeleton";
import PreviewForm from "./PreviewForm";
import EditDialog from "./EditDialog";

export default function AdoptionForm() {
  const { shelterId, formId } = useParams<{
    shelterId: string;
    formId: string;
  }>();
  const { coreAPI, shelterForms, setShelterForms } = useContext(AppContext);
  const [adoptionForm, setAdoptionForm] = useState<AdoptionForm>();
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
          toast.error("Không tìm thấy form nhận nuôi");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu form nhận nuôi");
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);  
      });
  };
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

  const handleSave = async () => {
    if (!adoptionForm) return;
    try {
      const questionsPayload = questionsList.map((question) => {
        const filteredOptions = question.options.filter(
          (opt) => opt.title.trim() !== ""
        );

        const isExisting = adoptionForm.questions.some(
          (old) => old._id === question._id
        );

        if (isExisting) {
          return {
            ...question,
            options: filteredOptions,
          };
        } else {
          const { _id, ...rest } = question;
          return {
            ...rest,
            options: filteredOptions,
          };
        }
      });

      const updatedForm = {
        title: adoptionForm.title,
        pet: adoptionForm.pet._id,
        description: adoptionForm.description || "",
        questions: questionsPayload,
      };

      await authAxios.put(
        `${coreAPI}/shelters/${shelterId}/adoptionForms/${formId}/update-questions`,
        updatedForm
      );
      handleFetchAdoptionForm();
      toast.success("Lưu mẫu nhận nuôi thành công!");
    } catch (error) {
      console.error("Error saving adoption form:", error);
      toast.error("Lỗi khi lưu mẫu nhận nuôi. Vui lòng thử lại sau.");
    }
  };

  // console.log(questionsList);

  const DATA = {
    navbar: [
      {
        href: "#",
        icon: <SaveAllIcon className="size-5 " />,
        label: "Lưu",
        function: handleSave,
      },
      {
        href: "#",
        icon: <Plus className="size-5 " />,
        label: "Thêm câu hỏi",
        function: handleCreateQuestion,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-10 mb-2" />
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-24 mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap">
      {/* <Breadcrumb className="basis-full mb-3">
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
      </Breadcrumb> */}

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
                  <EditDialog 
                    adoptionForm={adoptionForm}
                    setAdoptionForm={setAdoptionForm}
                    setIsLoading={setIsLoading}
                  />
                  Tiêu đề: {adoptionForm?.title}
                </h1>
                {/* <h1 className="text-md font-medium ml-10 mb-2">
                  Loài: {adoptionTemplate?.species?.name}
                </h1> */}
                <div className=" flex gap-3 ml-10 mb-2 ">
                  {/* <p className="text-sm">Mô tả: </p> */}
                  {/* <p className="text-sm text-(--muted-foreground)">
                    {adoptionForm?.description ||
                      "Mô tả mẫu nhận nuôi chưa được cung cấp."}
                  </p> */}
                  <span className="font-medium text-sm">Pet code: <span className="font-normal italic">#{adoptionForm?.pet.petCode}</span></span>
                </div>
              </div>
              <div className="basis-full sm:basis-1/3 sm:text-right">
                <Button variant={"default"} onClick={handleSave}>
                  <SaveAllIcon /> Lưu
                </Button>
              </div>
            </div>

            <Separator />

            <div className="basis-full flex flex-wrap ">
              {questionsList?.map((question: Question) => {
                return (
                  <QuestionCard
                    question={question}
                    setQuestionsList={setQuestionsList}
                  />
                );
              })}
            </div>
            <div className="flex basis-full justify-start my-3">
              {/* <Tooltip>
                  <TooltipTrigger asChild>
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
                </Tooltip> */}
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={handleCreateQuestion}
              >
                <Plus /> Thêm câu hỏi
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center sticky bottom-4 left-0 right-0 mx-auto">
              <TooltipProvider>
                <Dock
                  direction="middle"
                  className="bg-(--background) border-2 border-(--border)"
                >
                  {DATA.navbar.map((item) => (
                    <DockIcon key={item.label}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={item.function}
                            variant="ghost"
                            className="hover:text-(--primary)"
                          >
                            {item.icon}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </DockIcon>
                  ))}
                </Dock>
              </TooltipProvider>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            {/* <p>Preview: {adoptionForm?.title}</p> */}
            <PreviewForm/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
