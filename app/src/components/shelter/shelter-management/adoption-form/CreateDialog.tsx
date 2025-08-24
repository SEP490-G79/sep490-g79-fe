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
  FormDescription,
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
import { Check, ChevronsUpDown, Plus, PlusSquare, Search } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Pet } from "@/types/Pet";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

type Props = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateDialog({ setIsLoading }: Props) {
  const {
    coreAPI,
    shelterForms,
    shelterTemplates,
    setShelterForms,
    petsList,
    fetchPetsList,
  } = useContext(AppContext);
  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = React.useState("");
  // lấy ra availablePets là danh sách thú cưng có trạng thái "unavailable" và chưa có form nhân nuôi

  const availablePets = petsList.filter(
    (pet: any) =>
      pet.shelter?._id == shelterId &&
      pet.status == "unavailable" &&
      !shelterForms.some((form: AdoptionForm) => form.pet._id == pet._id)
  );
  const FormSchema = z.object({
    title: z.string().min(5, "Tiêu đề phải trên 5 ký tự."),
    pet: z.string().min(1, "Chọn loài."),
    adoptionTemplate: z.string().optional(),
    description: z.string().optional(),
  });
  type FormValues = z.infer<typeof FormSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      pet: "",
      adoptionTemplate: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchPetsList();
  }, []);

  const onSubmit = async (values: FormValues) => {
    // console.log("Form submitted:", values);
    setIsLoading(true);
    if (values.adoptionTemplate) {
      const selectedTemplate = shelterTemplates.find(
        (template) => template._id == values.adoptionTemplate
      );
      if (selectedTemplate) {
        values.description = selectedTemplate.description || "";
        const newQuestions =
          selectedTemplate.questions.map(({ _id, ...question }) => question) ||
          [];
        await authAxios
          .post(
            `${coreAPI}/shelters/${shelterId}/adoptionForms/create-by-template/${values.pet}`,
            {
              title: values.title,
              description: values.description,
              questions: newQuestions || [],
            }
          )
          .then((res) => {
            toast.success(
              "Tạo đơn nhận nuôi thành công! Đang chuyển hướng ..."
            );
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
            toast.error("Tạo form nhận nuôi thất bại. Vui lòng thử lại.");
          })
          .finally(() => {
            setTimeout(() => {
              setIsLoading(false);
            }, 200);
          });
      }
    } else {
      await authAxios
        .post(
          `${coreAPI}/shelters/${shelterId}/adoptionForms/create/${values.pet}`,
          {
            title: values.title,
            description: values.description,
          }
        )
        .then((res) => {
          toast.success("Tạo đơn nhận nuôi thành công! Đang chuyển hướng ...");
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
          console.error("Error creating adoption đơn:", err);
          toast.error("Tạo đơn nhận nuôi thất bại. Vui lòng thử lại.");
        })
        .finally(() => {
          setTimeout(() => {
            setIsLoading(false);
          }, 200);
        });
    }
  };

  const petSpecialization = availablePets.find(
    (pet: Pet) => pet._id == form.watch("pet")
  )?.species.name;

  // console.log("Pet Specialization:", petSpecialization);

  const templates = shelterTemplates
    .filter(
      (template) =>
        !petSpecialization || template.species.name == petSpecialization
    )
    .map((template) => ({
      value: template._id,
      label: template.title,
    }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-xs">
          <PlusSquare className="text-(--primary)" />
          Tạo mới
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:min-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Tạo đơn nhận nuôi</DialogTitle>
              <DialogDescription>
                Nhập thông tin cần thiết để tạo đơn nhận nuôi mới. Bạn có thể
                chỉnh sửa sau.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
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
                      Thú nuôi <span className="text-(--destructive)">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          {availablePets.some(
                            (p: any) => p._id == field.value
                          ) ? (
                            <SelectValue>
                              {
                                availablePets.find(
                                  (p: any) => p._id == field.value
                                )?.name
                              }
                            </SelectValue>
                          ) : (
                            <SelectValue placeholder="Chọn thú nuôi" />
                          )}
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
              {/* Adoption Template Select */}
              <FormField
                control={form.control}
                name="adoptionTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn mẫu form nhận nuôi</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            // aria-expanded={open}
                            className="w-full justify-between font-normal"
                          >
                            {field.value
                              ? templates.find(
                                  (template) => template.value == field.value
                                )?.label
                              : "Chọn đơn..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command className="w-full">
                            <Input
                              placeholder={`Tìm đơn...`}
                              className="
                              placeholder:text-muted-foreground flex h-10 w-full rounded-none
                              bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 border-0
                               "
                              onChange={(e) => {
                                setSearchParams(e.target.value);
                              }}
                            />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy form.</CommandEmpty>
                              <CommandGroup>
                                {templates
                                  .filter((template) => {
                                    return template.label
                                      .toLowerCase()
                                      .includes(searchParams.toLowerCase());
                                  })
                                  .map((template) => (
                                    <CommandItem
                                      key={template.value}
                                      value={template.value}
                                      onSelect={field.onChange}
                                    >
                                      {template.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          field.value == template.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Điều kiện & điều khoản nhận nuôi</FormLabel>
                    <FormDescription>
                      Lưu ý: Nếu đã chọn mẫu đơn, nội dung dưới đây sẽ được thay
                      bằng điều khoản của mẫu đó.
                    </FormDescription>

                    <FormControl>
                      <MinimalTiptapEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        className="w-full"
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Điều kiện & điều khoản nhận nuôi..."
                        autofocus={true}
                        hideToolbar={false}
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
                <Button variant="outline" onClick={() => form.reset()}>
                  Hủy
                </Button>
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
