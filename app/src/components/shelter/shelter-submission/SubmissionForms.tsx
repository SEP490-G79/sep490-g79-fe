import React, { useEffect, useState } from 'react';
import { useAppContext } from "@/context/AppContext";
import type { Pet } from "@/types/Pet";
import useAuthAxios from "@/utils/authAxios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";



export default function SubmissionForms() {
    const { coreAPI } = useAppContext();
    const authAxios = useAuthAxios();
    const { shelterId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [availablePets, setAvailablePets] = useState<Pet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAvailablePets, setTotalAvailablePets] = useState(0);
    const petsPerPage = 6;
    const [submissionCountByPet, setSubmissionCountByPet] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!shelterId) return;

        const fetchPets = async () => {
            try {
                const res = await authAxios.get(`${coreAPI}/pets/get-by-shelter/${shelterId}`, {
                    params: {
                        page: currentPage,
                        limit: petsPerPage,
                        status: "available",
                    },
                });

                setAvailablePets(res.data.pets || []);
                setTotalAvailablePets(res.data.total);
            } catch (error) {
                toast.error("Không thể lấy danh sách thú cưng");
            }
        };

        fetchPets();
    }, [shelterId, currentPage]);

   useEffect(() => {
  if (!availablePets.length) return;

  const fetchSubmissions = async () => {
    try {
      const petIds = availablePets.map((pet) => pet._id);
      const res = await authAxios.post(`${coreAPI}/adoption-submissions/by-pet-ids`, { petIds });

      const submissions = res.data || [];
      setSubmissions(submissions);

      // Tạo map đếm submission theo petId
 const countMap: Record<string, number> = {};
      for (const submission of submissions) {
        const petId = submission?.adoptionForm?.pet?._id;

        if (!petId) continue; // Bỏ qua nếu không có

        if (!countMap[petId]) countMap[petId] = 0;
        countMap[petId]++;
      }

      setSubmissionCountByPet(countMap);

    } catch (error) {
      toast.error("Không thể lấy danh sách submissions");
    }
  };

  fetchSubmissions();
}, [availablePets]);




    const totalPages = Math.ceil(totalAvailablePets / petsPerPage);

    if (!availablePets) return <div>Loading...</div>;
    if (availablePets.length === 0) return <div>Không có thú cưng khả dụng</div>;


    const renderPageNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {
            // Hiển thị tất cả nếu <= 5 trang
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink isActive={i === currentPage} onClick={() => setCurrentPage(i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            // Luôn hiển thị trang đầu
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink isActive={1 === currentPage} onClick={() => setCurrentPage(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // Dấu ...
            if (currentPage > 3) {
                pages.push(<PaginationItem key="start-ellipsis">...</PaginationItem>);
            }

            // Các trang giữa (currentPage -1, currentPage, currentPage +1)
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink isActive={i === currentPage} onClick={() => setCurrentPage(i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            // Dấu ...
            if (currentPage < totalPages - 2) {
                pages.push(<PaginationItem key="end-ellipsis">...</PaginationItem>);
            }

            // Luôn hiển thị trang cuối
            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink isActive={totalPages === currentPage} onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };


    return (
        <div className="space-y-6">
            {/* Danh sách thú cưng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {availablePets.map((pet) => (
                    <Card key={pet._id} className="relative  shadow-md hover:shadow-lg transition">
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
    {submissionCountByPet[pet._id] || 0} đơn
  </div>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="basis-1/3 flex justify-center">
                                <img
                                    src={pet.photos?.[0] || "/placeholder-avatar.png"}
                                    alt={pet.name}
                                    className="w-24 h-20 rounded-lg object-cover border"
                                />
                            </div>
                            <div className="basis-2/3 space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Mã thú cưng: {pet.petCode ?? "N/A"}
                                </p>
                                <h2 className="text-lg font-semibold">{pet.name}</h2>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Phân trang */}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {renderPageNumbers()}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


        </div>
    );
}
