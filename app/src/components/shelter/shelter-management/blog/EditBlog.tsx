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
;


type EditBlogProps = {
    blog: Blog | undefined;
}

const EditBlog = ({ blog}: EditBlogProps) => {
    const [selectedImage, setSelectedImage] = useState<string>();
    const authAxios = useAuthAxios();
    const {blogAPI} = useContext(AppContext);

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
    setSelectedImage(file ? URL.createObjectURL(file) : undefined)
  }

  const handleSave = async (values: FormValues) => {
    try {
        if(!values){
            return;
        }
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("content", values.content);
        selectedImage && formData.append("thumbnail", selectedImage)

        await authAxios.put(`${blogAPI}/edit-blog`, formData)
        toast.success("Cập nhập blog thành công!")
    } catch (error : any) {
        toast.error(error?.response.data.message);
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
                  <FormLabel>Tiêu đề</FormLabel>
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
                        {selectedImage ? 
                        <img
                            src={selectedImage}
                            width={400}
                            height={300}
                            className="max-h-[25vh] max-w-[20vw]"
                        /> :
                        <img src={form.getValues("thumbnail_url")} alt={form.getValues("title")+ " background"}  className="max-w-40 max-h-30"/>
                        }
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" className="mb-4" onChange={handeUploadImage} />
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
                  <FormLabel>
                    Miêu tả
                  </FormLabel>
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
                  <FormLabel>
                    Nội dung
                  </FormLabel>
                  <FormControl>
                    <Textarea className="mb-4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditBlog;
