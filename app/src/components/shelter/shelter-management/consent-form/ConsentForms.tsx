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

import { toast } from "sonner";
import { set } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { type ConsentForm } from "@/types/ConsentForm";

export function ConsentForms() {
  const { shelterId } = useParams();
  const { coreAPI } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [shelterConsentForms, setShelterConsentForms] = useState<ConsentForm[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(false);

  const removeDiacritics = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

  const fetchShelterConsentForms = async () => {
    setIsLoading(true);
    await authAxios.get(`${coreAPI}/shelters/${shelterId}/consent-forms`);
  };
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

          {/* <DropdownMenu>
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
            </DropdownMenu> */}
        </div>

        <div className=" basis-1/3 flex justify-end">
          {/* <CreateDialog /> */}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
        <Card className=" w-full h-[35vh] p-0 shadow-sm hover:shadow-lg transition-shadow dark:hover:shadow-lg dark:transition-shadow border-0 gap-0">
          <Avatar
            //   onClick={() => navigate(`${template._id}`)}
            className="rounded-none w-full h-2/3 cursor-pointer h-1/2"
          >
            <AvatarImage
              src="https://i.pinimg.com/736x/14/94/43/14944301487403e23287067341080057.jpg"
              className="object-center object-cover "
            />
            <AvatarFallback className="rounded-none">
              <span className="text-6xl font-normal">
                template.title?.charAt(0).toUpperCase() || "T"
              </span>
            </AvatarFallback>
          </Avatar>

          <CardContent className="flex items-start justify-between px-4">
            {/* Tiêu đề & subtitle */}
            <div className="flex-1 px-4 overflow-hidden">
              <Avatar
                //   onClick={() => navigate(`${template._id}`)}
                className="rounded-none h-2/3 w-2/3 cursor-pointer ring-2 ring-(--primary) translate-y-[-1.5rem]"
              >
                <AvatarImage
                  src="https://i.pinimg.com/736x/14/94/43/14944301487403e23287067341080057.jpg"
                  className="object-center object-cover"
                />
                <AvatarFallback className="rounded-none">
                  <span className="text-6xl font-normal">
                    template.title?.charAt(0).toUpperCase() || "T"
                  </span>
                </AvatarFallback>
              </Avatar>
              <h3
                //   onClick={() => navigate(`${template._id}`)}
                className="text-sm font-semibold truncate hover:text-primary cursor-pointer transition-colors"
              >
                template.title || "Mẫu đơn nhận nuôi thú cưng"
              </h3>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              template.species.name
            </p>

            <div className="flex-shrink-0 translate-1 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <span className="sr-only">Open menu</span>
                  {/* <MoreHorizontal /> */}
                  <EllipsisVertical className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={``} className="flex gap-1">
                      <Pen /> Chỉnh sửa mẫu
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-1" onClick={() => {}}>
                    <Copy /> Tạo bản sao
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <Trash /> Xóa mẫu
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
