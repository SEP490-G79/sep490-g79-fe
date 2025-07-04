import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, LucideArrowLeft, PenLine, Plus, PlusCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../question/QuestionCard";
import EditDialog from "./EditDialog";
import type { AdoptionTemplate } from "@/types/AdoptionTemplate";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";

export default function TemplateDialog() {
  const { shelterId, templateId } = useParams<{
    shelterId: string;
    templateId: string;
  }>();
  const { coreAPI, shelterTemplates, setShelterTemplates } =
    useContext(AppContext);
  const [adoptionTemplate, setAdoptionTemplate] = useState<AdoptionTemplate>();
  const authAxios = useAuthAxios();

  useEffect(() => {
    if (!shelterId || !templateId) return;
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/get-all`)
      .then((res) => {
        const templates: AdoptionTemplate[] = res.data;
        setShelterTemplates(templates);
        const found = templates.find((t) => t._id === templateId);
        if (found) {
          setAdoptionTemplate(found);
        } else {
          toast.error("Không tìm thấy mẫu nhận nuôi");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi tải dữ liệu mẫu nhận nuôi");
      });
  }, [coreAPI, shelterId, templateId]);

  

  return (
    <div className="w-full flex flex-wrap">
      <Breadcrumb className="basis-full mb-3">
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
                  {/* <p className="text-sm">Mô tả: </p> */}
                  <p className="text-sm text-(--muted-foreground)">
                    {adoptionTemplate?.description ||
                      "Mô tả mẫu nhận nuôi chưa được cung cấp."}
                  </p>
                </div>
              </div>
              <div className="basis-full sm:basis-1/3 sm:text-right">
                <div className="flex justify-end">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant={"ghost"}
                        className="text-(--primary) hover:text-(--primary) hover:border-(--primary) "
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
            </div>

            <Separator />

            <div className="basis-full flex flex-wrap">
              <QuestionCard />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <p>Preview: {adoptionTemplate?.title}</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
