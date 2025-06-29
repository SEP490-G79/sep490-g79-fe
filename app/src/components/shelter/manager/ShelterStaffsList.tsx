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
import { ArrowUpDown, Ban, Loader2Icon, MoreHorizontal, RotateCcwKey } from "lucide-react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Badge } from "../../ui/badge";


const tempUser: ShelterMember[] = [
  {
    index: 1,
    email: "tuan1213@example.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
    roles: ["manager"],
    status: "active",
    fullName: "Tuan BG",
    createdAt: new Date("2025-06-19T05:19:55.742Z"),
  },
  {
    index: 2,
    email: "tuan1213@example.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
    roles: ["member"],
    status: "active",
    fullName: "New member",
    createdAt: new Date("2025-06-19T05:19:55.742Z"),
  },
];

const ShelterStaffsList = () => {
    const [shelterMembersList, setShelterMembersList] = useState<ShelterMember[]>([]);
    const [loadingButton, setLoadingButton] = useState<Boolean>(false);
    const authAxios = useAuthAxios();
    const {shelterAPI} = useContext(AppContext)


     const columns: ColumnDef<ShelterMember>[] = [
      {
        header: "STT",
        cell: ({ row }) => <p className='text-center'>{row.index + 1}</p>
      },
      {
        accessorKey: "avatar",
        header: "Ảnh đại diện",
        cell: ({ row }) => (
          <img
            src={row.original.avatar}
            alt={row.original.fullName}
            className="h-10 w-10 rounded-full object-cover mx-auto"
          />
        ),
      },
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
        cell: ({row}) => {
          return <span className='px-2'>{row.original.fullName}</span>
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
          return row.original.roles.map((role) => {
            const vaiTro = role === "member" ? "Thành viên" : "Quản lý";
              return <Badge variant={role === "member" ? "secondary" : "destructive"}>{vaiTro}</Badge>;
          });
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
          const badgeVariant =
              status === "active"
                ? "default"
                : "destructive";
          let statusTiengViet = "";
          if (status === "active") {
            statusTiengViet = "Đã kích hoạt";
            color = "text-green-500 font-semibold uppercase";
          } else if(status === "verifying"){
            statusTiengViet = "Chờ kích hoạt";
            color = "text-yellow-500 font-semibold uppercase";
          }else{
            statusTiengViet = "Bị cấm";
            color = "text-destructive font-semibold uppercase";
          }
          return <Badge variant={badgeVariant}>{statusTiengViet}</Badge>;
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
        id: "actions",
        cell: ({ row }) => (
            row.original.roles.includes("manager") ? "" :
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
                onClick={() => handleKickMember(row.original.fullName)}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
              >
                <Ban className="w-4 h-4"/> Kick thành viên
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

    const handleKickMember = async (userId: string) => {
      toast.success("Kick thành viên "+ userId + " thành công!")
    }


  return (
    <div className="flex flex-1 flex-col py-6 px-10">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="col-span-12 px-5 flex flex-col gap-5">
          <h4 className="scroll-m-20 min-w-40 text-xl font-semibold tracking-tight text-center">
            Quản lý thành viên của trạm cứu hộ
          </h4>
          <div className="flex flex-row gap-7">
            <Input
              className="max-w-1/3"
              type="string"
              placeholder="Tìm kiếm theo tên hoặc email"
              onChange={(e) => console.log("ok")}
            />
            <Button>Mời thêm thành viên</Button>
          </div>
        </div>
        <div className="col-span-12 px-5">
          <DataTable columns={columns} data={tempUser ?? []} />
        </div>
      </div>
    </div>
  )
}

export default ShelterStaffsList