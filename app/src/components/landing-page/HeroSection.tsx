import { Typewriter } from "react-simple-typewriter";

export default function HeroSection() {
  return (
    <div className="h-screen w-full bg-transparent bg-[url('@/assets/Image_2.jpg')] bg-cover bg-center flex items-start justify-center px-4">
      <div className="text-center text-zinc-800  max-w-4xl">
        <h1 className="text-3xl  font-medium mt-16 ">
          <Typewriter
            words={[
              "Chúng tôi kết nối thú cưng với mái ấm",
              "Cùng bạn trao yêu thương",
              "Tìm ngôi nhà thứ hai cho những người bạn nhỏ",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={2000}
            
          />
        </h1>

        {/* Optional: CTA Buttons */}
        {/* <div className="flex justify-center gap-4">
          <Button variant="default">Đăng nhập</Button>
          <Button variant="secondary">Tham gia</Button>
        </div> */}
      </div>
    </div>
  );
}
