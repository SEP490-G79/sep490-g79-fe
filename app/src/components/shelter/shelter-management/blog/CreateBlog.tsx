import React, { useContext, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types/Blog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
;


const CreateBlog = ({open, setIsOpen}: {open: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [selectedImage, setSelectedImage] = useState<File>();
    const authAxios = useAuthAxios();
    const {blogAPI} = useContext(AppContext);
    const {shelterId} = useParams();
    const [loading, setLoading] = useState<boolean>(false);

    const FormSchema = z.object({
    thumbnail_url: z.string(),
    title: z.string().trim().min(2, "Vui lòng nhập tiêu đề").max(30, "Tiêu đề không được dài hơn 30 ký tự"),
    description: z.string().trim().min(10, "Vui lòng nhập miêu tả đầy đủ").max(300, "Miêu tả không được dài hơn 300 ký tự"),
    content: z.string().trim().min(50, "Vui lòng nhập nội dung đầy đủ").max(1500, "Nội dung không được dài hơn 1000 ký tự"),
})
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
     <Dialog open={open} onOpenChange={(open) => {
        if(!open){
            form.reset({
              thumbnail_url: "",
              title: "",
              description: "",
              content: "",
            });
            setSelectedImage(undefined);
        }
     }}>
            <Button variant="default" onClick={() => setIsOpen(true)}>
              <Plus /> Tạo blog mới
            </Button>
      <DialogContent className="min-w-[60vw] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Tạo blog
          </DialogTitle>
          <DialogDescription>
            Blog khi mới sẽ được đưa vào danh sách chờ duyệt trước khi được đăng lên hệ thống
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Miêu tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                    <Button variant="outline" disabled={loading} onClick={() => setIsOpen(false)}>Đóng</Button>
              </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Vui lòng chờ..." : "Lưu thay đổi"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlog;
