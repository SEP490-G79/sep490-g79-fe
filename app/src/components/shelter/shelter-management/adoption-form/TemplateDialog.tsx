import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, LucideArrowLeft, Pen, PenLine, Settings } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../question/QuestionCard";

function TemplateDialog() {
  const { shelterId } = useParams();

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
              <span className="hover:underline">Quay lại </span>
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
            <div className="basis-full flex mb-3">
              <div className="basis-full sm:basis-2/3 sm:text-left ">
                <h1 className="text-xl">Tiêu đề </h1>
                <p className="text-sm text-(--muted-foreground) ">
                  mô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô
                  tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô
                  tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô
                  tảmô tảmô tảmô tảmô tảmô tả
                </p>
              </div>
              <div className="basis-full sm:basis-1/3 sm:text-right">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="cursor-pointer hover:text-(--primary)"
                    >
                      <Pen />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p>Chỉnh sửa thông tin mẫu</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Separator/>

            <div className="basis-full flex flex-wrap">
                <QuestionCard/>
                <QuestionCard/>
            </div>

          </TabsContent>
          <TabsContent value="preview">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default TemplateDialog;
