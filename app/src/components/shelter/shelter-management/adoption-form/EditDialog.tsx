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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  adoptionForm: AdoptionForm | undefined;
  setAdoptionForm: React.Dispatch<
    React.SetStateAction<AdoptionForm | undefined>
  >;
};

export default function EditDialog({ adoptionForm, setAdoptionForm }: Props) {
  const { coreAPI, shelterForms, setShelterForms, petsList } =
    useContext(AppContext);
  const [petList, setPetList] = useState<Pet[]>([]);
  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();

  const availablePets = petsList.filter(
    (pet: any) =>
      pet.shelter?._id == shelterId &&
      pet.status == "unavailable" &&
      !shelterForms.some((form: AdoptionForm) => form.pet._id == pet._id)
  );
  console.log(adoptionForm?.pet?._id);

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
    await authAxios
      .put(
        `${coreAPI}/shelters/${shelterId}/adoptionForms/${adoptionForm?._id}/edit`,
        {
          title: values.title,
          pet: values.pet,
          description: values.description,
        }
      )
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
        toast.error("Tạo form nhận nuôi thất bại. Vui lòng thử lại.");
      });
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
          <p>Chỉnh sửa thông tin form</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm: min-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa form nhận nuôi</DialogTitle>
              <DialogDescription>
                Tạo form nhận nuôi cho từng loài! Giảm bớt thời gian quản lý.
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
                        disabled
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn thú nuôi">
                            {adoptionForm?.pet?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[10rem]">
                          <SelectGroup>
                            <SelectLabel>Mã thú nuôi</SelectLabel>
                            {availablePets.map((s: any) => (
                              <SelectItem
                                key={s._id}
                                value={s._id}
                                className="flex items-center w-full mx-2 py-1"
                              >
                                <Avatar className="rounded-none w-8 h-8">
                                  <AvatarImage
                                    src={s?.photos[0]}
                                    alt={s?.name}
                                    className="w-8 h-8 object-center object-cover"
                                  />
                                  <AvatarFallback className="rounded-none">
                                    <span className="font-medium">
                                      {s.name.charAt(0).toUpperCase()}
                                    </span>
                                  </AvatarFallback>
                                </Avatar>

                                <div className="ml-2 flex flex-col overflow-hidden ">
                                  <span className="text-sm font-medium truncate">
                                    {s.name}
                                  </span>
                                  <span className="text-xs text-(--muted-foreground) truncate">
                                    #{s.petCode}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
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
                      <MinimalTiptapEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="w-full"
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Enter your description..."
                        autofocus={true}
                        editable={true}
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
