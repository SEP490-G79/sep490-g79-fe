import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dock, DockIcon } from "@/components/ui/magicui/dock";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AppContext from "@/context/AppContext";

import type { GoongSuggestion } from "@/utils/AddressInputWithGoong";
import useAuthAxios from "@/utils/authAxios";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { set } from "date-fns";
import {
  CheckSquare,
  Eye,
  MessageCircleX,
  NotepadTextDashed,
  PenBox,
  PenLine,
  SaveAllIcon,
  Send,
  Signature,
  SquareChevronDown,
  SquareChevronUp,
  SquareX,
  Upload,
  X,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { fi } from "zod/v4/locales";
import Preview from "./Preview";
import type { ConsentForm } from "@/types/ConsentForm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConsentForm() {
  const { shelterId, consentFormId } = useParams();
  const { coreAPI, shelterConsentForms, setShelterConsentForms } =
    useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [consentForm, setConsentForm] = React.useState<ConsentForm>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<
    GoongSuggestion[]
  >([]);
  const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY;

  type FormValues = z.infer<typeof FormSchema>;

  const FormSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    tokenMoney: z.coerce
      .number({
        invalid_type_error: "Số tiền phải là một số",
        required_error: "Số tiền không được để trống",
      })
      .min(0, "Số tiền phải lớn hơn hoặc bằng 0")
      .max(1000000000, "Số tiền không được quá 1 tỷ đồng"),
    deliveryMethod: z.string().min(1),
    note: z.string(),
    address: z.string().min(1, "Địa chỉ không được để trống"),
    commitments: z.string().min(1, "Cam kết không được để trống"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: consentForm?.title || "",
      tokenMoney: consentForm?.tokenMoney || 0,
      deliveryMethod: consentForm?.deliveryMethod || "pickup",
      note: consentForm?.note || "",
      address: consentForm?.address || "",
      commitments:
        consentForm?.commitments || "Điền các cam kết của người nhận nuôi.",
    },
  });

  const fetchConsentForm = async () => {
    setIsLoading(true);
    await authAxios
      .get(`${coreAPI}/shelters/${shelterId}/consentForms/get-by-shelter`)
      .then((res) => {
        setShelterConsentForms(res.data);
        const data = res.data.find(
          (item: ConsentForm) => item._id == consentFormId
        );

        setConsentForm(data);
        // const attachments = data.attachments.map((attachment: any) => {
        //   return new File([attachment], attachment.fileName, {
        //     type: attachment.mimeType,
        //   });
        // });
        // console.log(attachments);

        // setFiles(attachments);
        // console.log(data);

        form.reset({
          title: data.title,
          tokenMoney: data.tokenMoney,
          deliveryMethod: data.deliveryMethod,
          note: data.note,
          address: data.address,
          commitments: data.commitments,
        });
      })
      .catch((err) => {
        // console.error("Error fetching consent forms:", err);
        toast.error(
          err.response?.data?.message ||
            "Không thể tải bản đồng ý nhận nuôi! Vui lòng thử lại sau."
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };

  useEffect(() => {
    if (shelterId && consentFormId) {
      fetchConsentForm();
    }
  }, [shelterId, consentFormId]);

  const fetchAddressSuggestions = async (query: string) => {
    if (!query.trim()) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const res = await axios.get("https://rsapi.goong.io/Place/AutoComplete", {
        params: {
          input: query,
          api_key: GOONG_API_KEY,
        },
      });
      setAddressSuggestions(res.data.predictions || []);
    } catch (error) {
      console.error("Autocomplete failed:", error);
    }
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" không được chấp nhận.`,
    });
  }, []);
  const onSubmit = async (values: FormValues) => {
    // console.log("Form submitted:", values);
    setBtnLoading(true);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("tokenMoney", values.tokenMoney.toString());
    formData.append("deliveryMethod", values.deliveryMethod);
    formData.append("note", values.note);
    formData.append("address", values.address);
    formData.append("commitments", values.commitments);
    files.forEach((file) => {
      formData.append("attachments", file);
    });

    // console.log(files);

    await authAxios
      .put(
        `${coreAPI}/shelters/${shelterId}/consentForms/${consentFormId}/edit`,
        formData
      )
      .then((res) => {
        const updatedConsentForm = res.data;
        setConsentForm(updatedConsentForm);
        toast.success("Cập nhật bản đồng ý nhận nuôi thành công!");
      })
      .catch((err) => {
        // console.error("Error updating consent form:", err);
        toast.error(
          err.response?.data?.message ||
            "Không thể cập nhật bản đồng ý nhận nuôi! Vui lòng thử lại sau."
        );
        form.reset();
      })
      .finally(() => {
        setTimeout(() => {
          setBtnLoading(false);
          setIsLoading(false);
        }, 200);
      });
  };

  const handleChangeStatus = async (status: string) => {
    // console.log(status);
    setIsLoading(true);
    await authAxios
      .put(
        `${coreAPI}/shelters/${shelterId}/consentForms/${consentForm?._id}/change-status-shelter`,
        { status }
      )
      .then((res) => {
        setConsentForm(res.data);
        toast.success("Cập nhật trạng thái thành công!");
      })
      .catch((err) => {
        // console.log("Consent form error:"+err);
        toast.error(
          err.response?.data?.message || "Lỗi khi chuyển đổi trạng thái!"
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };
  const DATA = {
    navbar: [
      {
        href: "#",
        icon: <SquareChevronUp className="size-5 " />,
        label: "Lên trên đầu trang",
        function: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        href: "#",
        icon: <SaveAllIcon className="size-5 " />,
        label: "Lưu",
        function: () => {
          form.handleSubmit(onSubmit)();
        },
      },
      {
        href: "#",
        icon: <SquareChevronDown className="size-5 " />,
        label: "Xuống dưới trang",
        function: () => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        },
      },
    ],
  };

  const mockStatus = [
    {
      value: "draft",
      label: "Đang chuẩn bị",
      color: "secondary",
      icon: <NotepadTextDashed size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "send",
      label: "Chờ phản hồi",
      color: "chart-3",
      icon: <Send size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "accepted",
      label: "Đã chấp nhận",
      color: "chart-2",
      icon: <CheckSquare size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "approved",
      label: "Đã xác nhận",
      color: "chart-4",
      icon: <Signature size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "rejected",
      label: "Yêu cầu sửa",
      color: "chart-1",
      icon: <MessageCircleX size={"15px"} strokeWidth={"2px"} />,
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "destructive",
      icon: <SquareX size={"15px"} strokeWidth={"2px"} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full flex flex-wrap animate-pulse">
        <div className="basis-full">
          {/* Tabs */}
          <Tabs defaultValue="edit" className="w-full">
            <TabsList>
              <TabsTrigger value="edit">
                <Skeleton className="h-5 w-20" />
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Skeleton className="h-5 w-24" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <div className="w-full flex flex-wrap">
                {/* Header */}
                <div className="basis-full mb-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </div>

                <Separator className="my-4" />

                {/* Form grid */}
                <div className="basis-full grid grid-cols-5 gap-2">
                  {/* Left: các trường input chiếm 4 cột */}
                  <div className="col-span-4 space-y-4">
                    {/* Tiêu đề */}
                    <Skeleton className="h-10 w-full" />

                    {/* Tiền vía & Địa chỉ */}
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-10 w-full col-span-1" />
                      <Skeleton className="h-10 w-full col-span-3" />
                    </div>

                    {/* Phương thức & Ghi chú */}
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-10 w-full col-span-1" />
                      <Skeleton className="h-24 w-full col-span-3" />
                    </div>

                    {/* Cam kết (tiptap) */}
                    <Skeleton className="h-40 w-full" />

                    {/* Attachments */}
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-20 w-20" />
                        <Skeleton className="h-20 w-20" />
                      </div>
                    </div>
                  </div>

                  {/* Right: dock navbar */}
                  <div className="col-span-1 flex justify-center">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="p-4">
                <Skeleton className="h-40 w-full" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap">
      <div className="basis-full">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList>
            <TabsTrigger value="edit">
              <PenLine /> Chỉnh sửa
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye /> Xem trước
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <div className="w-full flex flex-wrap">
              <div className="basis-full flex justify-between">
                <div className=" flex gap-2">
                  <span className="text-2xl font-medium">
                    {consentForm?.title}
                  </span>
                  <Badge className={`rounded-3xl px-3`} variant={"outline"}>
                    <span className="flex gap-1">
                      {
                        mockStatus.find(
                          (s) =>
                            s.value.toUpperCase() ==
                            consentForm?.status.toUpperCase()
                        )?.icon
                      }
                      {
                        mockStatus.find(
                          (s) =>
                            s.value.toUpperCase() ==
                            consentForm?.status.toUpperCase()
                        )?.label
                      }
                    </span>
                  </Badge>
                </div>
                <div>
                  {/* <Select onValueChange={(value) => handleChangeStatus(value)}>
                    <SelectTrigger className="w-1/8">
                      <span>
                        {
                          mockStatus.find(
                            (s) =>
                              s.value.toUpperCase() ==
                              consentForm?.status?.toUpperCase()
                          )?.label
                        }
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Trạng thái</SelectLabel>
                        {mockStatus?.map((status) => {
                          return (
                            <SelectItem
                              key={status.value}
                              value={status.value}
                              disabled={status.disabled}
                            >
                              {status.label}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                  {consentForm?.status == "draft" && (
                    <Button
                      variant={"ghost"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        handleChangeStatus("send");
                      }}
                    >
                      <Send className="text-(--primary)" /> Gửi
                    </Button>
                  )}
                  {consentForm?.status == "accepted" && (
                    <Button
                      variant={"ghost"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        handleChangeStatus("approved");
                      }}
                    >
                      <Signature className="text-(--primary)" /> Xác nhận
                    </Button>
                  )}
                  {consentForm?.status == "rejected" && (
                    <Button
                      variant={"ghost"}
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        handleChangeStatus("draft");
                      }}
                    >
                      <PenBox className="text-(--primary)" /> Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="basis-full grid grid-cols-5 gap-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="col-span-4"
                  >
                    <div className="grid grid-1 md:grid-cols-4 gap-4 my-3">
                      <FormItem className="md:col-span-2 self-start">
                        <FormLabel>Người nhận nuôi</FormLabel>
                        <FormControl>
                          <Input value={consentForm?.shelter?.name} disabled />
                        </FormControl>
                      </FormItem>

                      <FormItem className="md:col-span-2 self-start">
                        <FormLabel>Thú nuôi</FormLabel>
                        <FormControl>
                          <Input value={consentForm?.pet?.name} disabled />
                        </FormControl>
                      </FormItem>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3 self-start">
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tiêu đề ..."
                                {...field}
                                disabled={consentForm?.status != "draft"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tokenMoney"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1 flex-col justify-between self-start">
                            <FormLabel>Tiền vía</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Nhập tiền vía"
                                {...field}
                                disabled={consentForm?.status != "draft"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3 self-start">
                            <FormLabel>Địa chỉ</FormLabel>

                            <div className="relative">
                              <FormControl>
                                <Input
                                  placeholder="Nhập địa chỉ"
                                  {...field}
                                  disabled={consentForm?.status != "draft"}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    fetchAddressSuggestions(e.target.value);
                                  }}
                                />
                              </FormControl>

                              {addressSuggestions.length > 0 && (
                                <ul
                                  className="absolute z-10 mt-1 w-full bg-(--background) border border-(--border) rounded-md shadow-lg overflow-hidden"
                                  role="listbox"
                                >
                                  {addressSuggestions.map((suggestion, idx) => (
                                    <li
                                      key={idx}
                                      role="option"
                                      className="px-3 py-2 hover:bg-(--background) cursor-pointer text-sm"
                                      onClick={() => {
                                        field.onChange(suggestion.description);
                                        setAddressSuggestions([]);
                                      }}
                                    >
                                      {suggestion.description}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryMethod"
                        render={({ field }) => (
                          <FormItem className="md:col-span-1 self-start">
                            <FormLabel>Phương thức vận chuyển</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={consentForm?.status != "draft"}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn phương thức vận chuyển" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pickup">
                                  Tự đến nhận
                                </SelectItem>
                                <SelectItem value="delivery">
                                  Giao tận nơi
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3 self-start">
                            <FormLabel>Ghi chú</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập ghi chú"
                                {...field}
                                disabled={consentForm?.status != "draft"}
                                cols={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                      {consentForm?.note && (
                        <FormItem className="md:col-span-3 self-start">
                          <FormLabel>Ghi chú của người nhận nuôi</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập ghi chú"
                              disabled={true}
                              value={consentForm?.note}
                              cols={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      <FormField
                        control={form.control}
                        name="commitments"
                        render={({ field }) => (
                          <FormItem className="col-span-4">
                            <FormLabel>Cam kết của người nhận nuôi</FormLabel>
                            <FormControl className="w-full">
                              <MinimalTiptapEditor
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="w-full h-full"
                                editorContentClassName="p-5 overflow-y-none "
                                output="html"
                                placeholder="Enter your description..."
                                editable={true}
                                hideToolbar={false}
                                editorClassName="focus:outline-hidden"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* <FormItem className="md:col-span-4">
                        <FormLabel>Tệp đính kèm</FormLabel>
                        <div className="flex justify-center">
                          <FileUpload
                            value={files}
                            onValueChange={setFiles}
                            onFileReject={onFileReject}
                            maxFiles={2}
                            className="w-full"
                            multiple
                          >
                            <FileUploadDropzone>
                              <div className="flex flex-col items-center gap-1 text-center">
                                <div className="flex items-center justify-center rounded-full border p-2.5">
                                  <Upload className="size-6 text-muted-foreground" />
                                </div>
                                <p className="font-medium text-sm">
                                  Kéo thả tệp đính kèm ở đây!
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  Hoặc tải tệp đính kèm lên từ thiết bị của bạn
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  (Tối đa 2 tệp đính kèm)
                                </p>
                              </div>
                              <FileUploadTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 w-fit"
                                >
                                  Tải tệp đính kèm lên
                                </Button>
                              </FileUploadTrigger>
                            </FileUploadDropzone>
                            <FileUploadList>
                              {files.map((file, index) => (
                                <FileUploadItem
                                  key={index}
                                  value={file}
                                  className="flex-col"
                                >
                                  <div className="flex w-full items-center gap-2">
                                    <FileUploadItemPreview />
                                    <FileUploadItemMetadata />
                                     <Button variant={"outline"}>okok</Button> 

                                    <FileUploadItemDelete asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-7"
                                        disabled={btnLoading}
                                      >
                                        <X />
                                      </Button>
                                    </FileUploadItemDelete>
                                  </div>
                                </FileUploadItem>
                              ))}
                            </FileUploadList>
                          </FileUpload>
                        </div>
                      </FormItem> */}
                    </div>
                  </form>
                </Form>
                <div className="col-span-1 flex justify-center">
                  <TooltipProvider>
                    <div className="bg-(--secondary)/10 sticky top-20 space-y-6 flex flex-col py-2 border-1 border-(--border) shadow  rounded-sm h-fit w-fit p-2 ">
                      {DATA.navbar.map((item, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={item.function}
                              variant="ghost"
                              className="hover:text-(--primary) p-0"
                            >
                              {item.icon}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Preview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
