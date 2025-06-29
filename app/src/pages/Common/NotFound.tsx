import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <div className="basis-1/2 text-center">
        <p className="text-base font-semibold text-(--foreground)">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-(--foreground) sm:text-7xl">
          Trang bạn đang tìm kiếm không thể tìm thấy
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-(--foreground) sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild>
            <Link to="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
