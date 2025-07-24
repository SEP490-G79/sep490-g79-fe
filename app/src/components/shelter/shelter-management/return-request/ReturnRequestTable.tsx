import React from 'react'
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Ban, Eye, MoreHorizontal, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ReturnRequest } from '@/types/ReturnRequest';
import { DataTableBlogs } from '../blog/data-table-blogs';

type ReturnRequestTableProps = {
    filteredReturnRequest: ReturnRequest[];
    handleApproveReturnRequest?: (blogId: string) => Promise<boolean>;
    handleRejectReturnRequest?: (blogId: string) => Promise<boolean>;
}

const ReturnRequestTable = ({filteredReturnRequest, handleApproveReturnRequest, handleRejectReturnRequest}: ReturnRequestTableProps) => {
    const columns: ColumnDef<ReturnRequest>[] = [
      {
        header: "STT",
        cell: ({ row }) => <p className="text-left px-2">{row.index + 1}</p>,
      },
      {
        accessorKey: "pet",
        header: ({ column }) => {
          return (
            <Button variant="ghost" className="cursor-pointer">
              Thú nuôi
            </Button>
          );
        },
        cell: ({ row }) => {
          return <div>
            <Avatar>
                <AvatarImage src={row.original.pet.photos[0]} alt={row.original.pet.petCode} />
                <AvatarFallback>Thú cưng</AvatarFallback>
            </Avatar>
            <p>{row.original.pet.name}</p>
          </div>
        },
      },
      {
        accessorKey: "reason",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Lý do
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return <p className="max-w-[12vw] truncate">{row.original.reason}</p>;
        },
      },
      {
        accessorKey: "createdBy",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Tạo bởi
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        // cell: ({ row }) => {
        //   return <span className='flex gap-2'>
        //     <Avatar>
        //       <AvatarImage src={row.original.createdBy.avatar} alt={`avatar cua ${row.original.createdBy.fullName}`} />
        //     </Avatar>
        //     <p className='my-auto truncate max-w-[10vw]'>{row.original.createdBy.fullName}</p>
        //   </span>;
        // },
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
        // cell: ({ row }) => {
        //   const isModerating = row.original.status === "moderating";
        //   const isRejected = row.original.status === "rejected";
        //   return (
        //     <Badge
        //       variant={
        //         isModerating
        //           ? "secondary"
        //           : isRejected
        //           ? "destructive"
        //           : "default"
        //       }
        //     >
        //       {isModerating ? "Chờ duyệt" : isRejected ? "Từ chối" : "Đã đăng"}
        //     </Badge>
        //   );
        // },
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
        cell: ({ row }) => {
          return new Date(row.original.createdAt).toLocaleString("vi-VN", {
            dateStyle: "short",
          });
        },
      },
      {
        id: "actions",
        header: () => "Hành động",
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
              className="w-50 rounded-md border bg-background shadow-lg p-1"
            >
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
              >
                <Eye className="w-4 h-4" />
                Chi tiết/duyệt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

  return (
    <DataTableBlogs columns={columns} data={filteredReturnRequest ?? []} />
  )
}

export default ReturnRequestTable