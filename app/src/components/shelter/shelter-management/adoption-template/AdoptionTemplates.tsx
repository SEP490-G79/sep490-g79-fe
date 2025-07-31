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
  Copy,
  Ellipsis,
  EllipsisVertical,
  LayoutTemplate,
  MoreHorizontal,
  Pen,
  Plus,
  SlidersHorizontal,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export function AdoptionTemplates() {
  const { shelterId } = useParams();
  const { coreAPI, shelterTemplates, setShelterTemplates } =
    useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState({
    species: false,
    alphabetical: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    authAxios
      .get(`${coreAPI}/shelters/${shelterId}/adoptionTemplates/get-all`)
      .then((res) => {
        setShelterTemplates(res.data);
      })
      .catch((err) => {
        console.log(err.data.response.message);
      })
      .finally(()=>{
        setTimeout(() => {
          setIsLoading(false)
        }, 200);
      });
  }, [shelterId]);
  const removeDiacritics = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const handleDelete = async (id: any) => {
    try {
      setIsLoading(true);
      await authAxios.delete(
        `${coreAPI}/shelters/${shelterId}/adoptionTemplates/${id}/delete`
      );
      setShelterTemplates([
        ...shelterTemplates.filter((item) => item._id != id),
      ]);
      toast.success("Xoá mẫu đơn thành công");
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Xoá mẫu đơn thất bại");
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  const handleDuplicate = async (templateId: any) => {
    try {
      setIsLoading(true);
      const response = await authAxios.post(
        `${coreAPI}/shelters/${shelterId}/adoptionTemplates/${templateId}/duplicateTemplate`
      );
      setShelterTemplates([...shelterTemplates, response.data]);
      toast.success("Tạo bản sao thành công");
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Tạo bản sao thất bại");
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const filtered = useMemo(() => {
    return (shelterTemplates ?? []).filter((t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [shelterTemplates, searchTerm]);

  const filteredAndSorted = useMemo(() => {
    const arr = [...filtered];

    if (!sortOption.species && !sortOption.alphabetical) {
      return arr;
    }
    arr.sort((a, b) => {
      if (sortOption.species) {
        const cmp = a.species.name.localeCompare(b.species.name);
        if (cmp != 0) return cmp;
      }

      if (sortOption.alphabetical) {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });
    return arr;
  }, [filtered, sortOption]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <Skeleton className="h-10 w-1/3 rounded" />
          <Skeleton className="h-10 w-24 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="w-full min-h-[35vh] border-0 shadow-sm animate-pulse"
            >
              <Skeleton className="h-2/3 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  // const table = useReactTable({
  //   data: shelterTemplates.sort(
  //     (a: any, b: any) =>
  //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //   ),
  //   columns,
  //   onSortingChange: setSorting,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   onPaginationChange: setPagination,
  //   initialState: {
  //     pagination: { pageIndex: 0, pageSize: 10 },
  //   },
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   state: {
  //     sorting,
  //     columnFilters,
  //     pagination,
  //   },
  // });

  if (!shelterTemplates || shelterTemplates.length == 0) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-around basis-1/3 gap-5">
            <Input
              placeholder="Tìm kiếm ..."
              className="max-w-sm"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-sm text-(--muted-foreground)">
                  Sắp xếp theo
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Checkbox
                    id="terms"
                    checked={sortOption.species}
                    onCheckedChange={(checked: boolean) =>
                      setSortOption({ ...sortOption, species: checked })
                    }
                  />
                  <span className="text-sm">Loài vật</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Checkbox
                    id="terms"
                    checked={sortOption.alphabetical}
                    onCheckedChange={(checked: boolean) =>
                      setSortOption({ ...sortOption, alphabetical: checked })
                    }
                  />
                  <span className="text-sm">A-Z</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className=" basis-1/3 flex justify-end">
            <CreateDialog />
          </div>
        </div>
        <div className="flex flex-col items-center flex-wrap mt-30">
          <h2 className="basis-1 text-xl font-semibold text-(--primary)">
            Không có mẫu đơn nào
          </h2>
          <p className="basis-1 text-sm text-(--muted-foreground) mb-4">
            Hãy tạo mẫu đơn nhận nuôi thú cưng đầu tiên của bạn!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4">
        <div className="flex justify-around basis-1/3 gap-5">
          <Input
            placeholder="Tìm kiếm ..."
            className="max-w-sm"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-xs">
                <SlidersHorizontal className="text-(--primary)" />
                Sắp xếp
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Checkbox
                  id="terms"
                  checked={sortOption.species}
                  onCheckedChange={(checked: boolean) =>
                    setSortOption({ ...sortOption, species: checked })
                  }
                />
                <span className="text-sm">Loài vật</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Checkbox
                  id="terms"
                  checked={sortOption.alphabetical}
                  onCheckedChange={(checked: boolean) =>
                    setSortOption({ ...sortOption, alphabetical: checked })
                  }
                />
                <span className="text-sm">A-Z</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className=" basis-1/3 flex justify-end">
          <CreateDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
        {filteredAndSorted.map((template) => (
          <Card className=" w-full min-h-[35vh] p-0 shadow-sm hover:shadow-lg transition-shadow dark:hover:shadow-lg dark:transition-shadow border-0">
            <Avatar
              onClick={() => navigate(`${template._id}`)}
              className="rounded-none w-full h-2/3 cursor-pointer"
            >
              <AvatarFallback className="rounded-none">
                <span className="text-6xl font-normal">
                  {template.title?.charAt(0).toUpperCase() || "T"}
                </span>
              </AvatarFallback>
            </Avatar>

            {/* Tiêu đề & subtitle */}
            <CardContent className="flex items-start justify-between px-4">
              {/* Icon layout */}
              <div className="flex translate-1 cursor-pointer text-muted-foreground">
                <Button className="rounded-none h-8 w-8">
                  <LayoutTemplate />
                </Button>
              </div>

              {/* Tiêu đề & subtitle */}
              <div className="flex-1 px-4 overflow-hidden">
                <h3
                  onClick={() => navigate(`${template._id}`)}
                  className="text-sm font-semibold truncate hover:text-primary cursor-pointer transition-colors"
                >
                  {template.title || "Mẫu đơn nhận nuôi thú cưng"}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {template.species.name}
                </p>
              </div>

              {/* Menu ellipsis */}
              <div className="flex-shrink-0 translate-1 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="sr-only">Open menu</span>
                    {/* <MoreHorizontal /> */}
                    <EllipsisVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to={`${template._id}`} className="flex gap-1">
                        <Pen /> Chỉnh sửa mẫu
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex gap-1"
                      onClick={() => {
                        handleDuplicate(template._id);
                      }}
                    >
                      <Copy /> Tạo bản sao
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleDelete(template._id)}
                    >
                      <Trash /> Xóa mẫu
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <div className="rounded-md border">
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
      </div> */}
      {/* <div className="flex items-center justify-between py-4">
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
      </div> */}
    </div>
  );
}
