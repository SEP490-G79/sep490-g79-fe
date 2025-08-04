// src/pages/Shelters.tsx
import React, { useEffect, useState, useMemo, useContext } from "react";
import ShelterCard from "@/components/home-page/ShelterCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { type Shelter } from "@/types/Shelter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AppContext from "@/context/AppContext";
import {
  sortSheltersByProximity,
  detectCurrentLocation,
} from "@/utils/sortByDistance";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
interface LatLng {
  lat: number;
  lng: number;
}
export default function Shelters() {
  // Từ khoá tìm kiếm
  const { shelters } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [sortOption, setSortOption] = useState({
    distance: false,
    alphabetical: false,
  });
  const filteredShelters = useMemo(
    () =>
      (shelters ?? []).filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, shelters]
  );

  const handleSortByDistance = async (enabled: boolean) => {
    setSortOption((o) => ({ ...o, distance: enabled }));
    if (enabled) {
      setLoadingLoc(true);
      try {
        const loc = await detectCurrentLocation();
        setUserLocation(loc);
      } catch {
        toast.error(
          "Không thể xác định vị trí của bạn. Vui lòng cho phép quyền truy cập vị trí."
        );
        setSortOption((o) => ({ ...o, distance: false }));
      } finally {
        setTimeout(() => {
          setLoadingLoc(false);
        }, 200);
      }
    }
  };

  const handleSortAZ = (enabled: boolean) => {
    setSortOption((o) => ({ ...o, alphabetical: enabled }));
  };

  const displayedShelters = useMemo(() => {
    let list = [...filteredShelters];
    // if (userLocation) {
    //   // toast.success("Sắp xếp danh sách theo vị trí của bạn thành công!");
    //   return sortSheltersByProximity(filteredShelters, userLocation);
    // }
    // return filteredShelters;

    if (sortOption.distance && userLocation) {
      list = sortSheltersByProximity(list, userLocation);
    }

    if (sortOption.alphabetical) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [
    filteredShelters,
    userLocation,
    sortOption.distance,
    sortOption.alphabetical,
  ]);

  const placeholders = [
    "Tìm kiếm trung tâm cứu hộ",
    "Tìm kiếm theo tên trung tâm",
  ];

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setSearchTerm("");
  };
  if (loadingLoc) {
    return (
      <div className="w-full h-full flex flex-wrap justify-around px-10 py-5">
        <Breadcrumb className="basis-full mb-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="hover:text-primary text-muted-foreground"
                href="/"
              >
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Trung tâm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search */}
        <div className="basis-full flex justify-center my-5">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
          <Button variant="ghost" className="" size="default">
            <SlidersHorizontal />
          </Button>
        </div>

        {/* Title */}
        <div className="basis-full my-5 text-center">
          <h1 className="text-3xl font-bold">Hệ Thống Trung Tâm Cứu Hộ</h1>
          <p className="text-xl">
            Chọn một nơi gần bạn nhất và chung tay mang đến tương lai tươi sáng
            cho các bé.
          </p>
        </div>

        {/* Grid of cards skeleton */}
        <div className="basis-full px-40 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-50 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-wrap justify-around px-10 py-5">
      {/* Breadcrumb */}
      <Breadcrumb className="basis-full mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="hover:text-primary text-muted-foreground"
              href="/"
            >
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Trung tâm</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search */}
      <div className="basis-full flex flex-wrap justify-items-center my-5 px-40">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>

            <Button variant="ghost" className="text-xs h-full">
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
                checked={sortOption.distance}
                onCheckedChange={handleSortByDistance}
                disabled={loadingLoc}
              />
              <span className="text-sm">Khoảng cách gần nhất</span>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Checkbox
                id="terms"
                checked={sortOption.alphabetical}
                onCheckedChange={handleSortAZ}
              />
              <span className="text-sm">A-Z</span>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <div className="basis-full my-5 text-center">
        <h1 className="text-3xl font-bold">Hệ Thống Trung Tâm Cứu Hộ</h1>
        <p className="text-xl">
          Chọn một nơi gần bạn nhất và chung tay mang đến tương lai tươi sáng
          cho các bé.
        </p>
      </div>

      {/* Danh sách ShelterCard */}
      <div className="basis-full px-40 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {displayedShelters?.map((s) => (
          <ShelterCard key={s._id} shelter={s} />
        ))}
      </div>
      {/* <div className="basis-full my-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div> */}
    </div>
  );
}
