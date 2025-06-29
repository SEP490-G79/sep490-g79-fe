"use client";

import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { SectionCardContainer } from "@/components/ui/section-card-container";
import { SectionCard } from "@/components/ui/section-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  DogIcon,
  BookOpenTextIcon,
  UsersIcon,
  Banknote, // ✅ icon thay thế hợp lệ
  PawPrint,
  Check,
} from "lucide-react";

const ShelterDashboard = () => {
  return (
    <div className="flex flex-1 flex-col">
      <Breadcrumb className="container mb-3 py-1 px-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shelter">Shelter</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCardContainer>
            <SectionCard
              icon={<PawPrint />}
              title="Tổng số thú đang chăm sóc"
              number={45}
              changePercentage="5%"
              isHigher={true}
            />
            <SectionCard
              icon={<Check />}
              title="Thú đã được nhận nuôi"
              number={12}
              changePercentage="10%"
              isHigher={true}
            />
            <SectionCard
              icon={<BookOpenTextIcon />}
              title="Bài viết trạm đã đăng"
              number={18}
              changePercentage="15%"
              isHigher={true}
            />
            <SectionCard
              icon={<UsersIcon />}
              title="Số nhân viên & tình nguyện viên"
              number={6}
              changePercentage="0%"
              isHigher={false}
            />
          </SectionCardContainer>

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterDashboard;
