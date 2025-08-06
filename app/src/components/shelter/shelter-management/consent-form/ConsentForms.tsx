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
  ArrowUpDown,
  Cat,
  CheckSquare,
  ChevronDown,
  Copy,
  Ellipsis,
  EllipsisVertical,
  FileText,
  LayoutTemplate,
  Map,
  MapPin,
  MoreHorizontal,
  Pen,
  Plus,
  SlidersHorizontal,
  Trash,
  Truck,
  User,
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

import { toast } from "sonner";
import { set } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { mockDeliveryMethods, type ConsentForm } from "@/types/ConsentForm";
import CreateDialog from "./CreateDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ConsentForms() {
  const { shelterId } = useParams();
  const { coreAPI, shelterConsentForms, setShelterConsentForms } =
    useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  const removeDiacritics = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const fetchShelterConsentForms = async () => {
    setIsLoading(true);

    await authAxios
      .get(`${coreAPI}/shelters/${shelterId}/consentForms/get-by-shelter`)
      .then((res) => {
        setShelterConsentForms(res.data);
      })
      .catch((err) => {
        // console.log("Error fetching consent forms:", err);
        toast.error(
          err.response?.data?.message ||
            "Không thể tải bản đồng ý nhận nuôi! Vui lòng thử lại sau."
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };

  useEffect(() => {
    fetchShelterConsentForms();
  }, [shelterId, coreAPI]);

  const handleDeleteConsentForm = async (selectedId: string) => {
    if (!selectedId) {
      toast.error("Không tìm thấy bản đồng ý nhận nuôi.");
      return;
    }
    setIsLoading(true);

    await authAxios
      .delete(
        `${coreAPI}/shelters/${shelterId}/consentForms/${selectedId}/delete`
      )
      .then(() => {
        setShelterConsentForms(
          shelterConsentForms.filter((form) => form._id != selectedId)
        );

        toast.success("Đã xóa bản đồng ý nhận nuôi thành công.");
      })
      .catch((err) => {
        // console.log("Error deleting consent form:", err);
        toast.error(
          err.response?.data?.message ||
            "Không thể xóa bản đồng ý nhận nuôi! Vui lòng thử lại sau."
        );
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      });
  };
  const mockStatus = [
    {
      value: "draft",
      label: "Đang chuẩn bị",
      color: "secondary",
    },
    {
      value: "send",
      label: "Chờ phản hồi",
      color: "chart-3",
    },
    {
      value: "accepted",
      label: "Đã chấp nhận",
      color: "chart-2",
    },
    {
      value: "approved",
      label: "Hoàn thành",
      color: "chart-4",
    },
    {
      value: "rejected",
      label: "Yêu cầu sửa",
      color: "chart-1",
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "destructive",
    },
  ];

  const filteredForms = useMemo(() => {
    return shelterConsentForms.filter((form) => {
      const keyword = removeDiacritics(searchTerm.toLowerCase());
      const target =
        removeDiacritics(form.title?.toLowerCase() || "") +
        " " +
        removeDiacritics(form.adopter?.fullName?.toLowerCase() || "") +
        " " +
        removeDiacritics(form.pet?.name?.toLowerCase() || "");
      return target.includes(keyword);
    });
  }, [searchTerm, shelterConsentForms]);

  const approvedForms = useMemo(() => {
    return filteredForms.filter((form) => form.status === "approved");
  }, [filteredForms]);
  
  const paginatedForms = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return approvedForms.slice(start, end);
  }, [approvedForms, page]);
  
  const totalPages = Math.ceil(approvedForms.length / limit);
  

  const renderPagination = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage((prev) => Math.max(1, prev - 1));
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={page === i + 1}
              onClick={(e) => {
                e.preventDefault();
                setPage(i + 1);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage((prev) => Math.min(totalPages, prev + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-10 w-20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="relative w-full h-4/5 bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
            >
              <Skeleton className="w-full h-1/2" />

              <Skeleton className="absolute -top-8 left-4 w-16 h-16" />

              <Skeleton className="absolute top-1 left-20 h-4 w-24" />

              <div className="px-4 pt-8 flex flex-col space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>

              <Skeleton className="absolute bottom-4 right-4 h-4 w-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (!shelterConsentForms || paginatedForms.length == 0) {
    return (
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            <Activity className="text-(--primary)" /> Đang xử lý
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckSquare className="text-(--primary)" /> Hoàn thành
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
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
              </div>

              <div className=" basis-1/3 flex justify-end">
                {/* <CreateDialog /> */}
              </div>
            </div>
            <div className="flex flex-col items-center flex-wrap mt-30">
              <h2 className="basis-1 text-xl font-semibold text-(--primary)">
                Chưa có bản đồng ý nhận nuôi nào.
              </h2>
              <p className="basis-1 text-sm text-(--muted-foreground) mb-4">
                Hãy tạo bản đồng ý nhận nuôi mới để quản lý quá trình nhận nuôi
                thú cưng.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="approved">
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
              </div>

              <div className=" basis-1/3 flex justify-end">
                {/* <CreateDialog /> */}
              </div>
            </div>
            <div className="flex flex-col items-center flex-wrap mt-30">
              <h2 className="basis-1 text-xl font-semibold text-(--primary)">
                Chưa có bản đồng ý nhận nuôi nào.
              </h2>
              <p className="basis-1 text-sm text-(--muted-foreground) mb-4">
                Hãy tạo bản đồng ý nhận nuôi mới để quản lý quá trình nhận nuôi
                thú cưng.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList>
        <TabsTrigger value="active">
          <Activity className="text-(--primary)" /> Đang xử lý
        </TabsTrigger>
        <TabsTrigger value="approved">
          <CheckSquare className="text-(--primary)" /> Hoàn thành
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
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
            </div>

            <div className=" basis-1/3 flex justify-center">
              {/* <CreateDialog /> */}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {filteredForms
              ?.filter((c) => c?.status != "approved")
              ?.map((consentForm) => {
                return (
                  <Card
                    key={consentForm._id}
                    className=" w-full h-4/5 p-0 rounded-sm shadow-sm hover:shadow-lg transition-shadow dark:hover:shadow-lg dark:transition-shadow border-0 gap-0"
                  >
                    <Avatar
                      onClick={() => navigate(`${consentForm._id}`)}
                      className="w-full  cursor-pointer h-1/2 rounded-sm"
                    >
                      <AvatarImage
                        src={consentForm?.pet?.photos[0]}
                        className="object-center object-cover "
                      />
                      <AvatarFallback className="rounded-none">
                        <span className="text-6xl font-normal">
                          {consentForm.pet?.name?.charAt(0).toUpperCase() ||
                            "Paw"}
                        </span>
                      </AvatarFallback>
                    </Avatar>

                    <CardContent className="relative px-4 pt-0 flex items-start justify-between">
                      {/* Đây là avatar thứ hai */}
                      <Avatar className="absolute -top-8 left-4 z-10 h-16 w-16 ring-2 ring-(--primary) rounded-sm">
                        <AvatarImage
                          src={consentForm?.adopter.avatar}
                          className="object-center object-cover"
                        />
                        <AvatarFallback className="rounded-none">
                          <span className="text-3xl font-normal">
                            {consentForm.adopter.name
                              ?.charAt(0)
                              .toUpperCase() || "A"}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute top-1 left-22 ">
                        <Badge className="inline-block max-w-[10rem] sm:max-w-[5rem] md:max-w-[5rem] lg:max-w-[5rem] xl:max-w-[10rem] text-xs hover:bg-(--primary)/50 p-0 px-0.5 rounded-sm">
                          <span className="inline-flex w-full items-center text-xs">
                            <MapPin
                              strokeWidth={3}
                              size={"12px"}
                              className=" mr-1"
                            />{" "}
                            <span className="w-full truncate">
                              {consentForm.address || "Địa chỉ chưa xác định"}
                            </span>
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-col justify-around mt-3 pt-8 flex-1 overflow-hidden">
                        <h3 className="flex items-center text-xs font-semibold min-w-0">
                          <FileText
                            size={"15px"}
                            className="mr-1 flex-shrink-0"
                          />
                          <span className="truncate whitespace-nowrap overflow-hidden hover:text-primary cursor-pointer transition-colors">
                            {consentForm.title || "Bản đồng ý nhận nuôi"}
                          </span>
                        </h3>

                        <h3 className="flex items-center text-xs font-semibold min-w-0">
                          <User size={"15px"} className="mr-1 flex-shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden hover:text-primary cursor-pointer transition-colors">
                            {consentForm.adopter.fullName || "Người nhận nuôi"}
                          </span>
                        </h3>

                        <p className="flex items-center text-xs text-muted-foreground min-w-0">
                          <Cat size={"15px"} className="mr-1 flex-shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden">
                            {consentForm.pet?.name} #
                            {consentForm.pet?.petCode || "Mã thú cưng"}
                          </span>
                        </p>

                        <p className="flex items-center text-xs text-muted-foreground min-w-0">
                          <Truck size={"15px"} className="mr-1 flex-shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden">
                            {mockDeliveryMethods.find(
                              (method) =>
                                method.value.toUpperCase() ===
                                consentForm.deliveryMethod.toUpperCase()
                            )?.label || consentForm.deliveryMethod}
                          </span>
                        </p>

                        <Badge className="mt-2" variant={"outline"}>
                          <span className="text-xs">
                            {mockStatus.find(
                              (mock) =>
                                mock.value.toUpperCase() ===
                                consentForm.status.toUpperCase()
                            )?.label || consentForm.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex-shrink-0 translate-y-10 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link
                                to={`${consentForm._id}`}
                                className="flex gap-1"
                              >
                                <Pen /> Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="cursor-pointer"
                                  onSelect={(event) => event.preventDefault()}
                                >
                                  <Trash /> Xóa bản đồng ý
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Bạn có chắc chắn muốn xóa bản đồng ý này?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Việc xóa bản đồng ý sẽ không thể hoàn tác.
                                    Bạn có chắc chắn muốn xóa bản đồng ý này
                                    không?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className=" bg-(--background) text-(--destructive) ring-1 ring-(--destructive)  hover:bg-(--destructive) hover:text-(--background) transition-colors"
                                    onClick={() => {
                                      handleDeleteConsentForm(consentForm._id);
                                    }}
                                  >
                                    Xóa bản đồng ý
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
        
      </TabsContent>
      <TabsContent value="approved">
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
            </div>

            <div className=" basis-1/3 flex justify-center">
              {/* <CreateDialog /> */}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {paginatedForms
              ?.map((consentForm) => {
                return (
                  <Card
                    key={consentForm._id}
                    className=" w-full h-4/5 p-0 rounded-sm shadow-sm hover:shadow-lg transition-shadow dark:hover:shadow-lg dark:transition-shadow border-0 gap-0"
                  >
                    <Avatar
                      onClick={() => navigate(`${consentForm._id}`)}
                      className="w-full  cursor-pointer h-1/2 rounded-sm"
                    >
                      <AvatarImage
                        src={consentForm?.pet?.photos[0]}
                        className="object-center object-cover "
                      />
                      <AvatarFallback className="rounded-none">
                        <span className="text-6xl font-normal">
                          {consentForm.pet?.name?.charAt(0).toUpperCase() ||
                            "Paw"}
                        </span>
                      </AvatarFallback>
                    </Avatar>

                    <CardContent className="relative px-4 pt-0 flex items-start justify-between">
                      {/* Đây là avatar thứ hai */}
                      <Avatar className="absolute -top-8 left-4 z-10 h-16 w-16 ring-2 ring-(--primary) rounded-sm">
                        <AvatarImage
                          src={consentForm?.adopter.avatar}
                          className="object-center object-cover"
                        />
                        <AvatarFallback className="rounded-none">
                          <span className="text-3xl font-normal">
                            {consentForm.adopter.name
                              ?.charAt(0)
                              .toUpperCase() || "A"}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute top-1 left-22 ">
                        <Badge className="inline-block max-w-[10rem] sm:max-w-[5rem] md:max-w-[5rem] lg:max-w-[5rem] xl:max-w-[10rem] text-xs hover:bg-(--primary)/50 p-0 px-0.5 rounded-sm">
                          <span className="inline-flex w-full items-center text-xs">
                            <MapPin
                              strokeWidth={3}
                              size={"12px"}
                              className=" mr-1"
                            />{" "}
                            <span className="w-full truncate">
                              {consentForm.address || "Địa chỉ chưa xác định"}
                            </span>
                          </span>
                        </Badge>
                      </div>

                      <div className="flex flex-col justify-around mt-3 pt-8 flex-1 overflow-hidden">
                        <h3 className="flex items-center text-xs font-semibold min-w-0">
                          <FileText
                            size={"15px"}
                            className="mr-1 flex-shrink-0"
                          />
                          <span className="truncate whitespace-nowrap overflow-hidden hover:text-primary cursor-pointer transition-colors">
                            {consentForm.title || "Bản đồng ý nhận nuôi"}
                          </span>
                        </h3>

                        <h3 className="flex items-center text-xs font-semibold min-w-0">
                          <User size={"15px"} className="mr-1 flex-shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden hover:text-primary cursor-pointer transition-colors">
                            {consentForm.adopter.fullName || "Người nhận nuôi"}
                          </span>
                        </h3>

                        <p className="flex items-center text-xs text-muted-foreground min-w-0">
                          <Cat size={"15px"} className="mr-1 flex-shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden">
                            {consentForm.pet?.name} #
                            {consentForm.pet?.petCode || "Mã thú cưng"}
                          </span>
                        </p>

                        <p className="flex items-center text-xs text-muted-foreground min-w-0">
                          <Truck size={"15px"} className="mr-1 flex-shrink-0" />
                          <span className="truncate whitespace-nowrap overflow-hidden">
                            {mockDeliveryMethods.find(
                              (method) =>
                                method.value.toUpperCase() ===
                                consentForm.deliveryMethod.toUpperCase()
                            )?.label || consentForm.deliveryMethod}
                          </span>
                        </p>

                        <Badge className="mt-2" variant={"outline"}>
                          <span className="text-xs">
                            {mockStatus.find(
                              (mock) =>
                                mock.value.toUpperCase() ===
                                consentForm.status.toUpperCase()
                            )?.label || consentForm.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex-shrink-0 translate-y-10 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Link
                                to={`${consentForm._id}`}
                                className="flex gap-1"
                              >
                                <Pen /> Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="cursor-pointer"
                                  onSelect={(event) => event.preventDefault()}
                                >
                                  <Trash /> Xóa bản đồng ý
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Bạn có chắc chắn muốn xóa bản đồng ý này?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Việc xóa bản đồng ý sẽ không thể hoàn tác.
                                    Bạn có chắc chắn muốn xóa bản đồng ý này
                                    không?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className=" bg-(--background) text-(--destructive) ring-1 ring-(--destructive)  hover:bg-(--destructive) hover:text-(--background) transition-colors"
                                    onClick={() => {
                                      handleDeleteConsentForm(consentForm._id);
                                    }}
                                  >
                                    Xóa bản đồng ý
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          <div className="w-full mt-5 ">{renderPagination()}</div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
