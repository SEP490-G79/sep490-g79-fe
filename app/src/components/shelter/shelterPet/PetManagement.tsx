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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MedicalRecordList from "./MedicalRecordList";
import CreatableSelect from "react-select/creatable";
import { toast } from "sonner";
import type { Breed } from "@/types/Breed";
import ReactSelect from "react-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";

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
  species: string | { name: string };
  photo?: string;
  petCode?: string;
  breeds?: (string | { name: string })[];
  intakeTime?: string;
  foundLocation?: string;
  shelter?: { name: string } | string;
  tokenMoney?: number;
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
  const [speciesList, setSpeciesList] = React.useState<
    { _id: string; name: string }[]
  >([]);
  const [breedList, setBreedList] = React.useState<Breed[]>([]);
  const [form, setForm] = React.useState<Pet & { breeds?: string[] }>({
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
    species: "",
    breeds: [],
  });

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
        <img
          src={
            row.original.photos?.[0]
              ? row.original.photos[0].startsWith("http")
                ? row.original.photos[0]
                : `http://localhost:9999${row.original.photos[0]}`
              : "/placeholder.png"
          }
          alt="pet"
          className="w-10 h-10 object-cover rounded"
        />
      ),
    },
    { accessorKey: "name", header: "Tên" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) =>
        row.original.status === "available" ? "có sẵn" : "chưa có sẵn",
    },

    {
      accessorKey: "breeds",
      header: "Giống loài",
      cell: ({ row }) => (
        <span>
          {(row.original.breeds || [])
            .map((b: string | { name: string }) =>
              typeof b === "string" ? b : b.name
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
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setDetailPet(row.original);
                setShowDetail(true);
              }}
            >
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditPet(row.original);
                // Helper type guard
                function hasId(obj: unknown): obj is { _id: string } {
                  return (
                    typeof obj === "object" &&
                    obj !== null &&
                    "_id" in obj &&
                    typeof (obj as { _id?: unknown })._id === "string"
                  );
                }
                setForm({
                  ...row.original,
                  photo: row.original.photos?.[0] || "",
                  species:
                    typeof row.original.species === "string"
                      ? row.original.species
                      : hasId(row.original.species)
                      ? row.original.species._id
                      : "",
                  breeds: Array.isArray(row.original.breeds)
                    ? row.original.breeds.map((b) =>
                        typeof b === "string" ? b : hasId(b) ? b._id : ""
                      )
                    : [],
                });
                setShowForm(true);
              }}
            >
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                if (row.original._id) {
                  await deletePet(row.original._id);
                  toast.success("Xóa thành công");
                  fetchPets();
                }
              }}
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

  const fetchPets = async () => {
    const res = await getAllPets();
    setData((res.data as Pet[]) || []);
  };

  React.useEffect(() => {
    fetchPets();
  }, []);
  React.useEffect(() => {
    fetch("http://localhost:9999/species/getAll")
      .then((res) => res.json())
      .then((data) => setSpeciesList(data));
  }, []);
  React.useEffect(() => {
    fetch("http://localhost:9999/breeds/getAll")
      .then((res) => res.json())
      .then((data) => setBreedList(data));
  }, []);

  const validateForm = () => {
    if (!form.name) return toast.error("Tên thú nuôi không được để trống");
    if (/^\d+$/.test(form.name.trim()))
      return toast.error("Tên thú nuôi không được chỉ là số");
    if (!form.photo) return toast.error("Vui lòng chọn ảnh cho thú nuôi");
    if (!form.species) return toast.error("Vui lòng chọn hoặc thêm loài");
    if (!form.color) return toast.error("Màu lông không được để trống");
    if (/^\d+$/.test(form.color.trim()))
      return toast.error("Màu lông không được chỉ là số");
    if (!form.age || Number(form.age) < 0)
      return toast.error("Tuổi không hợp lệ");
    if (!form.weight || Number(form.weight) <= 0)
      return toast.error("Cân nặng không hợp lệ");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (validateForm() !== true) return;
    const payload = {
      ...form,
      status: "unavailable",
      age: Number(form.age),
      weight: Number(form.weight),
      photos: form.photo ? [form.photo] : [],
      shelter: user._id,
      species: form.species,
      breeds: form.breeds,
    };
    delete (payload as { photo?: string }).photo;
    if (editPet && editPet._id) await updatePet(editPet._id, payload);
    else await createPet(payload);
    toast.success(editPet ? "Cập nhật thành công" : "Tạo mới thành công");
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
      species: "",
      breeds: [],
    });
    fetchPets();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    setForm((prev) => ({ ...prev, photo: url }));
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
              species: "",
              breeds: [],
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
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl min-w-[700px] w-full">
          <DialogHeader>
            <DialogTitle>
              {editPet ? "Cập nhật thú nuôi" : "Thêm thú nuôi"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tên thú nuôi *
              </label>
              <Input
                placeholder="Nhập tên thú nuôi"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tuổi (tháng) *
              </label>
              <Input
                type="number"
                placeholder="Nhập tuổi"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Giới tính
              </label>
              <Select
                value={String(form.isMale)}
                onValueChange={(v: string) =>
                  setForm({ ...form, isMale: v === "true" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Đực</SelectItem>
                  <SelectItem value="false">Cái</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Cân nặng (kg) *
              </label>
              <Input
                type="number"
                placeholder="Nhập cân nặng"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Màu lông *
              </label>
              <Input
                placeholder="Nhập màu lông"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Đặc điểm nhận dạng
              </label>
              <Input
                placeholder="Nhập đặc điểm nhận dạng"
                value={form.identificationFeature}
                onChange={(e) =>
                  setForm({ ...form, identificationFeature: e.target.value })
                }
                className=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tình trạng triệt sản
              </label>
              <Select
                value={String(form.sterilizationStatus)}
                onValueChange={(v: string) =>
                  setForm({ ...form, sterilizationStatus: v === "true" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tình trạng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Đã triệt sản</SelectItem>
                  <SelectItem value="false">Chưa triệt sản</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Loài *
              </label>
              <CreatableSelect
                isClearable
                placeholder="Chọn hoặc thêm loài mới..."
                value={
                  speciesList.find((s) => s._id === form.species)
                    ? {
                        value: form.species,
                        label: speciesList.find((s) => s._id === form.species)
                          ?.name,
                      }
                    : null
                }
                options={speciesList.map((s) => ({
                  value: s._id,
                  label: s.name,
                }))}
                onChange={(option) =>
                  setForm({ ...form, species: option ? option.value : "" })
                }
                onCreateOption={async (inputValue) => {
                  const res = await fetch(
                    "http://localhost:9999/species/create",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: inputValue }),
                    }
                  );
                  if (res.ok) {
                    const newSpecies = await res.json();
                    setSpeciesList((prev) => [...prev, newSpecies]);
                    setForm((prev) => ({ ...prev, species: newSpecies._id }));
                  } else {
                    alert("Không thể thêm loài mới. Có thể tên đã tồn tại.");
                  }
                }}
              />
            </div>
            <div className="col-span-4 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Giống loài (tối đa 2)
              </label>
              <ReactSelect
                isMulti
                placeholder="Chọn tối đa 2 giống loài..."
                value={breedList
                  .filter((b) => form.breeds?.includes(b._id))
                  .map((b) => ({ value: b._id, label: b.name }))}
                options={breedList.map((b) => ({
                  value: b._id,
                  label: b.name,
                }))}
                onChange={(options) => {
                  const values = options
                    ? (options as { value: string; label: string }[])
                        .map((o) => o.value)
                        .slice(0, 2)
                    : [];
                  setForm({ ...form, breeds: values });
                }}
                isOptionDisabled={(option) => {
                  if (!form.breeds) return false;
                  return (
                    form.breeds.length >= 2 &&
                    !form.breeds.includes(option.value)
                  );
                }}
              />
            </div>
            <div className="col-span-4 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Ảnh thú nuôi *
              </label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {form.photo && (
                <img
                  src={form.photo}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded mt-2"
                />
              )}
            </div>
            <div className="col-span-4 flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Mô tả</label>
              <Textarea
                placeholder="Nhập mô tả về thú nuôi"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div className="col-span-4 flex justify-end">
              <Button type="submit" className="w-32">
                {editPet ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail View in Center */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-5xl min-w-[900px] w-full">
          <DialogHeader>
            <DialogTitle>Chi tiết thú nuôi</DialogTitle>
          </DialogHeader>
          {detailPet && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Hiển thị tất cả ảnh */}
                <div className="flex flex-col gap-2 items-center">
                  {detailPet.photos && detailPet.photos.length > 0 ? (
                    <>
                      <img
                        src={
                          detailPet.photos[0].startsWith("http")
                            ? detailPet.photos[0]
                            : `http://localhost:9999${detailPet.photos[0]}`
                        }
                        alt={detailPet.name}
                        className="w-full md:w-40 h-40 object-cover rounded border"
                      />
                      {detailPet.photos.length > 1 && (
                        <div className="flex gap-2 mt-2 flex-wrap justify-center">
                          {detailPet.photos.slice(1).map((photo, idx) => (
                            <img
                              key={idx}
                              src={
                                photo.startsWith("http")
                                  ? photo
                                  : `http://localhost:9999${photo}`
                              }
                              alt={`pet-${idx}`}
                              className="w-14 h-14 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="No pet"
                      className="w-full md:w-40 h-40 object-cover rounded border"
                    />
                  )}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-3 text-sm md:text-base text-gray-800">
                  <p>
                    <strong>Pet ID:</strong> {detailPet._id}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {detailPet.status || "Unknown"}
                  </p>
                  <p>
                    <strong>Giới tính:</strong>{" "}
                    {detailPet.isMale === true
                      ? "Đực"
                      : detailPet.isMale === false
                      ? "Cái"
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Tuổi:</strong>{" "}
                    {detailPet.age !== undefined
                      ? detailPet.age + " tháng"
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Cân nặng:</strong>{" "}
                    {detailPet.weight !== undefined
                      ? detailPet.weight + " kg"
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Màu lông:</strong> {detailPet.color || "Unknown"}
                  </p>
                  <p>
                    <strong>Giống loài:</strong>{" "}
                    {detailPet.breeds && detailPet.breeds.length > 0
                      ? detailPet.breeds
                          .map((b: string | { name: string }) =>
                            typeof b === "string" ? b : b.name
                          )
                          .join(", ")
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Loài:</strong>{" "}
                    {typeof detailPet.species === "string"
                      ? detailPet.species
                      : (detailPet.species as { name: string })?.name ||
                        "Unknown"}
                  </p>
                  <p>
                    <strong>Triệt sản:</strong>{" "}
                    {detailPet.sterilizationStatus === true
                      ? "Đã triệt sản"
                      : detailPet.sterilizationStatus === false
                      ? "Chưa triệt sản"
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Đặc điểm:</strong>{" "}
                    {detailPet.identificationFeature || "Không có"}
                  </p>
                  <p>
                    <strong>Ngày vào:</strong>{" "}
                    {detailPet.intakeTime
                      ? new Date(detailPet.intakeTime).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Vị trí tìm thấy:</strong>{" "}
                    {detailPet.foundLocation || "Unknown"}
                  </p>
                  <p>
                    <strong>Nhà bảo trợ:</strong>{" "}
                    {typeof detailPet.shelter === "string"
                      ? detailPet.shelter
                      : (detailPet.shelter as { name: string })?.name ||
                        "Unknown"}
                  </p>
                  <p>
                    <strong>Tiền đặt cọc:</strong>{" "}
                    {detailPet.tokenMoney !== undefined
                      ? Number(detailPet.tokenMoney).toLocaleString() + " VND"
                      : "Unknown"}
                  </p>
                  <div className="col-span-full mt-2">
                    <span className="font-semibold text-gray-600">Mô tả:</span>{" "}
                    {detailPet.bio || "Không có mô tả"}
                  </div>
                </div>
              </div>
              <MedicalRecordList petId={detailPet._id ?? ""} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
