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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import logo from "../../assets/logo/logo.png"

function AppFooter() {
  return (
    <footer className="border-t py-10 px-6">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 max-w-7xl mx-auto">
        {/* Logo & Quote */}
        <div className="flex flex-col text-sm gap-1">
          <div className="text-xl font-bold">
             <img
              src={logo}
              alt="pawShelter logo"
              className="h-20 w-auto"
            />
          </div>
          <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground max-w-xs">
            &quot;Bạn không thể thay đổi cả thế giới, nhưng bạn có thể thay đổi
            cả thế giới của một chú thú cưng.&quot;
          </blockquote>
        </div>

        {/* Team */}
        <div className="flex flex-col text-sm gap-1">
          <h3 className="font-semibold mb-2">Thành viên nhóm</h3>
          <a href="#">Nguyễn Minh Trí</a>
          <a href="#">Trần Hữu Hảo</a>
          <a href="#">Dương Quang Tuấn</a>
          <a href="#">Nguyễn Viết Hưng</a>
          <a href="#">Lê Quý Hoàn</a>
        </div>

        {/* Resources */}
        <div className="flex flex-col text-sm gap-1">
          <h3 className="font-semibold mb-2">Tài nguyên</h3>
          <a href="/">Trang chủ</a>
          <a href="/about-us">Về chúng tôi</a>
          <a href="/adoption-procedures">Thủ tục nhận nuôi</a>
          <a href="/faq">FAQ</a>
        </div>

        {/* Contact */}
        <div className="flex flex-col text-sm gap-1">
          <h3 className="font-semibold mb-2">Thông tin liên hệ</h3>
          <a href="#" className="flex items-center gap-2">
            <MapPinHouse className="w-9 h-9 mb-auto" />
            Đại học FPT, Khu Công nghệ cao Hòa Lạc, Thạch Hòa, Thạch Thất, Hà Nội
          </a>
          <a href="#" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            pawsheltersystem@gmail.com
          </a>
          <a href="#" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            +84 865498699
          </a>
        </div>

        {/* Social */}
        <div className="flex flex-col text-sm gap-1">
          <h3 className="font-semibold mb-2">Mạng xã hội</h3>
          <div className="flex items-center gap-4">
            <a href="/" className="hover:text-blue-600">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="/" className="hover:text-pink-500">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="/" className="hover:text-red-600">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="/" className="hover:text-sky-500">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
