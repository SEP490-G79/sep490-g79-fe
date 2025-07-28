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
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, PlusSquare, Upload, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type Attachment } from "@/types/ConsentForm";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { useNavigate, useParams } from "react-router-dom";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { toast } from "sonner";

export default function CreateDialog() {
  const { coreAPI } = useContext(AppContext);

  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [btnLoading, setBtnLoading] = useState(false);

  type FormValues = z.infer<typeof FormSchema>;

  const FormSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    tokenMoney: z
      .number()
      .min(0, "Số tiền phải lớn hơn hoặc bằng 0")
      .max(100000000, "Số tiền không được vượt quá 100 triệu"), 
    deliveryMethod: z.string().min(1),
    note: z.string(),
    address: z.string().min(1, "Địa chỉ không được để trống"),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      tokenMoney: 0,
      deliveryMethod: "pickup",
      note: "",
      address: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted:", values);
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" không được chấp nhận.`,
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-xs">
          <PlusSquare className="text-(--primary)" />
          Tạo mới
        </Button>
      </DialogTrigger>

      <DialogContent className=" min-w-4xl max-w-4xl max-h-5/6 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="items-center">
              <DialogTitle>Tạo bản đồng ý nhận nuôi</DialogTitle>
              <DialogDescription>
                Vui lòng điền đầy đủ thông tin cam kết nhận nuôi và tải lên các
                tài liệu liên quan.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-1 md:grid-cols-4  gap-4 my-3">
              <FormItem className="md:col-span-2">
                <FormLabel>Thú nuôi</FormLabel>
                <FormControl>
                  <Input type="text" value={""} disabled />
                </FormControl>
              </FormItem>

              <FormItem className="md:col-span-2">
                <FormLabel>Tên người nhận</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="" value={""} disabled />
                </FormControl>
              </FormItem>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-3 self-start">
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề ..." {...field} />
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
                        type="number"
                        placeholder="Nhập tiền vía"
                        {...field}
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
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
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
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phương thức vận chuyển" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Tự đến nhận</SelectItem>
                        <SelectItem value="delivery">
                          Giao tận nơi
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="md:col-span-3 self-start">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú"
                        {...field}
                        cols={3}
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
                          Kéo thả ảnh ở đây!
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Hoặc tải ảnh lên từ thiết bị của bạn
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
                          Tải ảnh lên
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

              {/* Attachments can be added here */}
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
