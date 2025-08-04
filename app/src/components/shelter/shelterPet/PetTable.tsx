import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PET_STATUSES } from "@/components/shelter/shelterPet/petStatus";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Pet } from "@/types/Pet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PetTableProps {
  data: Pet[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onEdit: (pet: Pet) => void;
  onDelete: (petId: string) => void;
  onView: (pet: Pet) => void;
}
const statusMap = Object.fromEntries(
  PET_STATUSES.map(({ value, label }) => [value, label])
);

export default function PetTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}: PetTableProps) {
  const columns: ColumnDef<Pet>[] = [
    {
      accessorKey: "petCode",
      header: "#Mã thú nuôi",
      cell: ({ row }) => <span>#{row.original.petCode}</span>,
    },
    {
      accessorKey: "photos",
      header: "Ảnh",
      cell: ({ row }) => (
        <Avatar className="w-10 h-10 rounded ring-2 ring-(--primary)">
          <AvatarImage
            src={row.original.photos?.[0]}
            alt={row.original.name}
            className="object-cover "
          />
          <AvatarFallback>
            {row.original.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    { accessorKey: "name", header: "Tên" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        return statusMap[status] || "Không rõ";
      },
    },

    {
      accessorKey: "breeds",
      header: "Giống",
      cell: ({ row }) => (
        <span>
          {(row.original.breeds || [])
            .map((b: unknown) =>
              typeof b === "string"
                ? b
                : typeof b === "object" && b !== null && "name" in b
                ? (b as { name: string }).name
                : ""
            )
            .join(", ")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView(row.original)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => row.original._id && onDelete(row.original._id)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / limit),
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-6">
                Không có thú cưng nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center p-2">
        <div className="text-sm text-muted-foreground">
          {page}/{totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
