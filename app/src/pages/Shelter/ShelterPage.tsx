import ShelterBg from "@/components/shelter/shelter-page/ShelterBg";
import ShelterContent from "@/components/shelter/shelter-page/ShelterContent";
import ShelterInfo from "@/components/shelter/shelter-page/ShelterInfo";
import { mockShelters, type Shelter } from "@/types/Shelter";
import React, { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";

function ShelterPage() {
  const { shelterId } = useParams();
  const shelter = useMemo<Shelter | undefined>(() => {
    return mockShelters.find((s) => s._id === shelterId);
  }, [shelterId]);

  // Nếu không tìm thấy thì redirect về 404 hoặc trang danh sách
  if (!shelter) {
    return <Navigate to="/404" replace />;
  }
  return (
    <div className="w-full h-full flex flex-wrap justify-around px-10 py-5">
      <div className="basis-full sm:basis-full">
        <ShelterBg shelter={shelter} />
      </div>
      <div className="basis-full sm:basis-2/8">
        <ShelterInfo shelter={shelter} />
      </div>
      <div className="basis-full sm:basis-5/8">
        <ShelterContent />
      </div>
    </div>
  );
}

export default ShelterPage;
