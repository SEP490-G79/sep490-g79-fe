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
import { ArrowUpDown, Ban, Loader2Icon, MoreHorizontal, RefreshCcw, RotateCcwKey } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ShelterEstablishmentRequest } from "@/types/ShelterEstablishmentRequest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { ShelterMember } from "@/types/ShelterMember";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ShelterStaffRequestInvitation } from "@/types/ShelterStaffRequestInvitation";
import { useParams } from "react-router-dom";
import { SearchFilter } from "@/components/SearchFilter";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {type  Shelter } from "@/types/Shelter";
import { EmailSelector } from "@/components/EmailSelector";
import { EmailRadioSelector } from "@/components/EmailRadioSelector";



const shelterRequest = z.object({
  email: z.string().email("Email không hợp lệ"),
});


type detailDialogData = {
  isOpen: boolean;
  detail: {
    requestType: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      avatar: string;
    };
    shelter: {
      id: string;
      name: string;
      email: string;
      avatar: string;
    };
    roles: string[];
    requestStatus: string;
    createdAt: Date;
    updatedAt: Date;
    expireAt: Date;
  };
};

const ShelterRequestsList = () => {
    const [invitationsList, setInvitationsList] = useState<ShelterStaffRequestInvitation[]>([]);
    const [filtererdInvitationsList, setFiltererdInvitationsList] = useState<ShelterStaffRequestInvitation[]>([]);
    const [loadingButton, setLoadingButton] = useState<Boolean>(false);
    const [detailDialog, setDetailDialog] = useState<detailDialogData>({
      isOpen: false,
      detail: {
        requestType: "",
        shelter: {
          id: "",
          email: "",
          name: "",
          avatar: "",
        },
        user: {
          id: "",
          email: "",
          fullName: "",
          avatar: "",
        },
        roles: [],
        requestStatus: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        expireAt: new Date(),
      },
    });
    const authAxios = useAuthAxios();
    const {shelterAPI} = useContext(AppContext)
    const [invitationRefresh, setInvitationRefresh] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [eligibleShelters, setEligibleShelter] = useState<Shelter[]>([]);
    const [eligibleSheltersRefresh, setEligibleShelterRefresh] = useState<boolean>(false);

    useEffect(() => {
      authAxios.get(`${shelterAPI}/get-user-invitations-and-requests`)
      .then(({data}) => {
        // console.log(data)
        setInvitationsList(data);
        setFiltererdInvitationsList(data);
      })
      .catch(err => console.log(err?.response.data.message))
    }, [invitationRefresh])

    useEffect(() => {
      authAxios.get(`${shelterAPI}/eligible-shelters`)
      .then(({data}) => {
        console.log(data)
        setEligibleShelter(data);
      })
      .catch(err => console.log(err?.response.data.message))
    }, [eligibleSheltersRefresh])

    const form = useForm<z.infer<typeof shelterRequest>>({
        resolver: zodResolver(shelterRequest),
        defaultValues: {
          email: "",
        },
      });


     const columns: ColumnDef<ShelterStaffRequestInvitation>[] = [
       {
         header: "STT",
         cell: ({ row }) => <p className="text-center">{row.index + 1}</p>,
       },
       {
         accessorKey: "shelter",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Trạm cứu hộ
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             <p className="px-2 flex flex-row gap-2">
               <img
                 src={row.original.shelter.avatar}
                 alt={row.original.shelter.name}
                 className="h-10 w-10 rounded-full object-cover"
               />
               <span className="my-auto">{row.original.shelter.name}</span>
             </p>
           );
         },
       },
       //  {
       //    accessorKey: "receiver",
       //    header: ({ column }) => {
       //      return (
       //        <Button
       //          variant="ghost"
       //          onClick={() =>
       //            column.toggleSorting(column.getIsSorted() === "asc")
       //          }
       //          className="cursor-pointer"
       //        >
       //          Người nhận
       //          <ArrowUpDown className="ml-2 h-4 w-4" />
       //        </Button>
       //      );
       //    },
       //    cell: ({ row }) => {
       //      return (
       //        <p className="px-2 flex flex-row gap-2">
       //          <img
       //            src={row.original.receiver.avatar}
       //            alt={row.original.receiver.fullName}
       //            className="h-10 w-10 rounded-full object-cover"
       //          />
       //          <span className="my-auto">{row.original.receiver.fullName}</span>
       //        </p>
       //      );
       //    },
       //  },
       {
         accessorKey: "requestType",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Loại
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           const type = row.original.requestType;
           const formatted =
             type === "invitation"
               ? "Lời mời"
               : type === "request"
               ? "Yêu cầu tham gia"
               : "Không xác định";

           return <p className="px-2 font-semibold">{formatted}</p>;
         },
       },
       //  {
       //    accessorKey: "roles",
       //    header: ({ column }) => {
       //      return (
       //        <Button
       //          variant="ghost"
       //          onClick={() =>
       //            column.toggleSorting(column.getIsSorted() === "asc")
       //          }
       //          className="cursor-pointer"
       //        >
       //          Vai trò
       //          <ArrowUpDown className="ml-2 h-4 w-4" />
       //        </Button>
       //      );
       //    },
       //    cell: ({ row }) => {
       //      return row.original.roles.map((role) => {
       //        const vaiTro = role === "member" ? "Thành viên" : "Quản lý";
       //        return (
       //          <Badge variant={role === "member" ? "secondary" : "destructive"}>
       //            {vaiTro}
       //          </Badge>
       //        );
       //      });
       //    },
       //  },
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
           const status = row.original.requestStatus;
           let color = "";
           const badgeVariant =
             status === "approved" ? "default" : "destructive";
           let statusTiengViet = "";
           if (status === "accepted") {
             statusTiengViet = "Chấp thuận";
             color = "bg-green-500 font-semibold uppercase";
           } else if (status === "pending") {
             statusTiengViet = "Chờ phản hồi";
             color = "bg-slate-400 font-semibold uppercase";
           } else if (status === "declined") {
             statusTiengViet = "Từ chối";
             color = "bg-red-500 font-semibold uppercase";
           } else if (status === "expired") {
             statusTiengViet = "Hết hạn";
             color = "bg-yellow-500 font-semibold uppercase";
           } else {
             statusTiengViet = "Hủy bỏ";
             color = "bg-yellow-200 font-semibold uppercase";
           }
           return (
             <Badge variant={badgeVariant} className={color}>
               {statusTiengViet}
             </Badge>
           );
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
         cell: ({ row }) => (
           <span className="px-2">
             {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
           </span>
         ),
       },
       {
         accessorKey: "updatedAt",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Cập nhập
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
         accessorKey: "expireAt",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Hết hạn
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => (
           <span className="px-2">
             {new Date(row.original.expireAt).toLocaleDateString("vi-VN")}
           </span>
         ),
       },
       {
         id: "actions",
         cell: ({ row }) => (
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                 <MoreHorizontal className="w-4 h-4" />
               </Button>
             </DropdownMenuTrigger>

             <DropdownMenuContent
               align="center"
               sideOffset={0}
               className="w-40 rounded-md border bg-background shadow-lg p-1"
             >
               <DropdownMenuItem
                 onClick={() => {
                   setDetailDialog({
                     isOpen: true,
                     detail: {
                       requestType: row.original.requestType,
                       user: {
                         id: row.original.user.id,
                         email: row.original.user.email,
                         fullName: row.original.user.fullName,
                         avatar: row.original.user.avatar,
                       },
                       shelter: {
                         id: row.original.shelter.id,
                         name: row.original.shelter.name,
                         avatar: row.original.shelter.avatar,
                         email: row.original.shelter.email,
                       },
                       roles: row.original.roles,
                       requestStatus: row.original.requestStatus,
                       createdAt: row.original.createdAt,
                       updatedAt: row.original.updatedAt,
                       expireAt: row.original.expireAt,
                     },
                   });
                 }}
                 className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
               >
                  Xem/duyệt yêu cầu
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         ),
       },
     ];


     const handleApprove = async () => {
        try {
          setLoadingButton(true);
          const response = await authAxios.put(`${shelterAPI}/review-shelter-invitation`, {
            shelterId: detailDialog.detail.shelter.id, 
            decision: "approve"
          })
          setTimeout(() => {
            toast.success("Chấp nhận yêu cầu gia nhập thành công!")
            setInvitationRefresh(prev => !prev);
            setLoadingButton(false);
            setDetailDialog({...detailDialog, isOpen: false});
          }, 1000)
        } catch (error : any) {
          console.log(error?.response.data.message)
        }
     }

     const handleReject = async () => {
      try {
          setLoadingButton(true);
          const response = await authAxios.put(`${shelterAPI}/review-shelter-invitation`, {
            shelterId: detailDialog.detail.shelter.id, 
            decision: "reject"
          })
          setTimeout(() => {
            toast.success("Từ chối yêu cầu gia nhập thành công!")
            setInvitationRefresh(prev => !prev);
            setLoadingButton(false);
            setDetailDialog({...detailDialog, isOpen: false});
          }, 1000)
        } catch (error : any) {
          console.log(error?.response.data.message)
        }
     }

     const handleSendRequest = async (value: z.infer<typeof shelterRequest>) => {
      try {
          setSubmitLoading(true);
          await authAxios.put(`${shelterAPI}/send-staff-request/${value.email}`)
          setTimeout(() => {
            toast.success("Gửi yêu cầu gia nhập thành công!")
            setInvitationRefresh(prev => !prev);
            setSubmitLoading(false);
          }, 1000)
        } catch (error : any) {
          console.log(error?.response.data.message)
          setSubmitLoading(false);
        }
     }


  return (
    <div className="flex flex-1 flex-col py-6 px-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách các yêu cầu gia nhập và lời mời vào trạm cứu hộ
          </h4>
          <div className="flex flex-row justify-between">
            {/* <SearchFilter<ShelterStaffRequestInvitation>
              data={invitationsList}
              searchFields={["sender", "receiver"]}
              onResultChange={setFiltererdInvitationsList}
              placeholder="Tìm theo tên người gửi hoặc người nhận"
            /> */}
            {invitationsList.find((invitation) =>
              ["active", "pending"].includes(invitation.requestStatus)
            ) ? (
              <p>Bạn đang lời mời hoặc yêu cầu gia nhập đang chờ xử lý</p>
            ) : (
              <Dialog
                onOpenChange={(open) => {
                  if (!open) {
                    form.reset();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="cursor-pointer">
                    Gửi yêu cầu tình nguyện trạm cứu hộ
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-xl !max-w-xl">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Đơn tình nguyện trạm cứu hộ
                    </DialogTitle>
                    <DialogDescription>
                      Vui lòng lựa chọn một trạm cứu hộ để tham gia làm tình
                      nguyện viên !
                    </DialogDescription>
                  </DialogHeader>
                  <div className="px-5 py-3">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSendRequest)}
                        className="space-y-6"
                      >
                        {/* Left column */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <EmailRadioSelector
                                value={field.value}
                                onChange={field.onChange}
                                label="Trạm cứu hộ"
                                suggestions={eligibleShelters}
                              />
                            )}
                          />
                        </div>
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
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="cursor-pointer"
                  onClick={() => setInvitationRefresh((prev) => !prev)}
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
          <DataTable columns={columns} data={filtererdInvitationsList ?? []} />
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
              Thông tin chi tiết yêu cầu/lời mời
            </DialogTitle>
            <DialogDescription className="text-center">
              Dưới đây là nội dung chi tiết của yêu cầu hoặc lời mời tham gia
              trạm cứu hộ.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-5 py-3 text-sm">
            <div>
              <span className="font-medium">Loại:</span>{" "}
              {detailDialog.detail?.requestType === "invitation"
                ? "Lời mời"
                : detailDialog.detail?.requestType === "request"
                ? "Yêu cầu tham gia"
                : "Không xác định"}
            </div>

            <div className="flex flex-row gap-2">
              <span className="my-auto font-medium">Trạm cứu hộ:</span>
              <Avatar>
                <AvatarImage src={detailDialog.detail?.shelter?.avatar} />
              </Avatar>
              <span className="my-auto">
                {detailDialog.detail?.shelter?.name} (
                {detailDialog.detail?.shelter?.email})
              </span>
            </div>

            {/* <div className="flex flex-row gap-2">
              <span className="my-auto font-medium">Trạm cứu hộ:</span>
              <Avatar>
                <AvatarImage src={detailDialog.detail?.shelter?.avatar} />
              </Avatar>
              <span className="my-auto">
                {detailDialog.detail?.shelter?.name}
              </span>
            </div> */}

            <div className="flex flex-row gap-2">
              <span className="font-medium my-auto">Vai trò:</span>{" "}
              {detailDialog.detail?.roles?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {detailDialog.detail.roles.map((role, idx) => {
                    const label =
                      role === "admin"
                        ? "Quản lý"
                        : role === "staff"
                        ? "Thành viên"
                        : role;
                    const variant =
                      role === "admin" ? "destructive" : "secondary";
                    return (
                      <Badge key={idx} variant={variant}>
                        {label}
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <span className="italic text-muted">Không có</span>
              )}
            </div>

            <div>
              <span className="font-medium">Trạng thái:</span>{" "}
              {detailDialog.detail?.requestStatus === "pending" && (
                <Badge variant="secondary">Đang chờ phản hồi</Badge>
              )}
              {detailDialog.detail?.requestStatus === "accepted" && (
                <Badge variant="default">Đã chấp thuận</Badge>
              )}
              {detailDialog.detail?.requestStatus === "declined" && (
                <Badge variant="destructive">Đã từ chối</Badge>
              )}
              {detailDialog.detail?.requestStatus === "cancelled" && (
                <Badge variant="outline">Đã huỷ</Badge>
              )}
            </div>

            <div>
              <span className="font-medium">Ngày tạo:</span>{" "}
              {new Date(detailDialog.detail?.createdAt).toLocaleString()}
            </div>

            <div>
              <span className="font-medium">Ngày cập nhật:</span>{" "}
              {new Date(detailDialog.detail?.updatedAt).toLocaleString()}
            </div>

            <div>
              <span className="font-medium">Ngày hết hạn:</span>{" "}
              {new Date(detailDialog.detail?.expireAt).toLocaleString()}
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-3">
            {/* Nút Đóng luôn hiển thị */}
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() =>
                  setDetailDialog({ ...detailDialog, isOpen: false })
                }
              >
                Đóng
              </Button>
            </DialogClose>
            {/* Nếu là request và chưa hết hạn, chưa duyệt, chưa bị huỷ → hiển thị nút */}
            {detailDialog.detail?.requestType === "invitation" &&
            detailDialog.detail?.requestStatus === "pending" &&
            new Date(detailDialog.detail?.expireAt) > new Date() &&
            detailDialog.detail?.requestStatus !== "cancelled" ? (
              <div className="flex gap-2">
                {loadingButton ? (
                  <Button disabled>
                    <>
                      <Loader2Icon className="animate-spin mr-2" />
                      Vui lòng chờ
                    </>
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleReject()}
                  >
                    Từ chối
                  </Button>
                )}
                {loadingButton ? (
                  <Button disabled>
                    <>
                      <Loader2Icon className="animate-spin mr-2" />
                      Vui lòng chờ
                    </>
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => handleApprove()}
                  >
                    Chấp thuận
                  </Button>
                )}
              </div>
            ) : (
              <div />
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ShelterRequestsList;