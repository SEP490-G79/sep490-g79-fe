import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ShelterEstablishmentRequest } from "@/types/ShelterEstablishmentRequest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";


const shelterEstablishmentSchema = z.object({
  name: z.string().trim().min(3, "Tên trạm không được để trống"),
  hotline: z
  .string()
  .trim()
  .min(3, "Vui lòng nhập số hotline đầy đủ")
  .regex(/^\d+$/, "Hotline chỉ được chứa số"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(3, "Vui lòng nhập địa chỉ đầy đủ"),
  shelterLicense: z
    .any()
    .refine((file) => file instanceof File || (file && file.length > 0), {
      message: "Vui lòng chọn giấy phép hoạt động",
    }),
});

interface eligibleToRequest{
  isEligible: boolean;
  reason: string;
}

const ShelterEstablishmentPage: React.FC = () => {
    const [eligibleToRequest, setEligibleToRequest] = useState<eligibleToRequest>(); // du dieu kien de gui request
    const [requestList, setRequestList] = useState<ShelterEstablishmentRequest[]>([]);
    const [submitLoading, setSubmitLoading] = useState<Boolean>(false);
    const [submittedData, setSubmittedData] = useState<any>(null);
    const authAxios = useAuthAxios();
    const {shelterAPI} = useContext(AppContext)

  const form = useForm<z.infer<typeof shelterEstablishmentSchema>>({
    resolver: zodResolver(shelterEstablishmentSchema),
    defaultValues: {
      name: "",
      hotline: "",
      email: "",
      address: "",
      shelterLicense: "",
    },
  });

  useEffect(() => {
    authAxios
      .get(`${shelterAPI}/get-shelter-request`)
      .then(({data}) => {
            setRequestList(data?.shelterRequest);
            setEligibleToRequest({
              isEligible: data?.isEligible,
              reason: data?.reason
            })
      })
      .catch((err) => {
        console.log(err)
      });
  }, []);

  const columns: ColumnDef<ShelterEstablishmentRequest>[] = [
      {
        header: "STT",
        cell: ({ row }) => <p className='text-center'>{row.index + 1}</p>
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Tên trạm cứu hộ
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({row}) => {
          return <span className='px-2'>{row.original.name}</span>
        }
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({row}) => {
          return <span className='px-2'>{row.original.email}</span>
        }
      },
      {
        accessorKey: "hotline",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Hotline
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({row}) => {
          return <span className='px-2'>{row.original.hotline}</span>
        }
      },
      {
        accessorKey: "address",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Địa chỉ
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({row}) => {
          return <span className='px-2'>{row.original.address}</span>
        }
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Trạng thái
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const status = row.original.status;
          let color = "";
          let statusTiengViet = "";
          if (status === "active") {
            statusTiengViet = "Chấp thuận";
            color = "text-green-500 font-semibold uppercase";
          } else if(status === "verifying"){
            statusTiengViet = "Chờ duyệt";
            color = "text-yellow-500 font-semibold uppercase";
          }else if(status === "banned"){
            statusTiengViet = "Bị cấm";
            color = "text-destructive font-semibold uppercase";
          }else{
            statusTiengViet = "Từ chối";
            color = "text-destructive font-semibold uppercase";
          }
          return <span className={color + " px-2"}>{statusTiengViet}</span>;
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Ngày tạo
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) =>
          <span className='px-2'>{new Date(row.original.createdAt).toLocaleDateString("vi-VN")}</span>
      },
            {
        accessorKey: "updateAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Ngày duyệt
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) =>
          <span className='px-2'>{row.original.status !== "verifying" && new Date(row.original.updatedAt).toLocaleDateString("vi-VN")}</span>
      }
    ];

  const onSubmit = async (values: z.infer<typeof shelterEstablishmentSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("hotline", values.hotline);
    formData.append("email", values.email);
    formData.append("address", values.address);
    formData.append("shelterLicense", values.shelterLicense);

    try {
        // formData.forEach((value, key) => {
        //   console.log(key, value);

        //   if (value instanceof File) {
        //     console.log("Tên file:", value.name);
        //     console.log("Loại file:", value.type);
        //     console.log("Kích thước:", value.size, "bytes");
        //   }
        // });
        setSubmitLoading(true);
        const response = await authAxios.post(`${shelterAPI}/send-shelter-request`, formData);
        if(response.status === 200){
            setTimeout(() => {
                setSubmitLoading(false)
                toast.success(response?.data.message || "Gửi yêu cầu thành công")
            }, 2000)
        }
    } catch (err : any) {
      toast.error(err?.response.data.message || err);
      setSubmitLoading(false);
    }
  };

  // if (existingRequest) {
  //   let trangThaiYeuCau = '';
  //   let styleYeuCau = "";
  //   if(existingRequest.status === "verifying"){
  //       trangThaiYeuCau = "Đang chờ duyệt"
  //       styleYeuCau = "font-semibold uppercase text-primary"
  //   }else if(existingRequest.status === "cancelled"){
  //       trangThaiYeuCau = "Từ chối"
  //       styleYeuCau = "font-semibold uppercase text-destructive"
  //   }else if(existingRequest.status === "banned"){
  //       trangThaiYeuCau = "Bị cấm"
  //       styleYeuCau = "font-semibold uppercase text-destructive"
  //   }else{
  //       trangThaiYeuCau = "Đã được phê duyệt"
  //       styleYeuCau = "font-semibold uppercase text-green-500"
  //   }
  //   return (
  //     <Card className="max-w-xl mx-auto mt-8">
  //       <CardHeader>
  //         <CardTitle className="font-bold text-lg text-center">Theo dõi trạng thái yêu cầu thành lập trạm cứu hộ</CardTitle>
  //       </CardHeader>
  //       <CardContent className="space-y-2 flex flex-col gap-2">
  //         <p><strong className="border border-2 rounded-sm px-2 py-1">Tên trạm:</strong> {existingRequest.name}</p>
  //         <p><strong className="border border-2 rounded-sm px-2 py-1">Hotline:</strong> {existingRequest.hotline}</p>
  //         <p><strong className="border border-2 rounded-sm px-2 py-1">Email:</strong> {existingRequest.email}</p>
  //         <p><strong className="border border-2 rounded-sm px-2 py-1">Địa chỉ:</strong> {existingRequest.address}</p>
  //         <p><strong className="border border-2 rounded-sm px-2 py-1">Trạng thái:</strong> <span className={styleYeuCau}>{trangThaiYeuCau}</span></p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <div className="flex flex-1 flex-col py-6 px-40">
      <Breadcrumb className="container mb-3 py-1 px-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Yêu cầu thành lập trạm cứu hộ</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Yêu cầu thành lập trạm cứu hộ của bạn
          </h4>
          <div className="flex flex-row gap-7">
            <Input
              className="max-w-1/3"
              type="string"
              placeholder="Tìm kiếm theo tên hoặc email"
              onChange={(e) => console.log("ok")}
            />
            {eligibleToRequest?.isEligible ? (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) {
                    form.reset();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    Tạo yêu cầu thành lập trạm cứu hộ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Đơn yêu cầu thành lập trạm cứu hộ
                    </DialogTitle>
                    <DialogDescription>
                      Vui lòng nhập thông tin chính xác và kiểm tra kĩ trước khi
                      gửi đơn. Sau khi gửi sẽ không chỉnh sửa đơn được.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-5 py-3">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                        encType="multipart/form-data"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên trạm cứu hộ</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập tên trạm" {...field} />
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
                              <FormLabel>Hotline</FormLabel>
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
                              <FormLabel>Email</FormLabel>
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

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa chỉ trạm cứu hộ</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Địa chỉ cụ thể"
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
                          render={({ field: { onChange, ...rest } }) => (
                            <FormItem>
                              <FormLabel>Giấy phép hoạt động</FormLabel>
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
                        <DialogFooter>
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
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={requestList ?? []} />
        </div>
      </div>
    </div>
  );
};

export default ShelterEstablishmentPage;
