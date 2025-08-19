"use client";

import { Bone, Cat, Dog, Home } from "lucide-react";
import Image from "@/assets/Home_1.jpg";

import { isThisWeek } from "date-fns";
import type { Pet } from "@/types/Pet";
import { useContext } from "react";
import AppContext from "@/context/AppContext";
import type { Shelter } from "@/types/Shelter";

export default function Posts() {
  const { petsList, shelters } = useContext(AppContext);

  const pets: Pet[] = petsList || [];
  const shelterList: Shelter[] = shelters || [];

  // Tổng số pet sẵn sàng nhận nuôi
  const totalAvailablePets = pets.filter((p) => p.status === "available").length;

  // Tổng số pet đã được nhận nuôi
  const totalAdoptedPets = pets.filter((p) => p.status === "adopted").length;

  // Tổng số shelter đang hoạt động
  const totalActiveShelters = shelterList.filter((s) => s.status === "active").length;

  // Số pet mới được cứu hộ trong tuần (dựa vào intakeTime)
  const rescuedThisWeek = pets.filter(
    (p) => p.intakeTime && isThisWeek(new Date(p.intakeTime))
  ).length;

  const stats = [
    {
      icon: <Dog className="w-8 h-8 text-(--primary)" />,
      value: totalAvailablePets.toString(),
      label: "Tổng số thú nuôi sẵn sàng nhận nuôi",
    },
    {
      icon: <Bone className="w-8 h-8 text-(--primary)" />,
      value: totalAdoptedPets.toString(),
      label: "Tổng số thú nuôi đã được nhận nuôi",
    },
    {
      icon: <Home className="w-8 h-8 text-(--primary)" />,
      value: totalActiveShelters.toString(),
      label: "Tổng số trung tâm đang hoạt động",
    },
    {
      icon: <Cat className="w-8 h-8 text-(--primary)" />,
      value: rescuedThisWeek.toString(),
      label: "Số thú nuôi mới được cứu hộ trong tuần",
    },
  ];

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] flex flex-col justify-end overflow-hidden">
      {/* Background image as div with parallax */}
      <div
        className="absolute inset-0 w-full h-full z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${Image})` }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-10 h-full" />

      {/* Stats box */}
      <section className="relative z-20 bg-[var(--card)] shadow-xl rounded-xl py-8 px-4 sm:py-10 sm:px-8 mx-auto w-[90%] sm:w-11/12 lg:w-5/6 xl:max-w-6xl mb-10 sm:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="border border-dashed border-[var(--border)] p-3 rounded-md">
                {item.icon}
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {item.value}
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
