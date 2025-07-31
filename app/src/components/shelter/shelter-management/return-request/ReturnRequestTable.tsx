import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Ban, Eye, MoreHorizontal, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ReturnRequest } from '@/types/ReturnRequest';
import { DataTable } from '@/components/data-table';

type ReturnRequestTableProps = {
    filteredReturnRequest: ReturnRequest[];
    setDialogDetail: React.Dispatch<React.SetStateAction<ReturnRequest | null>>;
}

const ReturnRequestTable = ({filteredReturnRequest, setDialogDetail}: ReturnRequestTableProps) => {
    const columns: ColumnDef<ReturnRequest>[] = [
      {
        header: "STT",
        cell: ({ row }) => <p className="text-left px-2">{row.index + 1}</p>,
      },
      {
        accessorKey: "pet",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="cursor-pointer"
            >
              Thú nuôi
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className='flex gap-2'>
              <Avatar>
                <AvatarImage
                  src={row.original.pet.photos[0]}
                  alt={row.original.pet.petCode}
                />
                <AvatarFallback>Thú cưng</AvatarFallback>
              </Avatar>
              <p className='my-auto'>{row.original.pet.name}</p>
            </div>
          );
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
        accessorKey: "requestedBy",
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
        cell: ({ row }) => {
          return (
            <span className="flex gap-2">
              <Avatar>
                <AvatarImage
                  src={row.original.requestedBy.avatar}
                  alt={`avatar cua ${row.original.requestedBy.fullName}`}
                />
              </Avatar>
              <p className="my-auto truncate max-w-[10vw]">
                {row.original.requestedBy.fullName}
              </p>
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

          let badgeVariant: "default" | "secondary" | "destructive" = "default";
          let label = "";

          switch (status) {
            case "approved":
              badgeVariant = "default";
              label = "Chấp thuận";
              break;
            case "pending":
              badgeVariant = "secondary";
              label = "Chờ xử lý";
              break;
            case "rejected":
              badgeVariant = "destructive";
              label = "Từ chối";
              break;
            case "cancelled":
              badgeVariant = "destructive";
              label = "Đã huỷ";
              break;
            default:
              label = "Không rõ";
          }

          return <Badge variant={badgeVariant}>{label}</Badge>;
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
              className="max-w-50 rounded-md border bg-background shadow-lg p-1"
            >
              <DropdownMenuItem className="flex items-center py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded"
              onSelect={() => setDialogDetail(row.original)}
              >
                Chi tiết/duyệt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];

  return (
    <DataTable columns={columns} data={filteredReturnRequest ?? []} />
  )
}

export default ReturnRequestTable