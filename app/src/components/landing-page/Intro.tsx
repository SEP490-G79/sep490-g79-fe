import React from "react";
import { IconCloud } from "../ui/magicui/icon-cloud";

function Intro() {

  const images = [
    "https://images.unsplash.com/photo-1720048171230-c60d162f93a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675553988173-a5249b5815fe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675297844586-534b030564e0?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675555581018-7f1a352ff9a6?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1719937050517-68d4e2a1702e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1720048171230-c60d162f93a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675553988173-a5249b5815fe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675297844586-534b030564e0?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675555581018-7f1a352ff9a6?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1719937050517-68d4e2a1702e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1720048171230-c60d162f93a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675553988173-a5249b5815fe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675297844586-534b030564e0?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675555581018-7f1a352ff9a6?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://i.pinimg.com/736x/e3/68/60/e36860b7202089cc360cb9448514bad2.jpg",
    "https://i.pinimg.com/736x/e3/68/60/e36860b7202089cc360cb9448514bad2.jpg",
    "https://i.pinimg.com/736x/e3/68/60/e36860b7202089cc360cb9448514bad2.jpg",
    "https://i.pinimg.com/736x/e3/68/60/e36860b7202089cc360cb9448514bad2.jpg",
    "https://i.pinimg.com/736x/e3/68/60/e36860b7202089cc360cb9448514bad2.jpg",

  ];
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-around pt-5 px-6 lg:px-40 bg-background">
    <div className="w-full lg:w-1/2 text-center lg:text-left">
      <h2 className="text-3xl font-bold mb-4">Về PawShelter</h2>
      <p className="text-muted-foreground text-base mb-3">
        <strong>Thành viên:</strong> Chúng tôi là một nhóm sinh viên trẻ với cùng đam mê yêu động vật và khát vọng tạo nên thay đổi tích cực trong cộng đồng.
      </p>
      <p className="text-muted-foreground text-base mb-3">
        <strong>Dự án:</strong> PawShelter là nền tảng kết nối giữa các trạm cứu hộ động vật, người nuôi thú và những ai muốn nhận nuôi. Dự án phát triển theo mô hình mở, minh bạch và hỗ trợ cộng đồng.
      </p>
      <p className="text-muted-foreground text-base">
        <strong>Mục tiêu:</strong> Chúng tôi mong muốn mỗi thú cưng bị bỏ rơi đều có cơ hội được yêu thương, chăm sóc, và tìm thấy một mái ấm trọn đời.
      </p>
    </div>
    <div className="w-full lg:w-1/3 mb-10 lg:mb-0">
      <IconCloud images={images} />
    </div>
  </section>
  );
}

export default Intro;
