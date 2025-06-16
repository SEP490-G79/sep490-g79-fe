import {
  Facebook,
  Instagram,
  Mail,
  MapPinHouse,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import React from "react";

function AppFooter() {
  return (
    <footer className="border-t py-10">
      <div className="flex justify-around text-start px-10">
        <div className="basis-3/12">
          <div className="mb-2">LOGO</div>
          <blockquote className="mt-6 border-l-2 pl-6 italic text-sm w-1/2">
            &quot;After all,&quot; he said, &quot;everyone enjoys a good joke,
            so it&apos;s only fair that they should pay for the privilege.&quot;
          </blockquote>
        </div>
        <div className="basis-2/12 flex flex-col text-sm">
          <h3 className="mb-2">Team</h3>
          <a href="#">Nguyễn Minh Trí</a>
          <a href="#">Trần Hữu Hảo</a>
          <a href="#">Dương Quang Tuấn</a>
          <a href="#">Nguyễn Viết Hưng</a>
          <a href="#">Lê Quý Hoàn</a>
        </div>
        <div className="basis-2/12 flex flex-col text-sm">
          <div className="mb-2">Tài nguyên</div>
          <a href="#">Trang chủ</a>
          <a href="#">Thủ tục nhận nuôi</a>
          <a href="#">Chính sách</a>
        </div>
        <div className="basis-2/12 flex flex-col text-sm">
          <div className="mb-2">Thông tin liên hệ</div>
          <a href="#" className="flex items-center gap-x-2">
            <MapPinHouse className="w-4 h-4" />
            <span>Hòa Lạc</span>
          </a>
          <a href="#" className="flex items-center gap-x-2">
            <Mail className="w-4 h-4" />
            <span>4189hr34@gmail.com</span>
          </a>
          <a href="#" className="flex items-center gap-x-2">
            <Phone className="w-4 h-4" />
            <span>+8473489164271</span>
          </a>
        </div>
        <div className="basis-2/12 flex flex-col text-sm">
          <div className="mb-2">Mạng xã hội</div>
          <div className="flex items-center gap-x-4 text-sm">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-600"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-500"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
