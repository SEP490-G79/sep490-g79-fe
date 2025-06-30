import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, LucideArrowLeft, PenLine } from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";

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
            <TabsTrigger value="edit"><PenLine/></TabsTrigger>
            <TabsTrigger value="preview"><Eye/></TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <div className="basis-full">
              <h1 className="text-xl">Tiêu đề </h1>
              <p className="text-sm text-(--muted-foreground) line-clamp-1">
                mô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô
                tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô
                tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô tảmô
                tảmô tảmô tảmô tả
              </p>
            </div>
            <div className="basis-full">
                okoko
            </div>
          </TabsContent>
          <TabsContent value="preview">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default TemplateDialog;
