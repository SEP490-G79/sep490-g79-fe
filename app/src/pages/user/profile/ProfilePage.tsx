import React, { useState } from "react";
import UserInfo from "@/components/user/profile/UserInfo";
import Posts from "@/components/user/profile/Posts";
import AdoptionActivities from "@/components/user/profile/AdoptionActivities";
import { Button } from "@/components/ui/button";


function ProfilePage() {
  const [showActivities, setShowActivities] = useState(false);

  const user = {
    background: "https://i.pinimg.com/736x/c8/3b/c9/c83bc998e196e566b46a2bc60f169d42.jpg",
  };

  return (
    <div className="h-full w-full">
      {/* Background cover */}

      <div className="w-full mx-auto h-[300px] sm:h-[350px] md:h-[400px] px-4 sm:px-6">
        <img
          src={user.background}
          alt="Background"
          className="w-full h-full object-cover object-center rounded-lg shadow-md"
        />
      </div>


      {/* Main layout: 2 cột */}
      <div className="flex flex-col lg:flex-row gap-0 px-4 sm:px-6 mt-[10px] min-h-screen relative z-10">
        {/* Cột trái: Card */}
         <div className="hidden lg:block lg:w-1/3">
    <UserInfo />
  </div>

        {/* Cột phải: Nút + nội dung */}
        <div className="w-full lg:w-2/3 mr-20">
          {/* Nút */}
          <div className="border-b border-gray-300 mb-4 flex justify-between items-center pt-10">
            {/* Tabs */}
            <div className="flex gap-6">
              <button
                onClick={() => setShowActivities(false)}
                className={`text-sm font-medium pb-[15px] ${!showActivities
                    ? "border-b-[2px] border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Bài đăng
              </button>
              <button
                onClick={() => setShowActivities(true)}
                className={`text-sm font-medium pb-[15px] ${showActivities
                    ? "border-b-[2px] border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Thú nuôi của bạn
              </button>
            </div>
            {/* Post button */}
            <Button variant="default" className="-mt-10">
  Chỉnh sửa thông tin
</Button>

          </div>


          {/* Nội dung */}
          <div className="mt-6">
            {showActivities ? <AdoptionActivities /> : <Posts />}
          </div>
        </div>
      </div>

    </div>
  );
}

export default ProfilePage;
