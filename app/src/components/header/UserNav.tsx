import React, { useContext, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Image from "@/assets/card.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AppContext from "@/context/AppContext";
import { Bell, Dot } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { mockNotifications, type Notification } from "@/types/Notification";

function UserNav() {
  const { user, logout } = useContext(AppContext);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const navigate = useNavigate();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="relative">
              <button className="focus:outline-none flex items-center">
                <Bell className="w-5 h-5 hover:text-primary mx-8 cursor-pointer" />
              </button>
              {/* {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unseenCount > 9 ? '9+' : unseenCount}
              </span>
            )} */}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[20rem]" align="end" forceMount>
          <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="w-full h-72 rounded-md">
            {notifications?.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification?.id}
                  to={notification?.content.redirectUrl}
                  // onClick={() => handleSeenNotification(notification?.id)}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="pl-0 cursor-pointer">
                      <div className="flex justify-start items-center">
                        <Dot
                          size={40}
                          strokeWidth={4}
                          className={` ${
                            !notification?.seen ? "text-primary" : "text-background"
                          }`}
                        />
                        <div
                          className={`flex flex-col ${
                            notification?.seen ? "text-slate-600 dark:text-slate-400" : ""
                          }`}
                        >
                          <div className="flex gap-2">
                            <Avatar className="border-solid border-primary border-2 w-[40px] h-[40px]">
                              <AvatarImage
                                src={notification?.content.from.avatar}
                                alt="picture"
                              />
                              <AvatarFallback>
                                {notification?.content.from.name?.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-xs">
                              <span className="font-bold">
                                {notification?.content.from.name}
                              </span>
                              <span className="ml-1">
                                {notification?.content.description}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            {notification?.created_at}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center h-[17rem]">
                Không có thông báo
              </div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage
                src={user?.avatar}
                className="w-full h-full object-cover"
              />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium leading-none">
                {user?.fullName || "Full name"}{" "}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || "Email"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={"/"}>Trung tâm cứu hộ</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/profile`}>Hồ sơ cá nhân</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/">Lịch sử ủng hộ</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile-setting">Cài đặt</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              onClick={() => {
                logout();
                setTimeout(() => navigate("/login"), 1000);
              }}
            >
              Đăng xuất
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default UserNav;
