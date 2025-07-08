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
import { ArrowUpDown, Ban, ChevronDown, Loader2Icon, MoreHorizontal, RotateCcwKey, UserRoundCog } from "lucide-react";
import useAuthAxios from "@/utils/authAxios";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import type { ShelterEstablishmentRequest } from "@/types/ShelterEstablishmentRequest";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { ShelterMember } from "@/types/ShelterMember";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Badge } from "../../ui/badge";
import { useParams } from "react-router-dom";
import { DataTableStaff } from "@/components/data-table-staff";
import { Separator } from "@/components/ui/separator";
import { SearchFilter } from "@/components/SearchFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmailSelector } from "@/components/EmailSelector";
import type { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";


const inviteSchema = z.object({
  email: z.array(z.string().email("Email không hợp lệ")),
  role: z.array(z.enum(["staff", "manager"])).nonempty("Chọn ít nhất một vai trò"),
});

const roleSchema = z.object({
  userId: z.string().nonempty(),
  roles: z
    .array(z.string().min(1, "Vai trò không hợp lệ"))
    .min(1, "Thành viên phải có ít nhất một vai trò"),
});

type eligibleEmail = {
    email: string,
    avatar: string
  }[]

type InviteFormData = z.infer<typeof inviteSchema>;
type RoleFormData = z.infer<typeof roleSchema>;

const ShelterStaffsList = () => {
    const [shelterMembersList, setShelterMembersList] = useState<ShelterMember[]>([]);
     const [filteredMembers, setFilteredMembers] = useState<ShelterMember[]>();
     const [eligibleEmails, setEligibleEmails] = useState<eligibleEmail>([]);
    const [loadingButton, setLoadingButton] = useState<Boolean>(false);
    const authAxios = useAuthAxios();
    const {shelterAPI, user} = useContext(AppContext)
    const {shelterId} = useParams();
    const [emailRefresh, setEmailRefresh] = useState<boolean>(false);
    const [memberRefresh, setMemberRefresh] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const isManager = shelterMembersList.find(member => member.id === user?._id)?.shelterRoles.includes("manager");

    const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: [],
      role:[],
    },
  });
  const {reset, setError} = form;

  const changeRoleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      userId: "",
      roles: [],
    },
  });

   // lay danh sach member
    useEffect(() => {
      authAxios.get(`${shelterAPI}/get-members/${shelterId}`)
      .then(({data}) => {
        setShelterMembersList(data);
        setFilteredMembers(data);
      })
      .catch(err => console.log(err?.response.data.message))
    },[memberRefresh])

    // lay email du dieu kien de moi
    useEffect(() => {
      authAxios.get(`${shelterAPI}/find-eligible-users/${shelterId}`)
      .then(({data}) => {
        console.log(data)
        setEligibleEmails(data);
      })
      .catch(err => console.log(err?.response.data.message))
    },[emailRefresh])

     const columns: ColumnDef<ShelterMember>[] = [
       {
         header: "STT",
         cell: ({ row }) => <p className="text-left px-2">{row.index + 1}</p>,
       },
       //  {
       //    accessorKey: "avatar",
       //    header: "Ảnh đại diện",
       //    cell: ({ row }) => (
       //      <img
       //        src={row.original.avatar}
       //        alt={row.original.fullName}
       //        className="h-10 w-10 rounded-full object-cover mx-auto"
       //      />
       //    ),
       //  },
       {
         accessorKey: "fullName",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Họ và tên
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             <p className="px-2 flex flex-row gap-2">
               <img
                 src={row.original.avatar}
                 alt={row.original.fullName}
                 className="h-10 w-10 rounded-full object-cover"
               />
               <span className="my-auto">{row.original.fullName}</span>
             </p>
           );
         },
       },
       //  {
       //    accessorKey: "email",
       //    header: ({ column }) => {
       //      return (
       //        <Button
       //          variant="ghost"
       //          onClick={() =>
       //            column.toggleSorting(column.getIsSorted() === "asc")
       //          }
       //          className="cursor-pointer"
       //        >
       //          Email
       //          <ArrowUpDown className="ml-2 h-4 w-4" />
       //        </Button>
       //      );
       //    },
       //    cell: ({ row }) => {
       //      return <span className="px-2">{row.original.email}</span>;
       //    },
       //  },
       {
         accessorKey: "roles",
         header: ({ column }) => {
           return (
             <Button
               variant="ghost"
               onClick={() =>
                 column.toggleSorting(column.getIsSorted() === "asc")
               }
               className="cursor-pointer"
             >
               Vai trò
               <ArrowUpDown className="ml-2 h-4 w-4" />
             </Button>
           );
         },
         cell: ({ row }) => {
           return (
             <div className="flex gap-2">
               {row.original?.shelterRoles?.sort((a,b) => b.localeCompare(a)).map((role) => {
                 if (role === "manager") {
                   return <Badge variant="destructive">Quản lý</Badge>;
                 } else {
                   return <Badge variant="outline">Thành viên</Badge>;
                 }
               })}
             </div>
           );
         },
       },
       {
         id: "actions",
         cell: ({ row }) =>
           user?._id === row.original.id || !isManager ? (
             ""
           ) : (
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
                {row.original.shelterRoles.includes("manager") ? "" :
                <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <DropdownMenuItem 
                     onSelect={(e) => e.preventDefault()}
                     className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
                       <Ban className="w-4 h-4" />
                       Kick thành viên
                     </DropdownMenuItem>
                   </AlertDialogTrigger>

                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>
                         Xác nhận kick thành viên
                       </AlertDialogTitle>
                       <AlertDialogDescription className="flex gap-2">
                         Kick thành viên
                        <Avatar>
                          <AvatarImage src={row.original.avatar} alt={row.original.fullName + " avatar"} />
                        </Avatar>
                         <strong>{row.original.fullName}</strong> ra khỏi
                         trạm cứu hộ?
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Hủy</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => handleKickMember(row.original.id)}
                       >
                         Xác nhận kick
                       </AlertDialogAction>
                     </AlertDialogFooter>
                   </AlertDialogContent>
                 </AlertDialog>
                }
                 

                 <DropdownMenuItem
                   onClick={() => {
                     changeRoleForm.reset({
                       userId: row.original.id,
                       roles: row.original.shelterRoles,
                     });
                     setOpenDialog(true);
                   }}
                   className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
                 >
                   <UserRoundCog /> Chỉnh vai trò
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           ),
       },
     ];

  const handleInviteMember = (data: InviteFormData) => {
    try {
    //   console.log({
    //     shelterId: shelterId, 
    //     emailsList: data.email, 
    //     roles: data.role
    // })
      if (data.email.length < 1 || data.email[0].trim().length < 3) {
        setError("email", {
          type: "manual",
          message: "Phải nhập ít nhất 1 email hợp lệ",
        });
        return;
      }
      authAxios.post(`${shelterAPI}/invite-members/${shelterId}`, {
        emailsList: data.email, 
        roles: data.role
      })
      .then(({data}) => {
        console.log(data);
        setTimeout(() => {
          toast.success(`Gửi lời mời thành công`);
          setEmailRefresh(prev => !prev);
          reset();
        })
      })
      .catch(err => console.log(err?.response.data.message))
    } catch (error : any) {
      console.log(error?.response.data.message);
    }
    // TODO: Call API inviteMember(data)
  };

    const handleKickMember = async (userId: string) => {
      try { 
        await authAxios.put(`${shelterAPI}/${shelterId}/kick-member`, {
          shelterId: shelterId,
          userId: userId,
        })
        setTimeout(() => {
          // console.log(response);
          toast.success("Kick thành viên thành công")
          setMemberRefresh(prev => !prev);
        }, 1100)
      } catch (error : any) {
        console.log(error?.response.data.message)
        toast.error(error?.response.data.message)
      }
    }


    const handleChangeMemberRole = async (roleData : RoleFormData) => {
      try {
        const {userId, roles} = roleData;
        // console.log(roleData);

        if(roles.length === 0){
          toast.error("Người dùng phải có ít nhất 1 vai trò")
          return false;
        }
    
        await authAxios.put(`${shelterAPI}/${shelterId}/change-member-roles`, {
          userId,
          roles
        });
        setTimeout(() => {
          setMemberRefresh((prev) => !prev);
          toast.success("Thay đổi vai trò người dùng thành công!");
          setOpenDialog(false);
        }, 500)
        
        return true;
      } catch (error: any) {
        toast.error(error?.response.data.message);
        console.log(error?.response.data.message);
      }
    }

  if(shelterMembersList.find(member => member.id === user?._id)?.shelterRoles.includes("manager")){
    return (
    <div className="flex flex-1 flex-col py-6 px-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Quản lý thành viên của trạm cứu hộ
          </h4>
          <div className="col-span-12">
            <Separator className="my-4" />
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight my-2">
              Mời thêm thành viên
            </h4>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleInviteMember)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <EmailSelector
                      value={field.value}
                      onChange={field.onChange}
                      label="Email"
                      suggestions={eligibleEmails}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-[30vw]">
                      <FormLabel>Vai trò</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-start"
                          >
                            {field.value.length > 0
                              ? field.value.map((val) => {
                                  return (
                                    <Badge
                                      variant={
                                        val === "staff"
                                          ? "outline"
                                          : "destructive"
                                      }
                                    >
                                      {val === "staff"
                                        ? "Thành viên"
                                        : "Quản lý"}
                                    </Badge>
                                  );
                                })
                              : "Chọn vai trò"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[30vw] p-0">
                          <Command>
                            {["staff", "manager"].map((role) => {
                              const label =
                                role === "staff" ? "Thành viên" : "Quản lý";
                              const isChecked = field.value.includes(role);
                              return (
                                <CommandItem
                                  key={role}
                                  onSelect={() => {
                                    const newValue = isChecked
                                      ? field.value.filter((v) => v !== role)
                                      : [...field.value, role];
                                    field.onChange(newValue);
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <Checkbox
                                    checked={isChecked}
                                    className="mr-2"
                                    onCheckedChange={() => {}}
                                  />
                                  {label}
                                </CommandItem>
                              );
                            })}
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-start">
                  <Button type="submit">Mời thành viên</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="col-span-12 px-5">
          <Separator className="my-4" />
          <SearchFilter<ShelterMember>
            data={shelterMembersList}
            searchFields={["fullName"]}
            onResultChange={setFilteredMembers}
            placeholder="Tìm theo tên"
          />
          <DataTableStaff columns={columns} data={filteredMembers ?? []} />
        </div>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="!max-w-[25vw]">
          <DialogHeader>
            <DialogTitle>Chỉnh vai trò của thành viên</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <Form {...changeRoleForm}>
            <form onSubmit={changeRoleForm.handleSubmit(handleChangeMemberRole)} className="space-y-4">
              <FormField
                control={changeRoleForm.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block">Vai trò</FormLabel>
                    <div className="space-y-2">
                      {["staff", "manager"].map((role) => (
                        <FormControl key={role}>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={field.value.includes(role)}
                              onCheckedChange={(checked) => {
                                const newValue = checked
                                  ? [...field.value, role]
                                  : field.value.filter((r) => r !== role);
                                field.onChange(newValue);
                              }}
                            />
                            <span>
                              {role === "staff"
                                ? "Thành viên"
                                : "Quản lý"}
                            </span>
                          </label>
                        </FormControl>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Đóng</Button>
                </DialogClose>
                <Button type="submit">Xác nhận</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    </div>
  );
  }else{
    return <div className="col-span-12 px-5">
      <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Danh sách thành viên của trạm cứu hộ
          </h4>
          <Separator className="my-4" />
          <SearchFilter<ShelterMember>
            data={shelterMembersList}
            searchFields={["fullName"]}
            onResultChange={setFilteredMembers}
            placeholder="Tìm theo tên"
          />
          <DataTableStaff columns={columns} data={filteredMembers ?? []} />
        </div>
  }
  
}

export default ShelterStaffsList