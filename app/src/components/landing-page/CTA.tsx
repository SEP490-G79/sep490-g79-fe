import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/magicui/bento-grid";
import CTA_1 from "@/assets/CTA_1.jpg";

import {
  HomeIcon,
  PawPrintIcon,
  CheckCircleIcon,
  ClockIcon,
  BellRingIcon,
} from "lucide-react";

const features = [
  {
    Icon: HomeIcon,
    name: 50,
    description: "Số lượng Shelter",
    href: "/shelters",
    cta: "Xem danh sách shelter",
    background: <img className="absolute bg-cover bg-center -top-20" alt="" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: PawPrintIcon,
    name: 300,
    description: "Sẵn sàng nhận nuôi",
    href: "/pets/available",
    cta: "Tìm thú cưng",
    background: <img className="absolute  bg-cover bg-center -top-20" alt="" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: CheckCircleIcon,
    name: 1000,
    description: "Đã được nhận nuôi",
    href: "/pets/adopted",
    cta: "Xem hành trình yêu thương",
    background: <img className="absolute  bg-cover bg-center -top-20" alt="" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: ClockIcon,
    name: 300,
    description: "Chưa sẵn sàng nhận nuôi",
    href: "/pets/not-ready",
    cta: "Xem danh sách",
    background: <img className="absolute  bg-cover bg-center -top-20" alt="" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellRingIcon,
    name: 100,
    description: "Cập nhật & Thông báo",
    href: "/notifications",
    cta: "Xem thông báo",
    background: <img className="absolute  bg-cover bg-center -top-20" alt="" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function CTA() {
  return (
    <section className="w-full px-40 py-20 flex flex-wrap justify-center mt-10">
      <h2 className="basis-3xl text-center text-3xl font-bold mb-5">
        Một hành trình – Nhiều trái tim yêu thương
      </h2>
      <p className="basis-3xl text-center text-1xl text-muted-foreground mb-10 px-20">
        Cùng nhìn lại những con số biết nói về hành trình kết nối những mái nhà
        và các bé thú cưng. Mỗi lượt nhận nuôi, mỗi thông báo được chia sẻ – tất
        cả đều là yêu thương được lan tỏa.
      </p>

      <BentoGrid className="grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
}
