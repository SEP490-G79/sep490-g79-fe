import React, { useContext, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import htmlUtils from "@/utils/htmlUtils";
;


const CreateBlog = ({open, setIsOpen}: {open: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [selectedImage, setSelectedImage] = useState<File>();
    const authAxios = useAuthAxios();
    const {blogAPI} = useContext(AppContext);
    const {shelterId} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const {stripHtml} = htmlUtils;

    const FormSchema = z.object({
      thumbnail_url: z.string(),
      title: z
        .string()
        .trim()
        .min(2, "Vui lòng nhập tiêu đề")
        .max(100, "Tiêu đề không được dài hơn 100 ký tự"),
      description: z
        .string()
        .trim()
        .min(10, "Vui lòng nhập miêu tả đầy đủ")
        .max(300, "Miêu tả không được dài hơn 300 ký tự"),
      content: z
        .string()
        .refine((value) => stripHtml(value).trim().length >= 50, {
          message: "Nội dung phải có ít nhất 50 ký tự thực tế",
        })
        .refine((value) => stripHtml(value).trim().length <= 10000, {
          message: "Nội dung không được vượt quá 10000 ký tự",
        }),
    });
type FormValues = z.infer<typeof FormSchema>;

    const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        thumbnail_url: "",
        title: "",
        description: "",
        content: "",
    },
  });


  const handeUploadImage = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file)
  }

  const handleCreate = async (values: FormValues) => {
    try {
        if(!values){
            return;
        }

        setLoading(true)
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("content", values.content);
        selectedImage && formData.append("thumbnail_url", selectedImage)

        await authAxios.post(`${blogAPI}/create/${shelterId}`, formData)
        toast.success("Tạo blog thành công!")
        setIsOpen(false);
    } catch (error : any) {
        toast.error(error?.response.data.message);
    } finally{
      setLoading(false)
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset({
            thumbnail_url: "",
            title: "",
            description: "",
            content: "",
          });
          setSelectedImage(undefined);
          setIsOpen(false);
        }
      }}
    >
      <Button variant="ghost" className="text-xs cursor-pointer" onClick={() => setIsOpen(true)}>
        <PlusSquare className="text-(--primary)" />Tạo blog mới
      </Button>
      <DialogContent className="min-w-[60vw] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Tạo bài viết blog mới
          </DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tiêu đề của bài viết"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail_url"
              render={() => (
                <FormItem>
                  <FormLabel>
                    <div className="flex flex-col gap-2">
                      <p>Ảnh bìa</p>
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          className="max-h-[25vh] max-w-[20vw] rounded border object-cover"
                        />
                      ) : null}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handeUploadImage}
                      placeholder="Upload ảnh thumbnail của bài viết"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Miêu tả <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea {...field}  placeholder="Miêu tả ngắn gọn của bài viết"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="w-full mb-2"
                      editorContentClassName="p-5"
                      output="html"
                      placeholder="Viết nội dung của bài viết ở đây..."
                      autofocus={true}
                      editable={true}
                      editorClassName="focus:outline-hidden"
                      hideToolbar={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                >
                  Đóng
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Vui lòng chờ..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlog;
