import ShelterBg from "@/components/shelter/shelter-page/ShelterBg";
import ShelterContent from "@/components/shelter/shelter-page/ShelterContent";
import ShelterInfo from "@/components/shelter/shelter-page/ShelterInfo";
import { Skeleton } from "@/components/ui/skeleton";
import AppContext from "@/context/AppContext";
import { type Shelter } from "@/types/Shelter";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getShelterDashboardStatistics } from "@/apis/shelter.api";
import { z } from "zod";
import useAuthAxios from "@/utils/authAxios";
import { Button } from "@/components/ui/button";

function ShelterPage() {
  const { shelterId } = useParams();
  const { shelters } = useContext(AppContext);
  const [dashboardData, setDashboardData] =
    useState<ShelterDashboardStatistics | null>(null);

  if (!shelters || shelters.length == 0) {
    return (
      <div className="w-full h-full flex flex-wrap justify-around px-10 py-5">
        <div className="basis-full sm:basis-full">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="basis-full sm:basis-2/8">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="basis-full sm:basis-5/8">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  const shelter = useMemo<Shelter | undefined>(() => {
    return shelters.find((s) => s._id == shelterId);
  }, [shelterId, shelters]);

  useEffect(() => {
    if (!shelter) return;
    getShelterDashboardStatistics(shelter._id)
      .then(setDashboardData)
      .catch(() => toast.error("Không thể tải dữ liệu dashboard"));
  }, [shelter]);

  if (!shelter) {
    return <Navigate to="/404" replace />;
  }

  const authAxios = useAuthAxios();
  const {shelterAPI, user} = useContext(AppContext)
  const handleSendRequest = async (emailString: string) => {
        try {
            await authAxios.put(`${shelterAPI}/send-staff-request/${emailString}`)
            setTimeout(() => {
              toast.success("Gửi yêu cầu gia nhập thành công!")
            }, 1000)
          } catch (error : any) {
            toast.error(error?.response.data.message)
          }
       }
  const hasShelter = shelters?.filter(shelter =>
  shelter.members.some(member => member._id === user?._id)
  );

  return (
    <div className="w-full h-full flex flex-wrap justify-around px-10 py-5">
      <div className="basis-full sm:basis-full">
        <ShelterBg shelter={shelter} />
        {hasShelter !== undefined && hasShelter.length < 1 && 
        <Button onClick={() => handleSendRequest(shelter.email)} className="my-4 ms-11">Gửi yêu cầu tình nguyện</Button>
        }
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
