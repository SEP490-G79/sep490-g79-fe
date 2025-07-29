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
import { useParams } from "react-router-dom";
import htmlUtils from "@/utils/htmlUtils";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
;


type EditBlogProps = {
    blog: Blog | undefined;
}

const EditBlog = ({ blog}: EditBlogProps) => {
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
        thumbnail_url: blog?.thumbnail_url,
        title: blog?.title,
        description: blog?.description,
        content: blog?.content,
    },
  });

  
  useEffect(() => {
    form.reset({
        thumbnail_url: blog?.thumbnail_url,
        title: blog?.title,
        description: blog?.description,
        content: blog?.content,
    })
  }, []);

  const handeUploadImage = (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file)
  }

  const handleSave = async (values: FormValues) => {
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

        await authAxios.put(`${blogAPI}/${blog?._id}/update/${shelterId}`, formData)
        toast.success("Cập nhập blog thành công!")
    } catch (error : any) {
        toast.error(error?.response.data.message);
    } finally{
      setLoading(false)
    }
  };

  if (!blog) return <div className="text-center text-gray-500">Không tìm thấy bài viết.</div>;

  return (
    <div className="px-20 py-10">
      <h4 className="text-center font-semibold text-xl">Chỉnh sửa blog</h4>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input className="mb-4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className="flex flex-col gap-2">
                      <p>Ảnh bìa</p>
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          width={400}
                          height={300}
                          className="max-h-[25vh] max-w-[20vw]"
                        />
                      ) : (
                        <img
                          src={form.getValues("thumbnail_url")}
                          alt={form.getValues("title") + " background"}
                          className="max-w-40 max-h-30"
                        />
                      )}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mb-4"
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
                  <FormLabel>Miêu tả <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea className="mb-4" {...field} />
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
                      placeholder="Viết nội dung bài blog ở đây..."
                      autofocus={true}
                      editable={true}
                      editorClassName="focus:outline-hidden"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Vui lòng chờ..." : "Lưu thay đổi"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditBlog;
