import React, { useState, useContext, useEffect } from "react";
import UserInfo from "@/components/user/profile/UserInfo";
import Posts from "@/components/user/profile/Posts";
import AdoptionActivities from "@/components/user/profile/AdoptionActivities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ellipsis, MoreHorizontal, Pencil } from "lucide-react";
import AppContext from "@/context/AppContext";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { useParams } from "react-router-dom";
import type { User } from "@/types/User";
import { toast } from "sonner";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ReportUserDialog from "@/components/user/profile/ReportUser";

function ProfilePage() {
  const [showActivities, setShowActivities] = useState(() => {
    return localStorage.getItem("profileTab") === "activities";
  });
  const { userId } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const { userProfile, userAPI, } = useContext(AppContext);
  const isOwnProfile = !userId || userId === userProfile?._id;
  const isGuest = !userProfile;
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const idToFetch = userId || userProfile?._id;
    if (!idToFetch) return;
    axios.get(`${userAPI}/user-profile/${idToFetch}`)
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Không thể tải thông tin người dùng", { id: "user-load-error" }));

  }, [userId, userProfile]);

  useEffect(() => {
  if (isGuest && localStorage.getItem("profileTab") === "activities") {
    setShowActivities(false);
    localStorage.setItem("profileTab", "posts");
  }
}, [isGuest]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("profileTab");
    };
  }, []);

  if (!profile) return <div className="p-40  text-center">Người dùng không tồn tại</div>;


  return (
    <div className="h-full w-full">
      {/* Background cover */}

      <div className="w-full mx-auto h-[300px] sm:h-[350px] md:h-[400px] px-4 sm:px-6">
        <PhotoProvider>
          <PhotoView
            src={
              profile?.background ||
              "https://i.pinimg.com/736x/39/8c/28/398c2833aad3c95c80ced32b23e17eb8.jpg"
            }
          >
            <img
              src={
                profile?.background ||
                "https://i.pinimg.com/736x/39/8c/28/398c2833aad3c95c80ced32b23e17eb8.jpg"
              }
              alt="Background"
              className="w-full h-full object-cover object-center rounded-lg shadow-md"
            />
          </PhotoView>
        </PhotoProvider>
      </div>

      {/* Main layout: 2 cột */}
      <div className="flex flex-col lg:flex-row gap-0 px-4 sm:px-6 mt-[10px] min-h-screen relative z-10">
        {/* Cột trái: Card */}
        <div className="hidden lg:block lg:w-1/3">
          <UserInfo profile={profile} />
        </div>

        {/* Cột phải: Nút + nội dung */}
        <div className="w-full lg:w-2/3 mr-20">
          {/* Nút */}
          <div className="border-b border-gray-300 mb-4 flex justify-between items-center pt-10">
            {/* Tabs */}
            <div className="flex gap-6">
              <button
                onClick={() => {
                  setShowActivities(false);
                  localStorage.setItem("profileTab", "posts");
                }}
                className={`text-sm font-medium pb-[15px] ${!showActivities
                  ? "border-b-[2px] border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Bài đăng
              </button>

              {!isGuest && (
              <button
                onClick={() => {
                  setShowActivities(true);
                  localStorage.setItem("profileTab", "activities");
                }}
                className={`text-sm font-medium pb-[15px] ${showActivities
                  ? "border-b-[2px] border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Thú nuôi của bạn
              </button>
              )}
            </div>
            {/* Post button */}
            {isOwnProfile ? (
              <Link to="/profile-setting">
                <Button variant="default" className="-mt-10">
                  <Pencil /> Chỉnh sửa thông tin
                </Button>
              </Link>
            ) : (
              (!isGuest && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-md">
                    <Ellipsis className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-10 p-1">
                  <ReportUserDialog userId={userId} key={userId} />
                </DropdownMenuContent>
              </DropdownMenu>
              ))
            )}
          </div>

          {/* Nội dung */}
          <div className="mt-6">
            {showActivities ? <AdoptionActivities userId={profile?._id} /> : <Posts profileUserId={profile?._id} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
