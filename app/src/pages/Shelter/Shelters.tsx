// src/pages/Shelters.tsx
import React, { useEffect, useState, useMemo } from "react";
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
import { mockShelters, type Shelter } from "@/types/Shelter";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Shelters() {
  // Từ khoá tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc mockShelters theo searchTerm
  const filteredShelters = useMemo<Shelter[]>(() => {
    return mockShelters.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Placeholder cho input
  const placeholders = [
    "Tìm kiếm trung tâm cứu hộ",
    "Tìm kiếm theo tên trung tâm",
  ];

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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
      <div className="basis-full my-5">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
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
        {filteredShelters?.map((s) => (
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
