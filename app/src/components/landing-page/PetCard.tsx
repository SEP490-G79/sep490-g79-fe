import React from "react";
import { Link } from "react-router-dom";
import Image_1 from "@/assets/card_1jpg.jpg";

function PetCard() {
  return (
    <Link
      to="/"
      className="relative group overflow-hidden rounded-xl w-full max-w-xs shadow-lg transition-transform"
    >
      {/* Image */}
      <img src={Image_1} className="w-full h-80 object-cover" />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Text */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
        <div className="flex flex-wrap  text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-gray-300 basis-1 sm:basis-3/4">Tuổi:</span>
          <span className=" basis-1 sm:basis-1/4">4 tháng</span>

          <span className="text-gray-300 basis-1 sm:basis-3/4">Cân nặng:</span>
          <span className=" basis-1 sm:basis-1/4">4 kg</span>

          <span className="text-gray-300 basis-1 sm:basis-3/4">Giới tính:</span>
          <span className=" basis-1 sm:basis-1/4">Đực</span>

          <span className="text-gray-300 basis-1 sm:basis-3/4">Trạng thái:</span>
          <span className=" basis-1 sm:basis-1/4">Chưa sẵn sàng</span>

          <span className="text-gray-300 basis-1 sm:basis-3/4">Thời gian tiếp nhận:</span>
          <span className=" basis-1 sm:basis-1/4">2023</span>
        </div>
        <h3 className="text-lg font-bold mt-2">Hảo Trần </h3>
      </div>
    </Link>
  );
}

export default PetCard;
