import React, { useState, useEffect } from "react";
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
import type { MissionForm } from "@/types/MissionForm";

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

 const activities: MissionForm[] = [
  {
    _id: "subm1",
    adoptionForm: {
      pet: {
        name: "Milo",
        photos: ["https://i.pinimg.com/736x/ad/69/6d/ad696deac38edaac546dba68e0c62a6e.jpg"],
        tokenMoney: 500000,
      },
      shelter: { name: "Happy Paws Shelter" },
    },
    createdAt: "2025-06-15T10:30:00.000Z",
    status: "reviewed",
    transportMethod: "Tự đến đón",
  },
  {
    _id: "subm2",
    adoptionForm: {
      pet: {
        name: "Luna",
        photos: ["https://i.pinimg.com/736x/71/27/c0/7127c026c4b4e8d24056555e2a026a26.jpg"],
        tokenMoney: 0,
      },
      shelter: { name: "Green Forest Shelter" },
    },
    createdAt: "2025-06-14T09:00:00.000Z",
    status: "approved",
    transportMethod: "Giao tận nơi",
  },
  {
    _id: "subm3",
    adoptionForm: {
      pet: {
        name: "Charlie",
        photos: ["https://i.pinimg.com/736x/90/ba/fb/90bafbb4368eb094cf2d33ead399d83b.jpg"],
        tokenMoney: 200000,
      },
      shelter: { name: "Blue Sky Rescue" },
    },
    createdAt: "2025-06-13T14:20:00.000Z",
    status: "pending",
    transportMethod: "Tự đến đón",
  },
  {
    _id: "subm4",
    adoptionForm: {
      pet: {
        name: "Bella",
        photos: ["https://i.pinimg.com/736x/e3/3f/de/e33fde4cb19284c0388f763bd3b80302.jpg"],
        tokenMoney: 100000,
      },
      shelter: { name: "Animal Love Home" },
    },
    createdAt: "2025-06-12T08:15:00.000Z",
    status: "rejected",
    transportMethod: "Giao tận nơi",
  },
  {
    _id: "subm5",
    adoptionForm: {
      pet: {
        name: "Coco",
        photos: ["https://i.pinimg.com/736x/aa/26/24/aa2624dbf350878057be7a17d7e2eb48.jpg"],
        tokenMoney: 300000,
      },
      shelter: { name: "Safe Haven Shelter" },
    },
    createdAt: "2025-06-11T11:45:00.000Z",
    status: "approved",
    transportMethod: "Tự đến đón",
  },
  {
    _id: "subm6",
    adoptionForm: {
      pet: {
        name: "Max",
        photos: ["https://i.pinimg.com/736x/6f/f9/4f/6ff94f9aa5f2b75c5bfe7dff8c90ccda.jpg"],
        tokenMoney: 0,
      },
      shelter: { name: "Little Paw Shelter" },
    },
    createdAt: "2025-06-10T16:00:00.000Z",
    status: "reviewed",
    transportMethod: "Giao tận nơi",
  },
  {
    _id: "subm7",
    adoptionForm: {
      pet: {
        name: "Lucy",
        photos: ["https://i.pinimg.com/736x/51/d2/72/51d272a966b5c9ef2c418f03c9550ea4.jpg"],
        tokenMoney: 150000,
      },
      shelter: { name: "Green Hope Shelter" },
    },
    createdAt: "2025-06-09T07:30:00.000Z",
    status: "approved",
    transportMethod: "Tự đến đón",
  },
  {
    _id: "subm8",
    adoptionForm: {
      pet: {
        name: "Rocky",
        photos: ["https://i.pinimg.com/736x/ce/ea/de/ceeade01914a3cfafc8a43f63ee835e7.jpg"],
        tokenMoney: 0,
      },
      shelter: { name: "Urban Pet Rescue" },
    },
    createdAt: "2025-06-08T13:50:00.000Z",
    status: "pending",
    transportMethod: "Giao tận nơi",
  },
  {
    _id: "subm9",
    adoptionForm: {
      pet: {
        name: "Daisy",
        photos: ["https://i.pinimg.com/736x/65/0a/79/650a79051dfbf3a2b39423b301b19abb.jpg"],
        tokenMoney: 400000,
      },
      shelter: { name: "Nature Friends Shelter" },
    },
    createdAt: "2025-06-07T12:10:00.000Z",
    status: "rejected",
    transportMethod: "Tự đến đón",
  },
  {
    _id: "subm10",
    adoptionForm: {
      pet: {
        name: "Toby",
        photos: ["https://i.pinimg.com/736x/d5/31/2e/d5312ef6ce346cdcda08704088329a39.jpg"],
        tokenMoney: 250000,
      },
      shelter: { name: "Sunshine Shelter" },
    },
    createdAt: "2025-06-06T10:25:00.000Z",
    status: "interviewing",
    transportMethod: "Giao tận nơi",
  },
];


  const adoptedPets = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    petName: "Bella",
    status: "Adopted",
    date: "2025-06-01",
    petImage: "https://example.com/bella.jpg",
    petDescription: "A cute dog with a fluffy tail.",
  }));


  const [selectedShelter, setSelectedShelter] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  const filteredActivities = activities.filter((item) => {
    const matchShelter =
      selectedShelter === "Tất cả" ||
      item.adoptionForm.shelter.name === selectedShelter;

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

  return (
    <Tabs defaultValue="adopted" onValueChange={setActiveTab} className="space-y-4 mb-10">
      <TabsList className="ml-auto mb-4">
        <TabsTrigger value="adopted">Thú đã nhận nuôi</TabsTrigger>
        <TabsTrigger value="activities">Hoạt động nhận nuôi</TabsTrigger>
      </TabsList>

      <TabsContent value="adopted">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentAdoptedPets.map((pet) => (
            <PetCard key={pet.id} />
          ))}
        </div>
        {currentAdoptedPets.length > 0 && (
          <PaginationSection
            currentPage={adoptedPage}
            totalPages={adoptedTotalPages}
            onPageChange={setAdoptedPage}
          />
        )}



      </TabsContent>

      <TabsContent value="activities" className="min-h-screen">
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
            {[...new Set(activities.map((a) => a.adoptionForm.shelter.name))].map(
              (shelter) => (
                <option key={shelter} value={shelter}>
                  {shelter}
                </option>
              )
            )}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setActivityPage(1);
            }}
           className="border px-3 py-2 rounded bg-white dark:bg-gray-800  dark:text-white dark:border-zinc-700"

          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="approved">	Đang chờ xử lý</option>
            <option value="reviewed">Đang phỏng vấn</option>
            <option value="rejected">Đồng ý</option>
            <option value="rejected">Bị từ chối</option>
            <option value="rejected">Đã phỏng vấn</option>

          </select>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {currentActivities.length === 0 ? (
            <p className="text-center text-muted-foreground col-span-full">Không có hoạt động nào.</p>
          ) : (
            currentActivities.map((submission) => (
              <div key={submission._id} className="border p-4 rounded shadow-sm space-y-2">
                <div className="flex items-center gap-4">
                  <img
                    src={submission.adoptionForm.pet.photos[0]}
                    alt="Pet Avatar"
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{submission.adoptionForm.pet.name}</h2>
                    <p className="text-sm text-muted-foreground">{submission.adoptionForm.shelter.name}</p>
                  </div>
                </div>

                {/* Grid: Label ở trên, value ở dưới */}
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Token</span>
                    <span className="font-medium">
                      {submission.adoptionForm.pet.tokenMoney > 0
                        ? `${submission.adoptionForm.pet.tokenMoney.toLocaleString()}đ`
                        : "Miễn phí"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Hình thức</span>
                    <span className="font-medium">{submission.transportMethod}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Ngày yêu cầu</span>
                    <span className="font-medium">
                      {new Date(submission.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-xs">Trạng thái</span>
                    <span className={`font-semibold ${submission.status === "approved" ? "text-green-600" :
                        submission.status === "rejected" ? "text-red-600" :
                          "text-yellow-600"
                      }`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {currentActivities.length > 0 && (
          <PaginationSection
            currentPage={activityPage}
            totalPages={activityTotalPages}
            onPageChange={setActivityPage}
          />
        )}

      </TabsContent>
    </Tabs>
  );
}

export default AdoptionActivities;
