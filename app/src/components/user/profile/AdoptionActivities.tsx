import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

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
  ];

  return (
    <Tabs defaultValue="activities" className="space-y-4">
      {/* Tabs header */}
 <TabsList className="w-fit ml-auto border-b border-gray-200  mb-4 flex">
  <TabsTrigger value="activities">Hoạt động nhận nuôi</TabsTrigger>
  <TabsTrigger value="adopted">Thú đã nhận nuôi</TabsTrigger>
</TabsList>



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

      <TabsContent value="adopted">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
          {adoptedPets.map((pet) => (
            <div
              key={pet.id}
              className="p-4 bg-white rounded-lg shadow-md space-y-2"
            >
              <img
                src={pet.petImage}
                alt={pet.petName}
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="font-semibold">{pet.petName}</p>
              <p>{pet.petDescription}</p>
              <p className="text-sm text-gray-500">Adopted on: {pet.date}</p>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default AdoptionActivities;
