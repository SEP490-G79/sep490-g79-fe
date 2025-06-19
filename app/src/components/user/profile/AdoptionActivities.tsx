import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import PetCard from "@/components/landing-page/PetCard";


function AdoptionActivities() {
  const activities = [
    { petName: "Bella", status: "Adopted", date: "2025-06-01" },
    { petName: "Max", status: "Pending", date: "2025-06-04" },
  ];

  const adoptedPets = [
    {
      id: 1,
      petName: "Bella",
      status: "Adopted",
      date: "2025-06-01",
      petImage: "https://example.com/bella.jpg",
      petDescription: "A cute dog with a fluffy tail.",
    },
    {
      id: 2,
      petName: "Bella",
      status: "Adopted",
      date: "2025-06-01",
      petImage: "https://example.com/bella.jpg",
      petDescription: "A cute dog with a fluffy tail.",
    },
    {
      id: 3,
      petName: "Bella",
      status: "Adopted",
      date: "2025-06-01",
      petImage: "https://example.com/bella.jpg",
      petDescription: "A cute dog with a fluffy tail.",
    },
    {
      id: 4,
      petName: "Bella",
      status: "Adopted",
      date: "2025-06-01",
      petImage: "https://example.com/bella.jpg",
      petDescription: "A cute dog with a fluffy tail.",
    },
  ];

  return (
    <Tabs defaultValue="adopted" className="space-y-4 h-full mb-10  ">
      {/* Tabs header */}
      <TabsList className="w-fit ml-auto border-b border-gray-200  mb-4 flex">
         <TabsTrigger value="adopted">Thú đã nhận nuôi</TabsTrigger>
        <TabsTrigger value="activities">Hoạt động nhận nuôi</TabsTrigger>
       
      </TabsList>

 <TabsContent value="adopted">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4">
          {adoptedPets.map((pet) => (
            <PetCard key={pet.id} />
          ))}
        </div>
      </TabsContent>


      {/* Nội dung tabs */}
      <TabsContent value="activities">
        <div className="space-y-4 ">
          {activities.map((act, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <p className="font-semibold">{act.petName}</p>
              <p>Status: {act.status}</p>
              <p className="text-sm text-gray-500 ">Date: {act.date}</p>
            </div>
          ))}
        </div>
      </TabsContent>

     
    </Tabs>
  );
}

export default AdoptionActivities;
