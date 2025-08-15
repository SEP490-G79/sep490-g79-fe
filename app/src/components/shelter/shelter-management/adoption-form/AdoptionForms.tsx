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
  Activity,
  ArrowLeftRight,
  ArrowUpDown,
  CheckSquare,
  ChevronDown,
  List,
  MoreHorizontal,
  Pen,
  SwitchCamera,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { set } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdoptionForms() {
  const { shelterId } = useParams();
  const {
    coreAPI,
    shelterForms,
    setShelterForms,
    petsList,
    setShelterTemplates,
  } = React.useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [tabValue, setTabValue] = React.useState("active");

  React.useEffect(() => {
    setIsLoading(true);
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/get-all`)
      .then((res) => {
        setShelterTemplates(res.data);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  }, [shelterId]);

  const removeDiacritics = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const handleDelete = async (formId: string) => {
    setIsLoading(true);
    await authAxios
      .delete(`${coreAPI}/shelters/${shelterId}/adoptionForms/${formId}/delete`)
      .then(() => {
        setShelterForms([...shelterForms].filter((form) => form._id != formId));

        toast.success("Xóa form nhận nuôi thành công");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Xóa thất bại!");
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };
  const handleChangeStatus = async (formId: string, status: string) => {
    setIsLoading(true);
    await authAxios
      .put(
        `${coreAPI}/shelters/${shelterId}/adoptionForms/${formId}/change-status`,
        {
          status,
        }
      )
      .then((res) => {
        setShelterForms(
          shelterForms.map((form) =>
            form._id == formId ? { ...form, status: res.data.status } : form
          )
        );
        toast.success("Cập nhật trạng thái thành công");
      })
      .catch((err) => {
        // console.log(err);
        toast.error(
          err?.response?.data?.message || "Cập nhật trạng thái thất bại"
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
  };
  React.useEffect(() => {
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionForms/get-by-shelter`)
      .then((res) => {
        setShelterForms(res.data);
      })
      .catch((err) => {
        // console.log(err?.response?.data?.message);
      });
  }, [shelterId]);
  const filteredForms = React.useMemo(() => {
    setIsLoading(true);
    if (tabValue == "active") {
      setIsLoading(false);

      return shelterForms.filter((form) =>
        ["draft", "active"].includes(form.status)
      );
    }
    if (tabValue == "archived") {
      setIsLoading(false);

      return shelterForms.filter((form) => form?.status == "archived");
    }

    setIsLoading(false);

    return shelterForms;
  }, [shelterForms, tabValue]);

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
      cell: ({ row }) => {
        const adoptionForm = row.original;
        return (
          // <span>{row.getValue("title")}</span>;
          <Link
            to={adoptionForm._id}
            className="hover:text-(--primary) hover:underline"
          >
            {row.getValue("title")}
          </Link>
        );
      },
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
              <AvatarImage
                src={petsList.find((p: Pet) => p._id == pet._id)?.photos[0]}
                alt={pet.name}
                className="object-center object-cover"
              />
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
          <Badge variant="outline" className="">
            {row.getValue("status")}
          </Badge>
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
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`${adoptionForm._id}`} className="flex gap-1">
                  <Pen /> Chỉnh sửa
                </Link>
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <ArrowLeftRight /> Chuyển đổi trạng thái
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Chuyển đổi trạng thái
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <p className="text-sm">
                      Khi chuyển đổi trạng thái của đơn thì bạn thú nuôi sẽ được
                      chuyển sang trạng thái tương ứng với đơn này.
                    </p>
                  </DialogDescription>
                  <div className="flex flex-col space-y-4 mt-4">
                    <Select
                      onValueChange={(value) => {
                        handleChangeStatus(adoptionForm._id, value);
                      }}
                      defaultValue={adoptionForm.status}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Trạng thái</SelectLabel>
                          {["draft", "active"].map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenuItem>
                <List /> Xem dánh sách yêu cầu
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={adoptionForm.status.toUpperCase() != "DRAFT"}
                onClick={() =>
                  toast.error("Xác nhận xóa đơn đăng ký nhận nuôi", {
                    description:
                      "Bạn có chắc muốn xóa đơn đăng ký nhận nuôi này không?",
                    action: {
                      label: "Xóa",
                      onClick: () => handleDelete(adoptionForm._id),
                    },
                  })
                }
              >
                <Trash /> Xóa đơn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredColumns = React.useMemo(() => {
    if (tabValue == "archived") {
      return columns.filter((col) => col.id != "actions");
    }
    return columns;
  }, [columns, tabValue]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = useReactTable({
    data: filteredForms.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    columns: filteredColumns,
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
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <Skeleton className="h-10 w-1/3 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>

        <div className="rounded-md border">
          <div className="flex px-4 py-2 border-b">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-6 w-24 mr-4 last:mr-0 rounded" />
            ))}
          </div>

          <div>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="flex px-4 py-3 items-center border-b last:border-0"
              >
                {Array.from({ length: 6 }).map((__, cellIdx) => (
                  <Skeleton
                    key={cellIdx}
                    className="h-4 w-20 mr-4 last:mr-0 rounded"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
          <Skeleton className="h-6 w-32 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
        defaultValue="active"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="active">
            <Activity /> Chờ nhận nuôi
          </TabsTrigger>
          <TabsTrigger value="archived">
            <CheckSquare /> Hoàn thành
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="w-full">
            <div className="flex justify-between items-center py-4">
              <Input
                placeholder="Tìm kiếm..."
                value={
                  (table.getColumn("pet")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("pet")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <CreateDialog setIsLoading={setIsLoading} />
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
                        className=" min-h-[200px] text-center"
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
        </TabsContent>
        <TabsContent value="archived">
          <div className="w-full">
            <div className="flex justify-between items-center py-4">
              <Input
                placeholder="Tìm kiếm..."
                value={
                  (table.getColumn("pet")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("pet")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              {/* <CreateDialog setIsLoading={setIsLoading} /> */}
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
                        className=" min-h-[200px] text-center"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
