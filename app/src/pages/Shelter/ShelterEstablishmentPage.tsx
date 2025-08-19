import { useContext, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Loader2Icon, MoreHorizontal, PlusSquare, RefreshCcw, Search, X } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import type { ColumnDef } from "@tanstack/react-table";
import type { ShelterEstablishmentRequest } from "@/types/ShelterEstablishmentRequest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import generateCodename from "@/utils/shelterCodeGenerator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddressInputWithGoong from "@/utils/AddressInputWithGoong";
import { DataTable } from "@/components/data-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


const shelterEstablishmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Tên trạm không được để trống")
    .regex(/^[^\d]*$/, "Tên trạm không được chứa số"),
  shelterCode: z.string().min(3, "Mã trạm phải có ít nhất 3 kí tự"),
  hotline: z
  .string()
  .trim()
  .regex(
    /^((\+84)|0)(3|5|7|8|9)\d{8}$/,
    "Hotline không đúng định dạng số điện thoại Việt Nam"
  ),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(3, "Vui lòng nhập địa chỉ đầy đủ"),
  aspiration: z.string().min(10, "Vui lòng nhập nguyện vọng rõ ràng"),
  shelterLicense: z
  .any()
  .refine((file) => file instanceof File || (file && file.length > 0), {
    message: "Vui lòng chọn giấy phép hoạt động",
  })
  .refine((file) => {
    const targetFile = file instanceof File ? file : file?.[0];
    return targetFile && targetFile.size <= 10 * 1024 * 1024;
  }, {
    message: "Dung lượng giấy phép không được vượt quá 10MB",
  }),
  commitment: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với cam kết trước khi gửi",
  }),
});

interface eligibleToRequest{
  isEligible: boolean;
  reason: string;
}

type detailDialogData = {
  isOpen: boolean;
  detail: {
    name: string;
    shelterCode: string;
    hotline: string;
    email: string;
    address: string;
    aspiration: string;
    shelterLicenseURL: string;
    status: string;
    rejectReason: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

const ShelterEstablishmentPage = () => {
    const [eligibleToRequest, setEligibleToRequest] = useState<eligibleToRequest>(); // du dieu kien de gui request
    const [requestList, setRequestList] = useState<ShelterEstablishmentRequest[]>([]);
    const [filteredRequestList, setFilteredRequestList] = useState<ShelterEstablishmentRequest[]>([]);
    const [submitLoading, setSubmitLoading] = useState<Boolean>(false);
    const authAxios = useAuthAxios();
    const {shelterAPI} = useContext(AppContext)
    const [detailDialog, setDetailDialog] = useState<detailDialogData>({
      isOpen: false,
      detail: {
        name: "",
        shelterCode: "",
        hotline: "",
        email: "",
        address: "",
        aspiration: "",
        shelterLicenseURL: "",
        status: "verifying",
        rejectReason: "No reason",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const [location, setLocation] = useState({ lat: 0, lng: 0 });
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");

  const form = useForm<z.infer<typeof shelterEstablishmentSchema>>({
    resolver: zodResolver(shelterEstablishmentSchema),
    defaultValues: {
      name: "",
      shelterCode: "",
      hotline: "",
      email: "",
      address: "",
      aspiration: "",
      shelterLicense: "",
      commitment: false,
    },
  });

  const { setValue } = form

  useEffect(() => {
    authAxios
      .get(`${shelterAPI}/get-shelter-request`)
      .then(({ data }) => {
        setRequestList(data?.shelterRequest);
        setFilteredRequestList(data?.shelterRequest);
        setEligibleToRequest({
          isEligible: data?.isEligible,
          reason: data?.reason,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  // tu dong gen shelter code
  const nameValue = useWatch({ control: form.control, name: "name" });
  useEffect(() => {
    if (nameValue) {
      form.setValue("shelterCode", generateCodename(nameValue));
    }
  }, [nameValue]);

  function handleSearch (value : string){
    if(value.trim().length < 1){
      setFilteredRequestList(requestList);
    }else{
      const searchedList = requestList.filter(request => {
        if(request.name && request.name.toLowerCase().includes(value.toLowerCase()) ||
          request.email && request.email.toLowerCase().includes(value.toLowerCase())  ||
          request.hotline && request.hotline.toLowerCase().includes(value.toLowerCase())  ||
          request.address &&  request.address.toLowerCase().includes(value.toLowerCase()) ){
          return request;
        }
      })
      setFilteredRequestList(searchedList);
    }
  }


  const columns: ColumnDef<ShelterEstablishmentRequest>[] = [
    {
      header: "STT",
      cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Tên trạm cứu hộ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className="px-2 block max-w-[9vw] truncate">{row.original.name}</span>;
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className="px-2 block max-w-[9vw] truncate">{row.original.email}</span>;
      },
    },
    {
      accessorKey: "hotline",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Hotline
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <span className="px-2 block max-w-[9vw] truncate">{row.original.hotline}</span>;
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Địa chỉ
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span
            className="px-2 block max-w-[9vw] truncate"
            title={row.original.address}
          >
            {row.original.address}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Trạng thái
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.original.status;
        let statusTiengViet = "";
        if (status === "active") {
          statusTiengViet = "Chấp thuận";
          return (
            <Badge variant="default" className="mx-2">
              {statusTiengViet}
            </Badge>
          );
        } else if (status === "verifying") {
          statusTiengViet = "Chờ duyệt";
          return (
            <Badge variant="secondary" className="mx-2">
              {statusTiengViet}
            </Badge>
          );
        } else if (status === "banned") {
          statusTiengViet = "Bị cấm";
          return (
            <Badge variant="destructive" className="mx-2">
              {statusTiengViet}
            </Badge>
          );
        } else if (status === "cancelled") {
          statusTiengViet = "Hủy bỏ";
          return (
            <Badge variant="destructive" className="mx-2">
              {statusTiengViet}
            </Badge>
          );
        } else {
          statusTiengViet = "Từ chối";
          return (
            <Badge variant="destructive" className="mx-2">
              {statusTiengViet}
            </Badge>
          );
        }
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="px-2">
          {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      accessorKey: "updateAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="cursor-pointer"
          >
            Ngày duyệt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="px-2">
          {row.original.status !== "verifying" &&
            new Date(row.original.updatedAt).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      header: "Hành động",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-40 rounded-md border bg-background shadow-lg p-1"
          >
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                onClick={() => {
                  setDetailDialog({
                    isOpen: true,
                    detail: {
                      name: row.original.name,
                      shelterCode: row.original.shelterCode,
                      hotline: row.original.hotline,
                      email: row.original.email,
                      address: row.original.address,
                      aspiration: row.original.aspiration,
                      shelterLicenseURL: row.original.shelterLicenseURL,
                      status: row.original.status,
                      rejectReason: row.original.rejectReason,
                      createdAt: row.original.createdAt,
                      updatedAt: row.original.updatedAt,
                    },
                  });
                }}
              >
                Xem thông tin chi tiết
              </DropdownMenuItem>
              {row.original.status === "verifying" && (
                <DropdownMenuItem
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                  onClick={() => handleCancelRequest(row.original.id)}
                >
                  Hủy yêu cầu
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];


  const handleSubmitRequest = async (
    values: z.infer<typeof shelterEstablishmentSchema>
  ) => {
    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("shelterCode", values.shelterCode);
      formData.append("hotline", values.hotline);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("shelterLicense", values.shelterLicense);
      formData.append("aspiration", values.aspiration);
      formData.append("location", JSON.stringify(location));
      const response = await authAxios.post(`${shelterAPI}/send-shelter-request`, formData);
      toast.success(response?.data.message || "Gửi yêu cầu thành công");
      setRefresh((prev) => !prev);
      form.reset();
    } catch (err: any) {
      toast.error(err?.response.data.message || "Lỗi gửi yêu cầu thành lập trạm cứu hộ");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancelRequest = async (shelterId: string) => {
    try {
      await authAxios.put(`${shelterAPI}/cancel-shelter-request/${shelterId}`);
      toast.success("Hủy yêu cầu thành công");
      setRefresh((prev) => !prev);
    } catch (error: any) {
      console.log(error?.response.data.message);
      toast.error(error?.response.data.message || "Lỗi hủy yêu cầu");
    }
  };

  return (
    <div className="flex flex-1 flex-col py-6 px-40">
      <Breadcrumb className="container mb-3 py-1 px-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              Yêu cầu thành lập trạm cứu hộ
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Yêu cầu thành lập trạm cứu hộ của bạn
          </h4>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Input
                className="w-80 pr-9"
                type="string"
                placeholder="Tìm kiếm theo tên, email, hotline, địa chỉ"
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(searchValue);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => handleSearch(searchValue)}
                className="cursor-pointer"
              >
                <Search /> Tìm kiếm
              </Button>
              {eligibleToRequest?.isEligible ? (
                <Dialog
                  onOpenChange={(open) => {
                    if (!open) {
                      form.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-xs cursor-pointer">
                      <PlusSquare className="text-(--primary)" />
                      Tạo yêu cầu mới
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-3xl !max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Đơn yêu cầu thành lập trạm cứu hộ
                      </DialogTitle>
                      <DialogDescription>
                        Vui lòng nhập thông tin chính xác và kiểm tra kĩ trước
                        khi gửi đơn. Sau khi gửi sẽ không chỉnh sửa đơn được.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="px-5 py-3">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleSubmitRequest)}
                          className="space-y-6"
                          encType="multipart/form-data"
                        >
                          {/* Grid 2 columns */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column */}
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tên trạm cứu hộ <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Nhập tên trạm"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shelterCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mã trạm cứu hộ <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        // disabled
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="hotline"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Hotline <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Nhập số hotline"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="example@email.com"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {/* Right column */}
                            <div className="space-y-4">
                              <FormField
                                  control={form.control}
                                  name="address"
                                  render={({ field }) => (
                                    <AddressInputWithGoong
                                      value={field.value}
                                      onChange={(val) => {
                                        field.onChange(val);
                                        setValue("address", val);
                                      }}
                                      onLocationChange={(loc) => setLocation(loc)}
                                      error={
                                        form.formState.errors.address?.message
                                      }
                                      isRequired={true}
                                    />
                                  )}
                              />
                              <FormField
                                control={form.control}
                                name="aspiration"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nguyện vọng thành lập <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Tôi muốn thành lập để..."
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shelterLicense"
                                render={({ field: { onChange } }) => (
                                  <FormItem>
                                    <FormLabel>Giấy phép hoạt động <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                      <Input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                          if (
                                            e.target.files &&
                                            e.target.files.length > 0
                                          ) {
                                            onChange(e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          {/* Commitment */}
                          <FormField
                            control={form.control}
                            name="commitment"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start gap-2 mt-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    id="commitment"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel htmlFor="commitment">
                                    Tôi đã xem và cam kết tuân thủ nội dung
                                    trong bản cam kết. 
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="link"
                                          className="text-blue-600 p-0 h-auto"
                                        >
                                          Xem cam kết
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="w-full max-w-4xl !max-w-4xl">
                                        <DialogHeader>
                                          <DialogTitle className="text-xl font-semibold text-center">
                                            Nội dung cam kết
                                          </DialogTitle>
                                          <DialogDescription className="mt-4 max-h-[60vh] overflow-y-auto space-y-4 text-sm text-card-foreground leading-relaxed pr-2">
                                            <p className="font-medium">
                                              1. Cam kết về thông tin cung cấp:
                                            </p>
                                            <ul className="list-disc list-inside pl-4">
                                              <li>
                                                Tôi chịu trách nhiệm hoàn toàn
                                                về tính chính xác, trung thực và
                                                đầy đủ của tất cả các thông tin
                                                đã khai báo trong biểu mẫu yêu
                                                cầu thành lập trạm cứu hộ.
                                              </li>
                                              <li>
                                                Tôi hiểu rằng việc cung cấp
                                                thông tin sai lệch, giả mạo có
                                                thể dẫn đến việc từ chối yêu cầu
                                                và/hoặc bị xử lý theo quy định
                                                của pháp luật hiện hành.
                                              </li>
                                            </ul>
                                            <p className="font-medium">
                                              2. Cam kết về mục đích hoạt động:
                                            </p>
                                            <ul className="list-disc list-inside pl-4">
                                              <li>
                                                Mục tiêu thành lập trạm cứu hộ
                                                là vì mục đích nhân đạo, bảo vệ
                                                và chăm sóc động vật bị bỏ rơi,
                                                bị thương hoặc trong tình trạng
                                                nguy cấp.
                                              </li>
                                              <li>
                                                Trạm hoạt động phi lợi nhuận,
                                                không thực hiện các hoạt động
                                                mua bán động vật trái phép.
                                              </li>
                                            </ul>
                                            <p className="font-medium">
                                              3. Cam kết về pháp lý và đạo đức:
                                            </p>
                                            <ul className="list-disc list-inside pl-4">
                                              <li>
                                                Tôi cam kết tuân thủ đầy đủ các
                                                quy định của pháp luật liên quan
                                                đến quyền động vật, an toàn sinh
                                                học và môi trường.
                                              </li>
                                              <li>
                                                Tôi không sử dụng hình ảnh, danh
                                                nghĩa trạm cứu hộ cho các mục
                                                đích lừa đảo, quảng bá sai sự
                                                thật hoặc các hoạt động gây ảnh
                                                hưởng tiêu cực đến cộng đồng.
                                              </li>
                                            </ul>
                                            <p className="font-medium">
                                              4. Cam kết phối hợp và kiểm tra:
                                            </p>
                                            <ul className="list-disc list-inside pl-4">
                                              <li>
                                                Tôi sẵn sàng hợp tác với cơ quan
                                                quản lý, tổ chức kiểm tra, thanh
                                                tra trong quá trình hoạt động
                                                của trạm.
                                              </li>
                                              <li>
                                                Nếu được yêu cầu, tôi sẽ cung
                                                cấp thêm giấy tờ chứng minh năng
                                                lực, điều kiện hoạt động và hồ
                                                sơ liên quan khác.
                                              </li>
                                            </ul>
                                            <p>
                                              Nếu vi phạm bất kỳ điều khoản nào
                                              trong cam kết này, sẽ phải chịu
                                              mọi hình thức xử lý theo quy định
                                              của hệ thống và pháp luật.
                                            </p>
                                          </DialogDescription>
                                        </DialogHeader>
                                      </DialogContent>
                                    </Dialog>
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                          {/* Footer */}
                          <DialogFooter className="pt-4">
                            <DialogClose asChild>
                              <Button
                                variant="secondary"
                                className="cursor-pointer"
                              >
                                Đóng
                              </Button>
                            </DialogClose>
                            {submitLoading ? (
                              <Button disabled>
                                <>
                                  <Loader2Icon className="animate-spin mr-2" />
                                  Vui lòng chờ
                                </>
                              </Button>
                            ) : (
                              <Button type="submit" className="cursor-pointer">
                                Gửi yêu cầu
                              </Button>
                            )}
                          </DialogFooter>
                        </form>
                      </Form>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <p className="scroll-m-20 text-md font-semibold tracking-tight text-destructive my-auto">
                  {eligibleToRequest?.reason}
                </p>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="cursor-pointer"
                  onClick={() => setRefresh((prev) => !prev)}
                >
                  <RefreshCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={filteredRequestList ?? []} />
        </div>
      </div>

      {/* Dialog chi tiet */}
      <Dialog
        open={detailDialog.isOpen}
        onOpenChange={(open) =>
          setDetailDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              Đơn yêu cầu thành lập trạm cứu hộ
            </DialogTitle>
            <DialogDescription className="text-center">
              Dưới đây là các thông tin chi tiết được cung cấp trong đơn yêu
              cầu.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-3 text-sm">
            <div>
              <span className="font-medium">Tên trạm cứu hộ:</span>{" "}
              {detailDialog?.detail.name || (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Mã trạm cứu hộ:</span>{" "}
              {detailDialog?.detail.shelterCode || (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Hotline:</span>{" "}
              {detailDialog?.detail.hotline || (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Email:</span>{" "}
              {detailDialog?.detail.email || (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Địa chỉ:</span>{" "}
              {detailDialog?.detail.address || (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Nguyện vọng:</span>{" "}
              {detailDialog?.detail.aspiration || (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Giấy phép hoạt động:</span>{" "}
              {detailDialog?.detail.shelterLicenseURL ? (
                <a
                  href={detailDialog?.detail.shelterLicenseURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Xem chi tiết
                </a>
              ) : (
                <span className="italic text-muted">Chưa có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Trạng thái:</span>{" "}
              {(detailDialog?.detail.status && (
                <Badge
                  variant={
                    ["verifying", "active"].includes(
                      detailDialog?.detail.status
                    )
                      ? "default"
                      : "destructive"
                  }
                >
                  {detailDialog?.detail.status === "verifying"
                    ? "Đang chờ duyệt"
                    : detailDialog?.detail.status === "active"
                    ? "Chấp thuận"
                    : "Từ chối"}
                </Badge>
              )) || <span className="italic text-muted">Chưa có</span>}
            </div>

            {detailDialog?.detail.rejectReason && (
              <div>
                <span className="font-medium">Lý do từ chối:</span>{" "}
                {detailDialog?.detail.rejectReason || (
                  <span className="italic text-muted">Không có lý do</span>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  setDetailDialog({ ...detailDialog, isOpen: false })
                }
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShelterEstablishmentPage;
