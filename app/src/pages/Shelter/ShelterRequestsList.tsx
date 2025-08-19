import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form, FormField
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Loader2Icon, MoreHorizontal, PlusSquare, RefreshCcw, Search } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ShelterStaffRequestInvitation } from "@/types/ShelterStaffRequestInvitation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type Shelter } from "@/types/Shelter";
import { EmailRadioSelector } from "@/components/EmailRadioSelector";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";



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
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [eligibleShelters, setEligibleShelter] = useState<Shelter[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
      authAxios.get(`${shelterAPI}/get-user-invitations-and-requests`)
      .then(({data}) => {
        setInvitationsList(data);
        setFiltererdInvitationsList(data);
      })
      .catch(err => console.log(err?.response.data.message))

      authAxios.get(`${shelterAPI}/eligible-shelters`)
      .then(({data}) => {
        setEligibleShelter(data);
      })
      .catch(err => console.log(err?.response.data.message))
    }, [refresh])

    function handleSearch (value : string){
    if(value.trim().length < 1){
      setFiltererdInvitationsList(invitationsList);
    }else{
      const searchedList = invitationsList.filter(invitation => {
        if(invitation.shelter.name && invitation.shelter.name.toLowerCase().includes(value.toLowerCase()) ||
          invitation.shelter.email && invitation.shelter.email.toLowerCase().includes(value.toLowerCase())){
          return invitation;
        }
      })
      setFiltererdInvitationsList(searchedList);
    }
  }

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
               <Avatar className="ring ring-2 ring-primary">
                 <AvatarImage
                   src={row.original.shelter.avatar}
                   alt={row.original.shelter.name}
                 />
                 <AvatarFallback>{row.original.shelter.name[0]}</AvatarFallback>
               </Avatar>
               <span className="my-auto">{row.original.shelter.name}</span>
             </p>
           );
         },
       },
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
                 {row.original.requestType === "request" && "Xem yêu cầu"}
                 {row.original.requestType === "invitation"
                   ? row.original.requestStatus === "pending"
                     ? "Xem/duyệt yêu cầu"
                     : "Xem yêu cầu"
                   : ""}
               </DropdownMenuItem>
               {row.original.requestType === "request" &&
                 row.original.requestStatus === "pending" && (
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <DropdownMenuItem
                         onSelect={(e) => {
                           e.preventDefault();
                         }}
                         className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                       >
                         Hủy yêu cầu
                       </DropdownMenuItem>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <AlertDialogTitle>Hủy yêu cầu ?</AlertDialogTitle>
                         <AlertDialogDescription>
                           Bạn có chắc chắn muốn hủy yêu cầu không ?
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel>Đóng</AlertDialogCancel>
                         <AlertDialogAction
                           onClick={() => {
                             handleCancelRequest(
                               row.original.shelter.id,
                               row.original.requestId
                             );
                           }}
                         >
                           Hủy yêu cầu
                         </AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                 )}
             </DropdownMenuContent>
           </DropdownMenu>
         ),
       },
     ];


     const handleApprove = async () => {
       try {
         setLoadingButton(true);
         await authAxios.put(
           `${shelterAPI}/review-shelter-invitation`,
           {
             shelterId: detailDialog.detail.shelter.id,
             decision: "approve",
           }
         );
         toast.success("Chấp nhận yêu cầu gia nhập thành công!");
         setRefresh((prev) => !prev);
         setDetailDialog({ ...detailDialog, isOpen: false });
       } catch (error: any) {
         console.log(error?.response.data.message);
       } finally {
         setLoadingButton(false);
       }
     };

     const handleReject = async () => {
       try {
         setLoadingButton(true);
         await authAxios.put(`${shelterAPI}/review-shelter-invitation`, {
           shelterId: detailDialog.detail.shelter.id,
           decision: "reject",
         });
         toast.success("Từ chối yêu cầu gia nhập thành công!");
         setRefresh((prev) => !prev);
         setDetailDialog({ ...detailDialog, isOpen: false });
       } catch (error: any) {
         console.log(error?.response.data.message);
       } finally {
         setLoadingButton(false);
       }
     };

     const handleSendRequest = async (
       value: z.infer<typeof shelterRequest>
     ) => {
       try {
         setSubmitLoading(true);
         await authAxios.put(`${shelterAPI}/send-staff-request/${value.email}`);
         toast.success("Gửi yêu cầu gia nhập thành công!");
         setRefresh((prev) => !prev);
       } catch (error: any) {
        console.log(error?.response.data.message || "Lỗi tạo yêu cầu gia nhập trạm cứu hộ");
        toast.error(error?.response.data.message || "Lỗi tạo yêu cầu gia nhập trạm cứu hộ");
       } finally {
         setSubmitLoading(false);
       }
     };

     const handleCancelRequest = async (shelterId: string, requestId : string) => {
       try {
         await authAxios.put(`${shelterAPI}/${shelterId}/cancel-staff-request/${requestId}`);
         toast.success("Hủy yêu cầu gia nhập thành công!");
         setRefresh((prev) => !prev);
       } catch (error: any) {
         console.log(error?.response.data.message);
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
              Yêu cầu gia nhập hoặc lời mời vào trạm cứu hộ
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách các yêu cầu gia nhập và lời mời vào trạm cứu hộ
          </h4>
          <div className="flex flex-row justify-between">
            <div className="flex gap-2">
              <Input
                className="w-80 pr-9"
                type="string"
                placeholder="Tìm kiếm theo tên, email trạm cứu hộ"
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
              {invitationsList.find((invitation) =>
                ["pending"].includes(invitation.requestStatus)
              ) ? (
                <p className="text-md text-destructive my-auto">Bạn đang lời mời hoặc yêu cầu gia nhập đang chờ xử lý</p>
              ) : (
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
                    <div className="px-5 py-3 w-full overflow-x-hidden">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleSendRequest)}
                          className="space-y-6"
                        >
                          <div className="w-full">
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
              <Avatar className="ring ring-2 ring-primary">
                <AvatarImage src={detailDialog.detail?.shelter?.avatar} />
                <AvatarFallback>{detailDialog.detail.shelter.name[0]}</AvatarFallback>
              </Avatar>
              <span className="my-auto">
                {detailDialog.detail?.shelter?.name} (
                {detailDialog.detail?.shelter?.email})
              </span>
            </div>

            <div className="flex flex-row gap-2">
              <span className="font-medium my-auto">Vai trò:</span>{" "}
              {detailDialog.detail?.roles?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {detailDialog.detail.roles.map((role, idx) => {
                    const label =
                      role === "manager"
                        ? "Quản lý"
                        : role === "staff"
                        ? "Thành viên"
                        : role;
                    const variant =
                      role === "manager" ? "destructive" : "secondary";
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
            new Date(detailDialog.detail?.expireAt) > new Date() ? (
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