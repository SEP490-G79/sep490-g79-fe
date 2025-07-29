import { useContext, useState, useEffect } from "react";
import useAuthAxios from "@/utils/authAxios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
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
import { type Notification } from "@/types/Notification";
function UserNav() {
  const { user, logout, shelters, coreAPI } = useContext(AppContext);
  const authAxios = useAuthAxios();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);

  const hasShelter = shelters?.filter(shelter =>
    shelter.members.some(member => member._id === user?._id)
  );

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
    }
  }, [user?._id]);

  const fetchNotifications = async () => {
    try {
      const res = await authAxios.get(`${coreAPI}/notifications/get-all`);
      const mapped = res.data.notifications
        .map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }))
        .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(mapped);
      setUnseenCount(mapped.filter((n: any) => !n.seen).length);
      // console.log("Notifications fetched:", mapped);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  const handleNotificationClick = async (notificationId: string, redirectUrl: string) => {
    try {
      await authAxios.put(`${coreAPI}/notifications/${notificationId}/mark-seen`);
      fetchNotifications();
      navigate(redirectUrl);
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 hover:text-primary mx-8" />
            {unseenCount > 0 && (
              <span className="absolute top-0 right-5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unseenCount > 99 ? "99+" : unseenCount}
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[20rem]" align="end" forceMount>
          <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="w-full h-72 rounded-md">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() =>
                    handleNotificationClick(notification._id, notification.redirectUrl)
                  }
                  className="cursor-pointer"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="pl-0">
                      <div className="flex justify-start items-center w-full gap-2">
                        {!notification.seen && (
                          <Dot size={40} strokeWidth={4} className="text-primary" />
                        )}
                        <Avatar className="w-[40px] h-[40px] border border-primary">
                          <AvatarImage src={notification.from.avatar} alt="avatar" />
                          <AvatarFallback>
                            {notification.from.fullName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex flex-col text-sm ${notification.seen ? "text-muted-foreground" : ""
                            }`}
                        >
                          <div>
                            <span className="font-bold">{notification.from.fullName}</span>
                            <span className="ml-1">{notification.content}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {notification.createdAt.toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[17rem]">Không có thông báo</div>
            )}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="border border-primary">
              <AvatarImage
                src={user?.avatar}
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="text-sm">
                {user?.fullName?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
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
          {hasShelter !== undefined && hasShelter?.length >= 1 &&
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={`/shelters/${hasShelter[0]?._id}`}>Trung tâm cứu hộ</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          }
          {hasShelter !== undefined && hasShelter?.length < 1 &&
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={"/shelter-establishment"}>Thành lập trạm cứu hộ</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">

                  <Link to={"/shelter-request"}>Danh sách yêu cầu gia nhập và lời mời</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          }
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/profile`}>Hồ sơ cá nhân</Link>

            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/donation-history">Lịch sử ủng hộ</Link>
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
