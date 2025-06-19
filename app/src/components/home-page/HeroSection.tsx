import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="w-full h-[50vh] min-h-[300px] px-6 md:px-16 lg:px-24 xl:px-40 overflow-hidden flex items-center">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-4">
            <Badge
              variant="outline"
              className="w-max text-sm text-[var(--primary-forground)] "
            >
              Chúng tôi đang hoạt động!
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--primary)] leading-snug">
              Kết nối yêu thương, <br /> Tìm mái ấm cho thú cưng
            </h1>
            <p className="text-sm md:text-base text-(--muted-foreground) max-w-lg">
              Tại PawShelter, mỗi chú chó mèo đều xứng đáng có cơ hội thứ hai.
              Hãy cùng chúng tôi trao yêu thương và tìm ngôi nhà mới cho các bé.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <Button size="sm" variant="outline" className="gap-2" asChild>
                <Link to="">Xem danh sách thú cưng <MoveRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>

          {/* Right Lottie Animation */}
          <div className="flex justify-center items-center">
            <DotLottieReact
              src="https://lottie.host/566cf342-c6cd-4c68-aa0b-97aa78dc2869/LPhWsMJyHr.lottie"
              autoplay
              loop
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
