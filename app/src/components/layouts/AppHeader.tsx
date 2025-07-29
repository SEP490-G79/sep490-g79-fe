import React, { useEffect, useContext } from "react";
import { ModeToggle } from "../ui/mode-toggle";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { HeaderMenu } from "../header/HeaderMenu";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import UserNav from "../header/UserNav";
import AppContext from "@/context/AppContext";
import { Skeleton } from "../ui/skeleton";
import useAuthAxios from "@/utils/authAxios";
import logo from "../../assets/logo/bbkzwnb6hyyrmi8jhiwp.jpg"
import { Avatar, AvatarImage } from "../ui/avatar";
function AppHeader() {
  const { user, setUser, accessToken, coreAPI, loginLoading } = useContext(AppContext);
  const authAxios = useAuthAxios();

  useEffect(() => {
    if (!user && accessToken) {
      authAxios.get(`${coreAPI}/users/get-user`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Lỗi khi fetch user trong AppHeader:", err);
        });
    }
  }, [user, accessToken]);
  
  return (
    <header className="md:px-12 sticky top-0 z-50 w-full border-b border-border/40 bg-background/30 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 justify-between items-center px-4">
        <div className="basis-1/2">
          <a href="/" className="text-lg font-semibold">
            <Avatar>
              <AvatarImage src={logo} alt="pawShelter logo" />
            </Avatar>
          </a>
        </div>

        <div className="basis-1/2 flex justify-end items-center gap-4">
          <div className="hidden md:block">
            <HeaderMenu />
          </div>

          <ModeToggle />

          {loginLoading == true ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <UserNav />
          ) : (
            <div className="flex gap-2">
              <Button
                className="bg-background text-primary border border-border hover:bg-primary hover:text-white"
                variant="outline"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="ghost">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
