"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SectionCard } from "@/components/ui/section-card";
import { SectionCardContainer } from "@/components/ui/section-card-container";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { PawPrint, Check, BookOpenTextIcon, UsersIcon } from "lucide-react";
import { toast } from "sonner";
import AppContext from "@/context/AppContext";
import {
  getShelterDashboardStatistics,
  getShelterProfile,
  type ShelterDashboardStatistics,
  type ShelterProfile,
} from "@/apis/shelter.api";

const ShelterDashboard = () => {
  const { shelterId } = useParams();
  const { shelters } = useContext(AppContext);

  const [shelter, setShelter] = useState<ShelterProfile | null>(null);
  const [dashboardData, setDashboardData] =
    useState<ShelterDashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findShelter = shelters?.find((s) => s._id === shelterId);
    if (findShelter) {
      setShelter(findShelter);
    } else {
      getShelterProfile(shelterId!)
        .then((data) => setShelter(data))
        .catch(() => toast.error("Không tìm thấy shelter"));
    }
  }, [shelterId, shelters]);

  useEffect(() => {
    if (!shelter) return;
    setLoading(true);
    getShelterDashboardStatistics(shelterId)
      .then(setDashboardData)
      .catch(() => toast.error("Không thể tải dữ liệu dashboard"))
      .finally(() => setLoading(false));
  }, [shelter]);

  if (!shelter) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
        Đang tìm trạm cứu hộ...
      </div>
    );
  }

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 py-4 md:px-8 md:py-6 bg-background">
      {/* Breadcrumb */}
      {/* <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shelter" className="hover:underline">
              Shelter
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}

      {/* Stats Card Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SectionCard
          icon={<PawPrint className="w-6 h-6 text-primary" />}
          title="Thú đang chăm sóc"
          number={dashboardData.caringPets}
          changePercentage="5%"
          isHigher
        />
        <SectionCard
          icon={<Check className="w-6 h-6 text-green-600" />}
          title="Đã nhận nuôi"
          number={dashboardData.adoptedPets}
          changePercentage="10%"
          isHigher
        />
        <SectionCard
          icon={<BookOpenTextIcon className="w-6 h-6 text-blue-600" />}
          title="Bài viết đã đăng"
          number={dashboardData.posts}
          changePercentage="15%"
          isHigher
        />
        <SectionCard
          icon={<UsersIcon className="w-6 h-6 text-yellow-600" />}
          title="Thành viên"
          number={dashboardData.members}
          changePercentage="0%"
          isHigher={false}
        />
      </div>

      {/* Chart Section */}
      <div className="mt-10 rounded-xl border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">
          Biểu đồ phát triển thú cưng theo tháng
        </h3>
        <ChartAreaInteractive
          data={
            dashboardData.petGrowth.map((item) => ({
              name: item.month,
              pets: item.count,
            })) ?? []
          }
        />
      </div>
    </div>
  );
};

export default ShelterDashboard;
