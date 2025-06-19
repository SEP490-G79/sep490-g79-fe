import { Bone, Cat, Dog, ScissorsSquare } from "lucide-react";
import Image from "@/assets/Home_1.jpg";

const stats = [
  {
    icon: <Bone className="w-8 h-8 text-(--primary)" />,
    value: "748",
    label: "Đã nhận nuôi",
  },
  {
    icon: <Cat className="w-8 h-8 text-(--primary)" />,
    value: "3560",
    label: "Đã nhận nuôi",
  },
  {
    icon: <Dog className="w-8 h-8 text-(--primary)" />,
    value: "5674",
    label: "Đã nhận nuôi",
  },
  {
    icon: <ScissorsSquare className="w-8 h-8 text-(--primary)" />,
    value: "6789",
    label: "Đã nhận nuôi",
  },
];

export default function Posts() {
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
