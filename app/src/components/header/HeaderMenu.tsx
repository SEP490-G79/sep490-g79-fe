import * as React from "react";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const adoptions: { title: string; href: string; description: string }[] = [
  {
    title: "Danh sách thú cưng",
    href: "#",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Thủ tục nhận nuôi",
    href: "#",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Thủ tục nhận nuôi",
    href: "#",
    description:
      "For sighted users to preview content available behind a link.",
  },
];

export function HeaderMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent mr-1">Nhận nuôi</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2  grid-cols-1 ">
              {adoptions.map((adoption) => (
                <ListItem
                  key={adoption.title}
                  title={adoption.title}
                  href={adoption.href}
                >
                  {adoption.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent mr-1">Nhận nuôi</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2  grid-cols-1 ">
              {adoptions.map((adoption) => (
                <ListItem
                  key={adoption.title}
                  title={adoption.title}
                  href={adoption.href}
                >
                  {adoption.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
