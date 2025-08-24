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
import { Pen, PenBoxIcon, PenLine, PenLineIcon, Plus } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Species } from "@/types/Species";
import axios from "axios";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

type Props = {
  adoptionTemplate: AdoptionTemplate | undefined;
  setAdoptionTemplate: React.Dispatch<
    React.SetStateAction<AdoptionTemplate | undefined>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditDialog({
  adoptionTemplate,
  setAdoptionTemplate,
  setIsLoading
}: Props) {
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
    title: z.string().min(5, "Tiêu đề không được để trống."),
    species: z.string().min(1, "Chọn loài."),
    description: z.string().optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: adoptionTemplate?.title,
      species: adoptionTemplate?.species?._id,
      description: adoptionTemplate?.description,
    },
  });

  useEffect(() => {
    form.reset({
      title: adoptionTemplate?.title,
      species: adoptionTemplate?.species?._id,
      description: adoptionTemplate?.description ?? "",
    });
  }, [adoptionTemplate, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    await authAxios
      .put(
        `${coreAPI}/shelters/${shelterId}/adoptionTemplates/${adoptionTemplate?._id}/edit`,
        {
          title: values.title,
          species: values.species,
          description: values.description,
        }
      )
      .then((res) => {
        const updatedTemplate: AdoptionTemplate = res.data;
        toast.success("Chỉnh sửa mẫu nhận nuôi thành công!");
        setAdoptionTemplate(updatedTemplate);
        const updatedTemplates = shelterTemplates.map((template) =>
          template._id == updatedTemplate._id ? updatedTemplate : template
        );
        setShelterTemplates([...updatedTemplates]);
        document
          .querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')
          ?.click();
      })
      .catch((err) => {
        console.error("Error creating adoption template:", err);
        toast.error("Tạo mẫu nhận nuôi thất bại. Vui lòng thử lại.");
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      })
      ;
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="link" className="hover:text-(--primary)">
              <PenBoxIcon className="h-full w-full " />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chỉnh sửa thông tin mẫu</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm: min-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa mẫu nhận nuôi</DialogTitle>
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
                    <FormLabel>Tiêu đề</FormLabel>
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
                    <FormLabel>Loài</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-1/3">
                          <SelectValue placeholder="Chọn loài" />
                        </SelectTrigger>
                        <SelectContent className="w-1/3">
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
                    <FormLabel>Điều kiện & điều khoản nhận nuôi</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="w-full"
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Điều kiện & điều khoản nhận nuôi..."
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
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
