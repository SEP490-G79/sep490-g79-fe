import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}
function SideBar({ items }: SidebarNavProps) {
  const { shelterId } = useParams();
  const pathname = useLocation().pathname;
  // console.log(pathname);
  const currentTab = pathname.split("/").pop() || "";
  return (
    <nav
      className={
        "w-full flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto"
      }
    >
      {items.map((item) => {
        const isActive =
          item.href == ""
            ? currentTab == "management" 
            : currentTab == item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "font-medium  bg-(--secondary) "
                : "font-medium  hover:bg-(--background)  hover:underline",
              "justify-start basis-1/4 lg:w-3/4"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export default SideBar;
