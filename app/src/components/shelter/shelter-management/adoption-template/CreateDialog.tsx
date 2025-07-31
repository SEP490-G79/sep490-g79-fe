import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, PlusSquare } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { useNavigate, useParams } from "react-router-dom";
import { ca } from "zod/v4/locales";
import { toast } from "sonner";
import type { AdoptionTemplate } from "@/types/AdoptionTemplate";
import axios from "axios";
import type { Species } from "@/types/Species";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";


export default function CreateDialog() {
  const { coreAPI, shelterTemplates, setShelterTemplates } =
    useContext(AppContext);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${coreAPI}/species/get-all`)
      .then((res) => {
        setSpeciesList(res.data);
      })
      .catch((err) => {
        console.error("Error fetching species:", err);
        toast.error("Không thể tải danh sách loài. Vui lòng thử lại sau.");
      });
  }, []);
  const FormSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải trên 5 ký tự."),
    species: z.string().min(1, "Chọn loài."),
    description: z.string().optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      species: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    // console.log("Form submitted:", values);
    await authAxios
      .post(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/create`, {
        title: values.title,
        species: values.species,
        description: values.description,
      })
      .then((res) => {
        toast.success("Tạo mẫu nhận nuôi thành công! Đang chuyển hướng ...");
        setShelterTemplates([...shelterTemplates, res.data]);
        form.reset();
        document
          .querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')
          ?.click();
        setTimeout(() => {
          navigate(
            `/shelters/${shelterId}/management/adoption-templates/${res.data._id}`
          );
        }, 800);
      })
      .catch((err) => {
        console.error("Error creating adoption template:", err);
        toast.error("Tạo mẫu nhận nuôi thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button variant="ghost" className="text-xs">
          <PlusSquare className="text-(--primary)" />
          Tạo mới
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:min-w-2xl ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Tạo mẫu nhận nuôi</DialogTitle>
              <DialogDescription>
                Tạo mẫu nhận nuôi cho từng loài! Giảm bớt thời gian quản lý.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 my-3">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề <span className="text-(--destructive)">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Species Select */}
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loài <span className="text-(--destructive)">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-1/2">
                          <SelectValue placeholder="Chọn loài" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[10rem]">
                          {speciesList.map((s) => (
                            <SelectItem key={s._id} value={s._id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl className="w-full">
                      {/* <Textarea
                        placeholder="Thêm mô tả (tùy chọn)"
                        {...field}
                      /> */}
                      <MinimalTiptapEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="w-full"
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Enter your description..."
                        autofocus={true}
                        editable={true}
                        hideToolbar={false}
                        editorClassName="focus:outline-hidden"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit">
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
