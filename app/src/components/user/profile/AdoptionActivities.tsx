import React, { useState, useEffect , useContext} from "react";
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
import type { Pet } from '@/types/Pet';
import { useAppContext } from "@/context/AppContext";
import PetsList from "@/components/pet/PetsList";
import type { User } from '@/types/User';

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
  const { petsList, userProfile } = useAppContext();
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


 
//   {
//     _id: "1",
//     name: "Milo",
//     isMale: true,
//     age: 12,
//     weight: 5.4,
//     identificationFeature: "Vết trắng trên ngực",
//     sterilizationStatus: true,
//     species: {
//       _id: "cat-id-1",
//       name: "Chó",
//       description: "Động vật có vú được thuần hóa, thường được nuôi làm thú cưng hoặc trông nhà."
//     },
//     breeds: [
//       {
//         _id: "breed-id-1",
//         name: "British Shorthair",
//         species: "cat-id-1",
//         description: "Lông ngắn, tính cách điềm tĩnh"
//       },
//       {
//         _id: "breed-id-2",
//         name: "Poodle",
//         species: "cat-id-1",
//         description: "Lông xoăn, thân thiện"
//       }
//     ],
//     color: "Nâu",
//     bio: "Nghịch ngợm và thích được ôm ấp.",
//     intakeTime: "2024-12-10T10:00:00Z",
//     photos: ["https://i.pinimg.com/736x/3e/ba/70/3eba70b7600c637b789ba2f4917de26c.jpg"],
//     foundLocation: "Quận 1, TP. Hồ Chí Minh",
//     tokenMoney: 0,
//     shelter: {
//       _id: "shelter-id-1",
//       name: "Trung tâm Green Paw",
//       address: "Việt Yên - Bắc Giang"
//     },
//     status: "available"
//   },
//   {
//     _id: "2",
//     name: "Luna",
//     isMale: false,
//     age: 8,
//     weight: 3.2,
//     identificationFeature: "Mắt xanh lá",
//     sterilizationStatus: true,
//     species: {
//       _id: "cat-id-1",
//       name: "Mèo"
//     },
//     breeds: [
//       {
//         _id: "breed-id-2",
//         name: "Siamese",
//         species: "cat-id-1"
//       }
//     ],
//     color: "Đen",
//     bio: "Ban đầu hơi nhút nhát nhưng rất ngoan.",
//     intakeTime: "2025-01-20T14:30:00Z",
//     photos: ["https://i.pinimg.com/736x/8a/63/1d/8a631d62d5e7f7fc6be029f896777552.jpg"],
//     foundLocation: "Quận 3, TP. Hồ Chí Minh",
//     tokenMoney: 30000,
//     shelter: {
//       _id: "shelter-id-1",
//       name: "Trung tâm Green Paw",
//       address: "Quận 1"
//     },
//     status: "booking"
//   },
//   {
//     _id: "3",
//     name: "Charlie",
//     isMale: true,
//     age: 18,
//     weight: 6.0,
//     identificationFeature: "Đuôi ngắn",
//     sterilizationStatus: false,
//     species: {
//       _id: "dog-id-1",
//       name: "Chó"
//     },
//     breeds: [
//       {
//         _id: "breed-id-3",
//         name: "Corgi",
//         species: "dog-id-1"
//       }
//     ],
//     color: "Trắng",
//     bio: "Năng động và thích chạy nhảy.",
//     intakeTime: "2024-11-05T09:00:00Z",
//     photos: ["https://i.pinimg.com/736x/01/32/6d/01326db27da19a9478069e72fb0c6c17.jpg"],
//     foundLocation: "Quận 5, TP. Hồ Chí Minh",
//     tokenMoney: 40000,
//     shelter: {
//       _id: "shelter-id-2",
//       name: "Mái ấm An Toàn",
//       address: "Quận 5"
//     },
//     status: "available"
//   },
//   {
//     _id: "4",
//     name: "Daisy",
//     isMale: false,
//     age: 20,
//     weight: 4.5,
//     identificationFeature: "Mắt xanh dương",
//     sterilizationStatus: true,
//     species: {
//       _id: "cat-id-2",
//       name: "Mèo"
//     },
//     breeds: [
//       {
//         _id: "breed-id-4",
//         name: "Persian",
//         species: "cat-id-2"
//       }
//     ],
//     color: "Xám",
//     bio: "Rất điềm tĩnh và thích ngủ.",
//     intakeTime: "2025-02-10T10:30:00Z",
//     photos: ["https://i.pinimg.com/736x/bd/d0/4f/bdd04f3eb635679c9025d9a30a51e449.jpg"],
//     foundLocation: "Quận Bình Thạnh",
//     tokenMoney: 35000,
//     shelter: {
//       _id: "shelter-id-2",
//       name: "Mái ấm An Toàn",
//       address: "Quận 5"
//     },
//     status: "adopted"
//   },
//   {
//     _id: "5",
//     name: "Max",
//     isMale: true,
//     age: 15,
//     weight: 7.8,
//     identificationFeature: "Tai trái gập",
//     sterilizationStatus: true,
//     species: {
//       _id: "dog-id-2",
//       name: "Chó"
//     },
//     breeds: [
//       {
//         _id: "breed-id-5",
//         name: "Border Collie",
//         species: "dog-id-2"
//       }
//     ],
//     color: "Đen trắng",
//     bio: "Thân thiện và hiếu động.",
//     intakeTime: "2024-10-22T11:45:00Z",
//     photos: ["https://i.pinimg.com/736x/01/02/3f/01023f888fccdca88b1ff7047ca9dd94.jpg"],
//     foundLocation: "Quận 7",
//     tokenMoney: 45000,
//     shelter: {
//       _id: "shelter-id-3",
//       name: "Nhà Của Paws",
//       address: "Quận 7"
//     },
//     status: "available"
//   },
//   {
//     _id: "6",
//     name: "Bella",
//     isMale: false,
//     age: 10,
//     weight: 4.0,
//     identificationFeature: "Vết sẹo nhỏ trên mũi",
//     sterilizationStatus: false,
//     species: {
//       _id: "cat-id-3",
//       name: "Mèo"
//     },
//     breeds: [
//       {
//         _id: "breed-id-1",
//         name: "British Shorthair",
//         species: "cat-id-3"
//       }
//     ],
//     color: "Kem",
//     bio: "Dịu dàng và thích được yêu thương.",
//     intakeTime: "2025-03-18T13:15:00Z",
//     photos: ["https://i.pinimg.com/736x/fc/a3/f2/fca3f23718eb4a50cbe140c3d02409f1.jpg"],
//     foundLocation: "Quận Gò Vấp",
//     tokenMoney: 30000,
//     shelter: {
//       _id: "shelter-id-1",
//       name: "Trung tâm Green Paw",
//       address: "Quận 1"
//     },
//     status: "available"
//   },
//   {
//     _id: "7",
//     name: "Oscar",
//     isMale: true,
//     age: 22,
//     weight: 8.1,
//     identificationFeature: "Chân to",
//     sterilizationStatus: true,
//     species: {
//       _id: "dog-id-3",
//       name: "Chó"
//     },
//     breeds: [
//       {
//         _id: "breed-id-6",
//         name: "Golden Retriever",
//         species: "dog-id-3"
//       }
//     ],
//     color: "Vàng",
//     bio: "Thích được quan tâm và ăn uống.",
//     intakeTime: "2025-01-30T10:00:00Z",
//     photos: ["https://i.pinimg.com/736x/b9/66/59/b96659c83e3429b11d8fa482750491c3.jpg"],
//     foundLocation: "Quận 10",
//     tokenMoney: 60000,
//     shelter: {
//       _id: "shelter-id-2",
//       name: "Mái ấm An Toàn",
//       address: "Quận 5"
//     },
//     status: "unavailable"
//   },
//   {
//     _id: "8",
//     name: "Nala",
//     isMale: false,
//     age: 9,
//     weight: 3.7,
//     identificationFeature: "Đốm trắng trên lưng",
//     sterilizationStatus: true,
//     species: {
//       _id: "cat-id-2",
//       name: "Mèo"
//     },
//     breeds: [
//       {
//         _id: "breed-id-2",
//         name: "Siamese",
//         species: "cat-id-2"
//       }
//     ],
//     color: "Cam",
//     bio: "Hơi nhút nhát nhưng rất dễ thương.",
//     intakeTime: "2025-02-25T15:00:00Z",
//     photos: ["https://i.pinimg.com/736x/f4/3a/0c/f43a0c7ee4d353a02eebe0c1b6c3f885.jpg"],
//     foundLocation: "Quận 4",
//     tokenMoney: 20000,
//     shelter: {
//       _id: "shelter-id-1",
//       name: "Trung tâm Green Paw",
//       address: "Quận 1"
//     },
//     status: "disabled"
//   }
// ];

const adoptedPets = petsList.filter((pet: any) => {
  return pet.adopter?._id === userProfile?._id;
});



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
  {currentAdoptedPets.length === 0 ? (
    <div className="text-center text-muted-foreground py-10">
      Bạn chưa nhận nuôi thú cưng nào.
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentAdoptedPets.map((pet: Pet) => (
          <PetsList key={pet?._id} pet={pet} user={userProfile}/>
        ))}
      </div>

      <PaginationSection
        currentPage={adoptedPage}
        totalPages={adoptedTotalPages}
        onPageChange={setAdoptedPage}
      />
    </>
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
