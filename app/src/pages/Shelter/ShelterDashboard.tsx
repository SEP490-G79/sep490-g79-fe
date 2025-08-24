"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAdoptedPetsByWeek,
  getShelterDashboardStatistics,
  getShelterProfile,
  getSubmissionStatistics,
  type ShelterDashboardStatistics,
  type ShelterProfile,
  type SubmissionPieData,
  type WeeklyAdoptionStat,
} from "@/apis/shelter.api";
import AppContext from "@/context/AppContext";
import { toast } from "sonner";
import { PawPrint, Check, BookOpenTextIcon, UsersIcon } from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { ChartBarMultiple } from "@/components/shelter/shelter-management/dashboard/ChartBarMultiple";
import { AdoptionLineChart } from "@/components/shelter/shelter-management/dashboard/AdoptionLineChart";
import { SubmissionPieChart } from "@/components/shelter/shelter-management/dashboard/SubmissionPieChart";

const ShelterDashboard = () => {
  const { shelterId } = useParams();
  const { shelters } = useContext(AppContext);

  const [shelter, setShelter] = useState<ShelterProfile | null>(null);
  const [dashboardData, setDashboardData] =
    useState<ShelterDashboardStatistics | null>(null);
  const [weeklyAdoptionData, setWeeklyAdoptionData] = useState<
    WeeklyAdoptionStat[]
  >([]);
  const [submissionStats, setSubmissionStats] =
    useState<SubmissionPieData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shelterId) return;

    const found = shelters?.find((s) => s._id === shelterId);
    if (found) {
      const transformedShelter: ShelterProfile = {
        _id: found._id,
        name: found.name,
        avatar: found.avatar || "",
        background: found.background || "",
        email: found.email || "",
        hotline: typeof found.hotline === "string" ? found.hotline : "",
        address: found.address || "",
        shelterCode: "", // điền tạm nếu cần
        aspiration: "", // điền trống hoặc fetch thêm
        status: found.status || "verifying",
        members: [], // nếu cần, có thể bỏ qua hoặc fetch riêng
      };

      setShelter(transformedShelter);
    } else {
      getShelterProfile(shelterId)
        .then((data) => setShelter(data))
        .catch(() => toast.error("Không tìm thấy shelter"));
    }
  }, [shelterId, shelters]);

  useEffect(() => {
    if (!shelterId || !shelter) return;

    setLoading(true);
    getShelterDashboardStatistics(shelterId)
      .then(setDashboardData)
      .catch(() => toast.error("Không thể tải dữ liệu dashboard"))
      .finally(() => setLoading(false));

    getAdoptedPetsByWeek(shelterId)
      .then(setWeeklyAdoptionData)
      .catch(() => toast.error("Không thể tải biểu đồ nhận nuôi"));

    getSubmissionStatistics(shelterId)
      .then(setSubmissionStats)
      .catch(() => toast.error("Không thể tải dữ liệu đơn nhận nuôi"));
  }, [shelterId, shelter]);

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SectionCard
          icon={<PawPrint className="w-6 h-6 text-[--primary]" />}
          title="Thú đang chăm sóc"
          number={dashboardData.caringPets}
          iconColor="primary"
        />

        <SectionCard
          icon={<Check className="w-6 h-6 text-(--chart-2)" />}
          title="Đã nhận nuôi"
          number={dashboardData.adoptedPets}
          iconColor="chart-1"
        />

        <SectionCard
          icon={<BookOpenTextIcon className="w-6 h-6 text-[--chart-1]" />}
          title="Bài viết đã đăng"
          number={dashboardData.posts}
          iconColor="secondary"
        />

        <SectionCard
          icon={
            <UsersIcon className="w-6 h-6 text-(--chart-3)" />
          }
          title="Thành viên"
          number={dashboardData.members}
          iconColor="chart-2"

        />
      </div>
      <div>
        <div className="mt-8">
          <AdoptionLineChart data={weeklyAdoptionData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 h-[380px] mb-16">
          {submissionStats && (
            <div className="h-full">
              <SubmissionPieChart
                approved={submissionStats.approved}
                rejected={submissionStats.rejected}
                pending={submissionStats.pending}
              />
            </div>
          )}
          <div className="h-full">
            <ChartBarMultiple />
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default ShelterDashboard;
