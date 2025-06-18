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
    <div className="relative w-full h-[80vh] flex flex-col justify-center overflow-hidden">
      {/* Background image */}
        <img
          src={Image}
          className="absolute inset-0 w-full h-2/3 object-bottom z-0"
          alt="background"
          
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 z-10 h-2/3"  />

      {/* Stats box */}
      <section className="relative z-20 bg-[var(--card)] shadow-xl rounded-xl py-10 px-8 mx-auto w-full max-w-6xl -mt-20">
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
