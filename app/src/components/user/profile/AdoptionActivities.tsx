import React, { useState, useEffect, useContext } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import PetCard from "@/components/landing-page/PetCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import type { MissionForm } from "@/types/MissionForm";
import type { Pet } from '@/types/Pet';
import { useAppContext } from "@/context/AppContext";
import PetsList from "@/components/pet/PetsList";
import type { User } from '@/types/User';
import useAuthAxios from "@/utils/authAxios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const itemsPerPage = 6;

function PaginationSection({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationPrevious onClick={() => onPageChange(Math.max(currentPage - 1, 1))} />
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationNext onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} />
      </PaginationContent>
    </Pagination>
  );
}

function AdoptionActivities() {
  const [activeTab, setActiveTab] = useState("adopted");
  const [adoptedPage, setAdoptedPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [selectedShelter, setSelectedShelter] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const { petsList, userProfile, coreAPI } = useAppContext();
  const [submissions, setSubmissions] = useState<MissionForm[]>([]);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();



  useEffect(() => {
    authAxios.get(`${coreAPI}/adoption-submissions/get-adoption-request-list`)
      .then((res) => {
        setSubmissions(res.data);

      }).catch((error) => {
        toast.error("Không thể lấy thông tin thú cưng");
      })
  }, [activeTab])

  const adoptedPets = petsList.filter((pet: any) => {
    return pet.adopter?._id === userProfile?._id;
  });



  const filteredActivities = submissions.filter((item) => {
    const matchShelter =
      selectedShelter === "Tất cả" ||
      item.adoptionForm?.shelter?.name === selectedShelter;

    const matchStatus =
      selectedStatus === "Tất cả" || item.status === selectedStatus;


    return matchShelter && matchStatus;
  });

  const adoptedTotalPages = Math.ceil(adoptedPets.length / itemsPerPage);
  const activityTotalPages = Math.ceil(filteredActivities.length / itemsPerPage);


  const currentAdoptedPets = adoptedPets.slice(
    (adoptedPage - 1) * itemsPerPage,
    adoptedPage * itemsPerPage
  );

  const currentActivities = filteredActivities.slice(
    (activityPage - 1) * itemsPerPage,
    activityPage * itemsPerPage
  );

  useEffect(() => {
    setAdoptedPage(1);
    setActivityPage(1);
  }, [activeTab]);

  const statusOptions = [
    { value: "Tất cả", label: "Tất cả trạng thái" },
    { value: "pending", label: "Đang chờ xét duyệt" },
    { value: "interviewing", label: "Chờ phỏng vấn" },
    { value: "reviewed", label: "Đã phỏng vấn" },
    { value: "approved", label: "Đồng ý" },
    { value: "rejected", label: "Bị từ chối" },
  ];

  const getStatusLabel = (status: string) => {
    const found = statusOptions.find((item) => item.value === status);
    return found ? found.label : "Không xác định";
  };

  const handleCardClick = (submission: MissionForm) => {
    const petId = submission.adoptionForm.pet._id;
    const submissionId = submission._id;
    navigate(`/adoption-form/${petId}/${submissionId}`);
  };


  return (
    <Tabs defaultValue="adopted" onValueChange={setActiveTab} className="space-y-4 mb-10">
      <TabsList className="ml-auto mb-4">
        <TabsTrigger value="adopted">Thú đã nhận nuôi</TabsTrigger>
        <TabsTrigger value="activities">Hoạt động nhận nuôi</TabsTrigger>
        <TabsTrigger value="return-request">Yêu cầu trả lại</TabsTrigger>
      </TabsList>

      <TabsContent value="adopted">
        {currentAdoptedPets.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Bạn chưa nhận nuôi thú cưng nào.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentAdoptedPets.map((pet: Pet) => (
                <PetsList key={pet?._id} pet={pet} user={userProfile} />
              ))}
            </div>

            {adoptedTotalPages > 1 && (
              <PaginationSection
                currentPage={adoptedPage}
                totalPages={adoptedTotalPages}
                onPageChange={setAdoptedPage}
              />
            )}

          </>
        )}
      </TabsContent>

      {/* className="min-h-screen" */}
      <TabsContent value="activities" >
        <div className="flex flex-wrap gap-4 mb-4 ">
          <select
            value={selectedShelter}
            onChange={(e) => {
              setSelectedShelter(e.target.value);
              setActivityPage(1);
            }}
            className="border px-3 py-2 rounded bg-white dark:bg-gray-800  dark:text-white dark:border-zinc-700"

          >
            <option value="Tất cả">Tất cả trung tâm</option>
            {[...new Set(
              submissions
                .map((a) => a.adoptionForm?.shelter?.name)
                .filter((name): name is string => !!name) // chỉ lấy name hợp lệ
            )].map((shelter) => (
              <option key={shelter} value={shelter}>
                {shelter}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setActivityPage(1);
            }}
            className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-zinc-700"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>


        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentActivities.length === 0 ? (
            <p className="text-center text-muted-foreground col-span-full">Không có hoạt động nào.</p>
          ) : (
            currentActivities.map((submission) => (
              <Card
                key={submission._id}
                onClick={() => handleCardClick(submission)}
                className="relative cursor-pointer transition hover:shadow-md group"
              >
                {/* Overlay Layer */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-orange-600 text-sm font-medium transition-opacity duration-300 rounded-lg z-10" >
                  <div className="-translate-y-3">Click vào để xem chi tiết</div>
                </div>

                {/* Nội dung chính */}
                <CardHeader className="flex flex-row items-center gap-4 pb-2 z-0">
                  <img
                    src={submission.adoptionForm?.pet?.photos[0]}
                    alt="Pet Avatar"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">
                      {submission.adoptionForm?.pet?.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {submission.adoptionForm?.shelter?.name || "Không rõ trung tâm"}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-1 text-sm  z-0">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Phí nhận nuôi</span>
                    <span className="font-medium">
                      {submission.adoptionForm?.pet?.tokenMoney > 0
                        ? `${submission.adoptionForm?.pet?.tokenMoney.toLocaleString()}đ`
                        : "Miễn phí"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Trạng thái</span>
                    <span
                      className={`font-semibold ${submission.status === "approved"
                        ? "text-green-600"
                        : submission.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                        }`}
                    >
                      {getStatusLabel(submission.status)}
                    </span>
                  </div>

                  <div className="flex flex-col col-span-2">
                    <span className="text-muted-foreground text-xs">Ngày yêu cầu</span>
                    <span className="font-medium">
                      {new Date(submission.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </CardContent>
              </Card>

            ))
          )}
        </div>


        {activityTotalPages > 1 && (
          <PaginationSection
            currentPage={activityPage}
            totalPages={activityTotalPages}
            onPageChange={setActivityPage}
          />
        )}


      </TabsContent>

      <TabsContent value="return-request">
        <div className="text-center text-muted-foreground py-10">
          Tính năng này hiện đang được phát triển.
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default AdoptionActivities;
