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
import { Plus } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { useNavigate, useParams } from "react-router-dom";
import { ca } from "zod/v4/locales";
import { toast } from "sonner";
import type { AdoptionForm } from "@/types/AdoptionForm";

export default function CreateDialog() {
  const { coreAPI, shelterForms, setShelterForms, petsList } =
    useContext(AppContext);
  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  // lấy ra availablePets là danh sách thú cưng có trạng thái "unavailable" và chưa có form nhân nuôi
  const availablePets = petsList.filter(
    (pet: any) =>
      pet.shelter?._id == shelterId &&
      pet.status == "unavailable" &&
      !shelterForms.some((form: AdoptionForm) => form.pet._id == pet._id)
  );
  const FormSchema = z.object({
    title: z.string().min(5, "Tiêu đề không được để trống."),
    pet: z.string().min(1, "Chọn loài."),
    description: z.string().optional(),
  });
  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      pet: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted:", values);
    await authAxios
      .post(`${coreAPI}/shelters/${shelterId}/adoptionForms/create/${values.pet}`, {
        title: values.title,
        description: values.description,
      })
      .then((res) => {
        toast.success("Tạo mẫu nhận nuôi thành công! Đang chuyển hướng ...");
        setShelterForms([...shelterForms, res.data]);
        form.reset();
        document
          .querySelector<HTMLButtonElement>('[data-slot="dialog-close"]')
          ?.click();
        // setTimeout(() => {
        //   navigate(
        //     `/shelters/${shelterId}/management/adoption-forms/${res.data._id}`
        //   );
        // }, 800);
      })
      .catch((err) => {
        console.error("Error creating adoption form:", err);
        toast.error("Tạo mẫu nhận nuôi thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Tạo mẫu
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Tạo form nhận nuôi</DialogTitle>
              <DialogDescription>
                Nhập thông tin cần thiết để tạo mẫu nhận nuôi mới. Bạn có thể
                chỉnh sửa sau.
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

              {/* Pet Select */}
              <FormField
                control={form.control}
                name="pet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mã thú nuôi{" "}
                      <span className="text-(--destructive)">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thú nuôi" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[10rem]">
                          {availablePets.map((s: any) => (
                            <SelectItem key={s._id} value={s._id}>
                              {s.petCode}
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
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
