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
import type { MissionForm } from "@/types/MissionForm";
import { set } from "date-fns";

type Props = {
  submission: MissionForm | undefined;
   open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function CreateDialog({ submission, open, onOpenChange }: Props) {
  const { coreAPI } = useContext(AppContext);

  const { shelterId } = useParams();
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [btnLoading, setBtnLoading] = useState(false);

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
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      tokenMoney: submission?.adoptionForm?.pet?.tokenMoney || 0,
      deliveryMethod: "pickup",
      note: "",
      address: submission?.performedBy?.address || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log("Form submitted:", values);
    await authAxios
      .post(`${coreAPI}/shelters/${shelterId}/consentForms/create-form`, {
        title: values.title,
        tokenMoney: values.tokenMoney,
        deliveryMethod: values.deliveryMethod,
        commitments:
          '<ol class="list-node"><li><p class="text-node"><strong>Không nuôi thú cưng với mục đích sinh sản</strong> hoặc các mục đích thương mại như trông nhà, trông vườn, làm đồ chơi, bãi xe...</p></li><li><p class="text-node"><strong>Đồng ý đóng góp một khoản phí tự nguyện</strong> (nếu có), được trạm sử dụng cho các chi phí:</p><ul class="list-node"><li><p class="text-node">Giải cứu, chữa trị, tiêm phòng cho thú cưng;</p></li><li><p class="text-node">Duy trì hoạt động cứu hộ, chăm sóc các thú cưng chưa có gia đình mới.</p></li></ul></li><li><p class="text-node"><strong>Cam kết tiêm phòng đầy đủ cho thú cưng</strong>, ít nhất 2 mũi phòng bệnh cơ bản tại phòng khám thú y gần nơi ở. Nếu tiêm tại trạm cứu hộ, sẽ được cấp sổ tiêm để tiếp tục theo dõi.</p></li><li><p class="text-node"><strong>Thường xuyên cập nhật tình trạng của thú cưng trong 6 tháng đầu</strong>, thông qua nhóm Zalo (gửi ảnh, video, nhật ký, v.v.). Tình nguyện viên của trạm có thể ghé thăm bất ngờ để kiểm tra điều kiện sống.</p></li><li><p class="text-node"><strong>Không được tặng, bán thú cưng dưới bất kỳ hình thức nào.</strong> Nếu không thể tiếp tục nuôi, tôi/chúng tôi sẽ hoàn trả lại thú cưng cho trạm.</p></li><li><p class="text-node"><strong>Thông báo rõ ràng với trạm nếu đưa thú cưng đi nơi khác</strong> (ví dụ gửi người thân, gửi tạm thời...), và chỉ thực hiện sau khi có sự đồng ý từ trạm.</p></li><li><p class="text-node"><strong>Hợp tác khi thú cưng bị bệnh nặng hoặc tôi/chúng tôi không còn khả năng chăm sóc.</strong> Trạm sẽ hỗ trợ tối đa nếu có thể.</p></li><li><p class="text-node"><strong>Cung cấp thông tin cá nhân minh bạch</strong> (CMND/CCCD) để xác minh thân nhân khi cần thiết hoặc khi trạm yêu cầu.</p></li><li><p class="text-node"><span>….</span><br></p></li></ol><p class="text-node"></p>',
        note: values.note,
        address: values.address,
        petId: submission?.adoptionForm?.pet?._id,
        adopterId: submission?.performedBy?._id,
      })
      .then((res) => {
        toast.success(
          `Tạo bản đòng ý thành công. Đang chuyển hướng đến bản đòng ý nhận nuôi!`
        );
        navigate(
          `/shelters/685f5ab190842987ab51901a/management/consent-forms/${res.data._id}`
        );
      })
      .catch((error) => {
        // console.log("Create consent form:"+ error);
        toast.error(
          error?.response?.data?.message || "Lỗi khi tạo bản đồng ý nhận nuôi!"
        );
      });
  };

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" không được chấp nhận.`,
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <span className="text-xs flex items-center gap-2">
          <PlusSquare className="text-(--primary) w-4 h-4 " />
          Tạo mới
        </span>
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
                  <Input
                    type="text"
                    value={submission?.adoptionForm?.pet?.name}
                    disabled
                  />
                </FormControl>
              </FormItem>

              <FormItem className="md:col-span-2">
                <FormLabel>Tên người nhận</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder=""
                    value={submission?.performedBy?.fullName}
                    disabled
                  />
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
                        type="text"
                        placeholder="Nhập tiêu đề ..."
                        {...field}
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
                      <Input
                        type="text"
                        placeholder="Nhập địa chỉ"
                        {...field}
                      />
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
                        <SelectItem value="delivery">Giao tận nơi</SelectItem>
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
                        cols={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
