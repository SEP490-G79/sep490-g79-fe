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
  Github,
  Home,
  Linkedin,
  LucideArrowLeft,
  Mail,
  Pen,
  PenLine,
  Plus,
  PlusCircle,
  SaveAllIcon,
  X,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuestionCard from "../question/QuestionCard";
import EditDialog from "./EditDialog";
import type { AdoptionTemplate } from "@/types/AdoptionTemplate";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Question } from "@/types/Question";

import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/ui/magicui/dock";
import { Skeleton } from "@/components/ui/skeleton";
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
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function TemplateDialog() {
  const { shelterId, templateId } = useParams<{
    shelterId: string;
    templateId: string;
  }>();
  const { coreAPI, shelterTemplates, setShelterTemplates } =
    useContext(AppContext);
  const [adoptionTemplate, setAdoptionTemplate] = useState<AdoptionTemplate>();
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authAxios = useAuthAxios();

  useEffect(() => {
    handleRefresh();
  }, [coreAPI, shelterId, templateId]);

  const handleRefresh = async () => {
    if (!shelterId || !templateId) return;
    setIsLoading(true);
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/get-all`)
      .then((res) => {
        const templates: AdoptionTemplate[] = res.data;
        setShelterTemplates(templates);

        const found = templates.find((t) => t._id === templateId);
        if (found) {
          setAdoptionTemplate(found);
          setQuestionsList([...found.questions]);
        } else {
          toast.error("Không tìm thấy mẫu nhận nuôi");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu mẫu nhận nuôi");
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
      _id: `${adoptionTemplate?._id}-question-${Date.now()}`,
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

  // console.log(questionsList);

  const handleSave = async () => {
    if (!adoptionTemplate) return;
    try {
      const questionsPayload = questionsList.map((question) => {
        const filteredOptions = question.options.filter(
          (opt) => opt.title.trim() != ""
        );

        const isExisting = adoptionTemplate.questions.some(
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

      const updatedTemplate = {
        title: adoptionTemplate.title,
        species: adoptionTemplate.species._id,
        description: adoptionTemplate.description || "",
        questions: questionsPayload,
      };

      await authAxios.put(
        `${coreAPI}/shelters/${shelterId}/adoptionTemplates/${templateId}/update-questions`,
        updatedTemplate
      );
      handleRefresh();
      toast.success("Lưu mẫu nhận nuôi thành công!");
    } catch (error) {
      console.error("Error saving adoption template:", error);
      toast.error("Lỗi khi lưu mẫu nhận nuôi. Vui lòng thử lại sau.");
    }
  };

  // DND
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);
  const handleDragStart = (event: any) => {
    const { active } = event;
    const draggedId = active?.id;
    const found = questionsList.find((q) => q._id === draggedId);
  };

  const handleDragEnd = (e: any) => {
    const { active, over } = e;

    // console.log("Drag Ended:", active.id, "over:", over?.id);
    if (active.id != over?.id) {
      setQuestionsList((prev) => {
        const oldIndex = prev.findIndex((q) => q._id == active.id);
        const newIndex = prev.findIndex((q) => q._id == over?.id);

        const updatedQuestions = [...prev];
        const [movedQuestion] = updatedQuestions.splice(oldIndex, 1);
        updatedQuestions.splice(newIndex, 0, movedQuestion);

        return updatedQuestions;
      });
    }
  };

  //
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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full flex flex-wrap">
        {/* <Breadcrumb className="basis-full mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-(--muted-foreground) flex gap-2"
              href={`/shelters/${shelterId}/management/adoption-templates`}
            >
              <LucideArrowLeft className="w-4 h-4 translate-0.5" />
              <span className="hover:underline">Quản lý mẫu nhận nuôi</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

        <div className="basis-full">
          {/* <Tabs defaultValue="edit" className="w-full">
          <TabsList>
            <TabsTrigger value="edit">
              <PenLine /> Chỉnh sửa
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye /> Xem trước
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit"> */}
          <div className="basis-full flex mb-3 ">
            <div className="basis-full sm:basis-2/3 sm:text-left">
              <h1 className="text-xl font-medium mb-2 hover:text-(--primary)">
                <EditDialog
                  adoptionTemplate={adoptionTemplate}
                  setAdoptionTemplate={setAdoptionTemplate}
                />
                Tiêu đề: {adoptionTemplate?.title}
              </h1>
              {/* <h1 className="text-md font-medium ml-10 mb-2">
                  Loài: {adoptionTemplate?.species?.name}
                </h1> */}
              <div className=" flex gap-3 ml-10 mb-2 ">
              <p className="text-sm">Loài vật: </p>
                <p className="text-sm text-(--muted-foreground)">
                    {adoptionTemplate?.species?.name || "Chưa chọn loài"}
                  </p>
                
              </div>
            </div>
            <div className="basis-full sm:basis-1/3 sm:text-right">
              <div className="flex justify-end">
                <Button variant={"default"} onClick={handleSave}>
                  <SaveAllIcon /> Lưu
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="basis-full flex flex-wrap ">
            <SortableContext
              items={questionsList.map((q) => q._id)}
              strategy={verticalListSortingStrategy}
            >
              {questionsList?.map((question: Question) => {
                return (
                  <QuestionCard
                    key={question._id}
                    _id={question._id}
                    question={question}
                    setQuestionsList={setQuestionsList}
                  />
                );
              })}
            </SortableContext>
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
          </div>
          {/* </TabsContent>

          <TabsContent value="preview">
            <p>Preview: {adoptionTemplate?.title}</p>
          </TabsContent>
        </Tabs> */}
        </div>
      </div>
    </DndContext>
  );
}
