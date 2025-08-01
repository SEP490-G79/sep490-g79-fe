import React, { useEffect, useState } from 'react';
import { useAppContext } from "@/context/AppContext";
import type { Pet } from "@/types/Pet";
import useAuthAxios from "@/utils/authAxios";
import { useParams, useNavigate, Link} from "react-router-dom";
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
import type { MissionForm } from "@/types/MissionForm";
import { ArrowRight } from 'lucide-react';

export default function SubmissionForms() {
    const { coreAPI, setSubmissionsByPetId } = useAppContext();
    const authAxios = useAuthAxios();
    const { shelterId } = useParams();
    const [submissions, setSubmissions] = useState([]);
    const [availablePets, setAvailablePets] = useState<Pet[]>([]);
    const [submissionCountByPet, setSubmissionCountByPet] = useState<Record<string, number>>({});
    const [totalAvailablePets, setTotalAvailablePets] = useState(0);
    const petsPerPage = 6;

    const [currentPageAll, setCurrentPageAll] = useState(1);
    const [currentPageWithSubmissions, setCurrentPageWithSubmissions] = useState(1);
    const [activeTab, setActiveTab] = useState<"all" | "withSubmissions">("withSubmissions");
    const navigate = useNavigate();

    useEffect(() => {
        if (!shelterId) return;

        const fetchPets = async () => {
            try {
                const res = await authAxios.get(`${coreAPI}/pets/get-by-shelter-for-submission/${shelterId}`, {
                    params: {
                        page: 1,
                        limit: 1000, // Lấy tất cả để phân trang client-side
                        status: ["available", "adopted", "booking", "delivered"], 
                    },
                });

                setAvailablePets(res.data.pets || []);
                setTotalAvailablePets(res.data.total);
            } catch (error) {
                toast.error("Không thể lấy danh sách thú cưng");
            }
        };

        fetchPets();
    }, [shelterId]);

    useEffect(() => {
        if (!availablePets.length) return;

        const fetchSubmissions = async () => {
            try {
                const petIds = availablePets.map((pet) => pet._id);
                const res = await authAxios.post(`${coreAPI}/adoption-submissions/by-pet-ids`, { petIds });

                const submissions = res.data || [];
                setSubmissions(submissions);

                const countMap: Record<string, number> = {};
                const grouped: Record<string, MissionForm[]> = {};

                for (const submission of submissions) {
                    const petId = submission?.adoptionForm?.pet?._id;
                    if (!petId) continue;

                    countMap[petId] = (countMap[petId] || 0) + 1;
                    if (!grouped[petId]) grouped[petId] = [];
                    grouped[petId].push(submission);
                }

                setSubmissionCountByPet(countMap);
                setSubmissionsByPetId(grouped);

            } catch (error) {
                toast.error("Không thể lấy danh sách submissions");
            }
        };

        fetchSubmissions();
    }, [availablePets]);

    // Reset page khi đổi tab
    useEffect(() => {
        setCurrentPageAll(1);
        setCurrentPageWithSubmissions(1);
    }, [activeTab]);

    const petsWithSubmissions = availablePets.filter(pet => submissionCountByPet[pet._id]);
    const displayedPets = activeTab === "withSubmissions" ? petsWithSubmissions : availablePets;

    const currentPage = activeTab === "withSubmissions" ? currentPageWithSubmissions : currentPageAll;
    const setCurrentPage = activeTab === "withSubmissions" ? setCurrentPageWithSubmissions : setCurrentPageAll;

    const totalPages = Math.ceil(displayedPets.length / petsPerPage);
    const paginatedPets = displayedPets.slice((currentPage - 1) * petsPerPage, currentPage * petsPerPage);


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
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <Button
                    variant={activeTab === "withSubmissions" ? "default" : "outline"}
                    onClick={() => setActiveTab("withSubmissions")}
                >
                    Đang xử lý yêu cầu
                </Button>
                <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    onClick={() => setActiveTab("all")}
                >
                    Tất cả thú cưng
                </Button>
            </div>

            {/* Pet list */}
            {paginatedPets.length === 0 ? (
                <div>Không có thú cưng phù hợp</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {paginatedPets.map((pet) => (
                        <Card key={pet._id}
                            onClick={() => navigate(`/shelters/${shelterId}/management/submission-forms/${pet._id}`)}
                            className="relative shadow-md hover:shadow-lg transition"
                        >
                            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                                {submissionCountByPet[pet._id]
                                    ? `${submissionCountByPet[pet._id]} yêu cầu`
                                    : "Chưa có yêu cầu"}
                            </div>
                            <CardContent className="flex items-top gap-4">
                                <div className="basis-1/3 flex justify-center">
                                    <img
                                        src={pet.photos?.[0] || "/placeholder-avatar.png"}
                                        alt={pet.name}
                                        className="w-34 h-30 rounded-lg object-cover border"
                                    />
                                </div>
                                <div className="basis-2/3 space-y-1">
                                    <p >Mã thú cưng: {pet.petCode ?? "N/A"}</p>
                                    <h2 >Tên: {pet.name}</h2>
                                    <h2 >Ngày bắt đầu mở đơn: {pet.name}</h2>
                                </div>
                                 
                 
                
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {renderPageNumbers()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
