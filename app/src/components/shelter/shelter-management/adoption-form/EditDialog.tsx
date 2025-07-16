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
import type { AdoptionForm } from "@/types/AdoptionForm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Pet } from "@/types/Pet";
import axios from "axios";

type Props = {
  adoptionForm: AdoptionForm | undefined;
  setAdoptionForm: React.Dispatch<
    React.SetStateAction<AdoptionForm | undefined>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditDialog({
  adoptionForm,
  setAdoptionForm,
  setIsLoading,
}: Props) {
  const { coreAPI, shelterForms, setShelterForms } =
    useContext(AppContext);
    const [petList, setPetList] = useState<Pet[]>([]);
  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${coreAPI}/pets/get-pet-list`)
    .then((res) => {
      setPetList(res.data);
    })
    .catch((err) => { 
      console.error("Error fetching pet:", err);
      toast.error("Không thể tải danh sách thú cưng. Vui lòng thử lại sau.");
    });
  }, [coreAPI]);
  const FormSchema = z.object({
    title: z.string().min(5, "Tiêu đề không được để trống."),
    pet: z.string().min(1, "Chọn thú nuôi."),
    description: z.string().optional(),
  });

  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: adoptionForm?.title,
      pet: adoptionForm?.pet?._id,
      description: adoptionForm?.description,
    },
  });

  useEffect(() => {
    form.reset({
      title: adoptionForm?.title,
      pet: adoptionForm?.pet?._id,
      description: adoptionForm?.description ?? "",
    });
  }, [adoptionForm, form]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    await authAxios
      .put(`${coreAPI}/shelters/${shelterId}/adoptionForms/${adoptionForm?._id}/edit`, {
        title: values.title,
        pet: values.pet,
        description: values.description,
      })
      .then((res) => {
        const updatedForm: AdoptionForm = res.data;
        setAdoptionForm(updatedForm);
        const updatedForms = shelterForms.map((form) =>
          form._id == updatedForm._id ? updatedForm : form
        );
        setShelterForms([...updatedForms]);
        document
          .querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')
          ?.click();

      })
      .catch((err) => {
        console.error("Error creating adoption form:", err);
        toast.error("Sửa form nhận nuôi thất bại. Vui lòng thử lại.");
      })
      .finally(() => {
        setIsLoading(false);
      })
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

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa form nhận nuôi</DialogTitle>
              <DialogDescription>
          
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

              {/* Pet Select */}
              <FormField
                control={form.control}
                name="pet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thú nuôi</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thú nuôi" />
                        </SelectTrigger>
                        <SelectContent>
                          {petList.map((s) => (
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
                    <FormControl>
                      <Textarea
                        placeholder="Thêm mô tả (tùy chọn)"
                        {...field}
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
