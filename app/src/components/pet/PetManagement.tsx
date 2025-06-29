"use client";

import * as React from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";

import { getAllPets, createPet, updatePet, deletePet } from "@/apis/pet.api";
import { useAppContext } from "@/context/AppContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MedicalRecordList from "./MedicalRecordList";

interface Pet {
  _id?: string;
  name: string;
  photos: string[];
  age: number | string;
  isMale: boolean;
  weight: number | string;
  color: string;
  identificationFeature: string;
  sterilizationStatus: boolean;
  bio: string;
  status: string;
}

export default function PetManagement() {
  const { user } = useAppContext();
  const [data, setData] = React.useState<Pet[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [showForm, setShowForm] = React.useState(false);
  const [editPet, setEditPet] = React.useState<Pet | null>(null);
  const [showDetail, setShowDetail] = React.useState(false);
  const [detailPet, setDetailPet] = React.useState<Pet | null>(null);

  const [form, setForm] = React.useState<Pet & { photo?: string }>({
    name: "",
    photos: [],
    age: "",
    isMale: true,
    weight: "",
    color: "",
    identificationFeature: "",
    sterilizationStatus: false,
    bio: "",
    status: "unavailable",
    photo: undefined,
  });

  const fetchPets = async () => {
    const res = await getAllPets();
    setData((res.data as Pet[]) || []);
  };

  React.useEffect(() => {
    fetchPets();
  }, []);

  const columns: ColumnDef<Pet>[] = [
    {
      accessorKey: "photos",
      header: "Ảnh",
      cell: ({ row }: { row: { original: Pet } }) => (
        <img
          src={`http://localhost:9999${String(row.original.photos?.[0] ?? "")}`}
          alt={row.original.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({
        column,
      }: {
        column: {
          getIsSorted: () => "asc" | "desc" | false;
          toggleSorting: (desc: boolean) => void;
        };
      }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="flex items-center gap-1"
          >
            Tên
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({
        column,
      }: {
        column: {
          getIsSorted: () => "asc" | "desc" | false;
          toggleSorting: (desc: boolean) => void;
        };
      }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="flex items-center gap-1"
          >
            Trạng thái
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          </Button>
        );
      },
      cell: ({ row }: { row: { getValue: (key: string) => any } }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "identificationFeature",
      header: ({
        column,
      }: {
        column: {
          getIsSorted: () => "asc" | "desc" | false;
          toggleSorting: (desc: boolean) => void;
        };
      }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="flex items-center gap-1"
          >
            Đặc điểm
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          </Button>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "sterilizationStatus",
      header: ({
        column,
      }: {
        column: {
          getIsSorted: () => "asc" | "desc" | false;
          toggleSorting: (desc: boolean) => void;
        };
      }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(isSorted === "asc")}
            className="flex items-center gap-1"
          >
            Triệt sản
            {isSorted === "asc" && <ArrowUp className="w-4 h-4" />}
            {isSorted === "desc" && <ArrowDown className="w-4 h-4" />}
          </Button>
        );
      },
      cell: ({ row }: { row: { getValue: (key: string) => any } }) =>
        row.getValue("sterilizationStatus") ? "Đã triệt sản" : "Chưa",
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: { original: Pet } }) => {
        const pet = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetail(true);
                  setDetailPet(pet);
                }}
              >
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowForm(true);
                  setEditPet(pet);
                  setForm({ ...pet, photo: pet.photos?.[0] });
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  if (pet._id) {
                    await deletePet(pet._id);
                    fetchPets();
                  }
                }}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      ...form,
      age: Number(form.age),
      weight: Number(form.weight),
      photos: form.photo ? [form.photo] : [],
      shelter: user._id,
    };
    delete (payload as any).photo;
    if (editPet && editPet._id) await updatePet(editPet._id, payload);
    else await createPet(payload);
    setShowForm(false);
    setEditPet(null);
    setForm({
      name: "",
      photos: [],
      age: "",
      isMale: true,
      weight: "",
      color: "",
      identificationFeature: "",
      sterilizationStatus: false,
      bio: "",
      status: "unavailable",
      photo: undefined,
    });
    fetchPets();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:9999/pets/upload-image", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setForm((prev) => ({ ...prev, photo: data.url }));
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setShowForm(true);
            setEditPet(null);
            setForm({
              name: "",
              photos: [],
              age: "",
              isMale: true,
              weight: "",
              color: "",
              identificationFeature: "",
              sterilizationStatus: false,
              bio: "",
              status: "unavailable",
            });
          }}
        >
          Thêm thú nuôi
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Form Add/Edit */}
      <Drawer open={showForm} onOpenChange={setShowForm} direction="right">
        <DrawerContent className="max-w-md ml-auto">
          <DrawerHeader>
            <DrawerTitle>
              {editPet ? "Cập nhật thú nuôi" : "Thêm thú nuôi"}
            </DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
            <Input
              placeholder="Tên thú nuôi"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {form.photo && (
              <img
                src={`http://localhost:9999${String(form.photo ?? "")}`}
                alt="Preview"
                className="w-16 h-16 object-cover rounded mt-2"
              />
            )}
            <Input
              type="number"
              placeholder="Tuổi"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <Select
              value={String(form.isMale)}
              onValueChange={(v) => setForm({ ...form, isMale: v === "true" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Đực</SelectItem>
                <SelectItem value="false">Cái</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Cân nặng"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
            <Input
              placeholder="Màu lông"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
            <Input
              placeholder="Đặc điểm"
              value={form.identificationFeature}
              onChange={(e) =>
                setForm({ ...form, identificationFeature: e.target.value })
              }
            />
            <Select
              value={String(form.sterilizationStatus)}
              onValueChange={(v) =>
                setForm({ ...form, sterilizationStatus: v === "true" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Triệt sản?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Đã triệt sản</SelectItem>
                <SelectItem value="false">Chưa triệt sản</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Mô tả"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unavailable">Unavailable</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="adopted">Adopted</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">{editPet ? "Cập nhật" : "Tạo mới"}</Button>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Detail View in Center */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết thú nuôi</DialogTitle>
          </DialogHeader>
          {detailPet && (
            <div className="flex flex-col gap-6">
              <div className="flex gap-6">
                <img
                  src={`http://localhost:9999${detailPet.photos?.[0]}`}
                  alt={detailPet.name}
                  className="w-40 h-40 object-cover rounded border"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <b>Tên:</b> {detailPet.name}
                  </div>
                  <div>
                    <b>Tuổi:</b> {detailPet.age}
                  </div>
                  <div>
                    <b>Giới tính:</b> {detailPet.isMale ? "Đực" : "Cái"}
                  </div>
                  <div>
                    <b>Cân nặng:</b> {detailPet.weight}
                  </div>
                  <div>
                    <b>Màu lông:</b> {detailPet.color}
                  </div>
                  <div>
                    <b>Đặc điểm:</b> {detailPet.identificationFeature}
                  </div>
                  <div>
                    <b>Triệt sản:</b>{" "}
                    {detailPet.sterilizationStatus
                      ? "Đã triệt sản"
                      : "Chưa triệt sản"}
                  </div>
                  <div>
                    <b>Trạng thái:</b> {detailPet.status}
                  </div>
                  <div className="col-span-2">
                    <b>Mô tả:</b> {detailPet.bio}
                  </div>
                </div>
              </div>
              <MedicalRecordList petId={detailPet._id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
