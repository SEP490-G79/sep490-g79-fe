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
  ShieldCheck,
  HeartPlus,
} from "lucide-react";
import { useContext, useMemo } from "react";
import AppContext from "@/context/AppContext";
import type { Pet } from "@/types/Pet";

export function CTA() {
  const { petsList, shelters } = useContext(AppContext);
  const notifications : any=[];
  const {
    totalActiveShelters,
    totalAvailablePets,
    totalAdoptedPets,
    totalNotReadyPets,
    totalNotifications,
  } = useMemo(() => {
    const pets = petsList || [];
    const sh = shelters || [];

    const totalActiveShelters = sh.filter((s) => s.status == "active").length;
    const totalAvailablePets = pets.filter(
      (p:Pet) => p.status == "available"
    ).length;
    const totalAdoptedPets = pets.filter((p:Pet) => p.status == "adopted").length;
    const totalNotReadyPets = pets.length;

    const totalNotifications = notifications?.length ?? 0;

    return {
      totalActiveShelters,
      totalAvailablePets,
      totalAdoptedPets,
      totalNotReadyPets,
      totalNotifications,
    };
  }, [petsList, shelters, notifications]);

  

  const bgImg = (
    <img
      src={(CTA_1 as any).src ?? (CTA_1 as unknown as string)}
      alt=""
      className="absolute inset-0 h-full w-full object-cover opacity-20 right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
    />
  );

  const features = [
    {
      Icon: HomeIcon,
      name: totalActiveShelters,
      description: "Trung tâm đang đang hoạt động",
      href: "/shelters",
      cta: "Xem danh sách shelter",
      // background: bgImg,
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: PawPrintIcon,
      name: totalAvailablePets,
      description: "Số thú nuôi sẵn sàng nhận nuôi",
      href: "/pets-list",
      cta: "Tìm thú cưng",
      // background: bgImg,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: CheckCircleIcon,
      name: totalAdoptedPets,
      description: "Số thú nuôi đã được nhận nuôi",
      href: "/adoption-procedures",
      cta: "Xem thủ tục nhận nuôi",
      // background: bgImg,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: ShieldCheck,
      name: totalNotReadyPets,
      description: "Số thú nuôi được cứu hộ",
      href: "/pets-list",
      cta: "Xem danh sách",
      // background: bgImg,
      className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: HeartPlus,
      name: totalNotifications,
      description: "Số lượng giống loài trong hệ thống",
      href: "/pets-list",
      cta: "Xem danh sách thú nuôi",
      // background: bgImg,
      className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4",
    },
  ];
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
        {features.map((feature, index) => (
          <BentoCard key={index} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
}
