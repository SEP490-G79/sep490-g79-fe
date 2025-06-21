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
    <footer className="border-t py-10 px-6">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 max-w-7xl mx-auto">
        {/* Logo & Quote */}
        <div>
          <div className="mb-4 text-xl font-bold">LOGO</div>
          <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground max-w-xs">
            &quot;After all,&quot; he said, &quot;everyone enjoys a good joke,
            so it&apos;s only fair that they should pay for the privilege.&quot;
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
          <a href="#">Trang chủ</a>
          <a href="#">Thủ tục nhận nuôi</a>
          <a href="#">Chính sách</a>
        </div>

        {/* Contact */}
        <div className="flex flex-col text-sm gap-1">
          <h3 className="font-semibold mb-2">Thông tin liên hệ</h3>
          <a href="#" className="flex items-center gap-2">
            <MapPinHouse className="w-4 h-4" />
            Hòa Lạc
          </a>
          <a href="#" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            4189hr34@gmail.com
          </a>
          <a href="#" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            +84 73489164271
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
