import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pen,
  Plus,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContext, useEffect, useMemo, useState } from "react";
import { type AdoptionForm } from "@/types/AdoptionForm";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AdoptionTemplate } from "@/types/AdoptionTemplate";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { Skeleton } from "@/components/ui/skeleton";
import CreateDialog from "./CreateDialog";
import { toast } from "sonner";
import { set } from "date-fns";
import EditDialog from "./EditDialog";

export function AdoptionTemplates() {
  const { shelterId } = useParams();
  const { coreAPI ,shelterTemplates, setShelterTemplates } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();

  const removeDiacritics = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const handleDelete = async (id: any) => {
    try {
      await authAxios.delete(
        `${coreAPI}/shelters/${shelterId}/adoptionTemplates/${id}/delete`
      );
      setShelterTemplates([
        ...shelterTemplates.filter((item) => item._id != id),
      ]);
      toast.success("Xoá mẫu đơn thành công");
    } catch (error) {
      console.error(error);
      toast.error("Xoá mẫu đơn thất bại");
    }
  };
  const columns: ColumnDef<AdoptionTemplate>[] = [
    {
      accessorKey: "stt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          STT
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ row }) => <span className="pl-5">{row.index + 1}</span>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tiêu đề
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        const cell = String(row.getValue<string>(columnId) ?? "");
        const keyword = removeDiacritics(filterValue ?? "").toLowerCase();
        return removeDiacritics(cell).toLowerCase().includes(keyword);
      },
      cell: ({ row }) => <span>{row.getValue("title")}</span>,
    },
    {
      accessorKey: "species",
      accessorFn: (row) => row.species?.name ?? "",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giống
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue) => {
        const cell = String(row.getValue<string>(columnId) ?? "");
        const keyword = removeDiacritics(filterValue ?? "").toLowerCase();
        return removeDiacritics(cell).toLowerCase().includes(keyword);
      },
      cell: ({ row }) => <span>{row.getValue("species")}</span>,
    },
    {
      accessorKey: "createdBy",
      accessorFn: (row) => row.createdBy?.fullName ?? "",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Người tạo
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ row }) => <span>{row.getValue("createdBy")}</span>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ row }) => {
        const iso = row.getValue<string>("createdAt");
        return (
          <span className="pl-3">
            {new Date(iso).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const adoptionTemplate = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`${adoptionTemplate._id}`} className="flex gap-1">
                  <Pen /> Chỉnh sửa mẫu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDelete(adoptionTemplate._id)}
              >
                <Trash /> Xóa mẫu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/get-all`)
      .then((res) => {
        setShelterTemplates(res.data);
      })
      .catch((err) => {
        console.log(err.data.response.message);
      });
  }, [shelterId]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data: shelterTemplates.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="Tìm kiếm ..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("title")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />
        <CreateDialog/>
      </div>
      <div className="rounded-md border">
        {shelterTemplates ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <Skeleton className="h-full w-full" />
            </TableHeader>
            <TableBody>
              <Skeleton className="h-full w-full" />
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span>
            Page <strong>{pagination.pageIndex + 1}</strong> of{" "}
            {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  );
}
