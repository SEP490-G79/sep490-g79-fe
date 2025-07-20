import * as React from "react";
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
  List,
  MoreHorizontal,
  Pen,
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
import { type AdoptionForm } from "@/types/AdoptionForm";
import { Badge } from "@/components/ui/badge";
import AppContext from "@/context/AppContext";
import useAuthAxios from "@/utils/authAxios";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateDialog from "./CreateDialog";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Pet } from "@/types/Pet";

export function AdoptionForms() {
  const { shelterId } = useParams();
  const { coreAPI, shelterForms, setShelterForms, petsList } =
    React.useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();

  const removeDiacritics = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const handleDelete = (formId: string) => {
    authAxios
      .delete(`${coreAPI}/shelters/${shelterId}/adoptionForms/${formId}/delete`)
      .then(() => {
        setShelterForms([...shelterForms].filter((form) => form._id != formId));

        toast.success("Xóa form nhận nuôi thành công");
      })
      .catch((err) => {
        toast.error(err.data.response.message);
      });
  };
  React.useEffect(() => {
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionForms/get-by-shelter`)
      .then((res) => {
        setShelterForms(res.data);
      })
      .catch((err) => {
        console.log(err.data.response.message);
      });
  }, [shelterId]);
  const columns: ColumnDef<AdoptionForm>[] = [
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
      header: ({ column }) => <Button variant="ghost">Tiêu đề</Button>,
      filterFn: (row, columnId, filterValue) => {
        const cell = String(row.getValue<string>(columnId) ?? "");
        const keyword = removeDiacritics(filterValue ?? "").toLowerCase();
        return removeDiacritics(cell).toLowerCase().includes(keyword);
      },
      cell: ({ row }) => <span>{row.getValue("title")}</span>,
    },
    {
      accessorKey: "pet",
      accessorFn: (s) => s.pet,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thú nuôi
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ row }) => {
        const pet = row.getValue<Pet>("pet");
        return (
          <div className="flex items-center">
            <Avatar className=" w-8 h-8 ring-1 ring-primary">
              <AvatarImage src={petsList.find((p:Pet)=>p._id== pet._id)?.photos[0]} alt={pet.name} className="object-center object-cover" />
              <AvatarFallback>
                {pet.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 flex flex-col overflow-hidden">
              <span className="text-sm truncate font-medium">{pet.name}</span>
              <span className="text-sm truncate">#{pet.petCode}</span>
            </div>
          </div>
        );
      },
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
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Trạng thái
          <ArrowUpDown className="ml-1" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="w-full ml-3 text-start">
          <Badge variant="default">{row.getValue("status")}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const adoptionForm = row.original;

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
                <Link to={`${adoptionForm._id}`} className="flex gap-1">
                  <Pen /> Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <List /> Xem dánh sách yêu cầu
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={adoptionForm.status.toUpperCase() != "DRAFT"}
                onClick={() => handleDelete(adoptionForm._id)}
              >
                <Trash /> Xóa form
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data: shelterForms.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
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
          placeholder="Tìm kiếm..."
          value={(table.getColumn("pet")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("pet")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <CreateDialog />
      </div>
      <div className="rounded-md border">
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
