import React from "react";
import { ModeToggle } from "../ui/mode-toggle";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { HeaderMenu } from "../header/HeaderMenu";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function AppHeader() {
  return (
    <header className="md:px-12 sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 justify-between items-center px-4 ">
        <div className="basis-1/2 just">
          <a href="/">Logo</a>
        </div>
        <div className="basis-1/2 flex justify-end">
          <div className=" basis-4/12"><HeaderMenu/></div>
          <div className=" basis-1/12"><ModeToggle/></div>
          <div className=" basis-3/12 flex justify-around">
              <Button className="bg-(--background) hover:text-slate-50 text-primary border border-(--border)">
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="ghost" >
                <Link to="/register">Register</Link>
              </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
