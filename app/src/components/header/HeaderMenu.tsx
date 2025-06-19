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

const intros: { title: string; href: string; description: string }[] = [
  {
    title: "Về PawShelter",
    href: "#",
    description:
      "Tìm hiểu sứ mệnh, tầm nhìn và hành trình mang lại mái ấm cho thú cưng bị bỏ rơi.",
  },
  {
    title: "FAQ",
    href: "#",
    description:
      "Giải đáp các câu hỏi thường gặp về nhận nuôi, quy trình, quy định và cách hỗ trợ.",
  }
];


const adoptions: { title: string; href: string; description: string }[] = [
  {
    title: "Danh sách thú cưng",
    href: "#",
    description:
      "Khám phá những người bạn đang chờ được yêu thương và tìm mái ấm mới.",
  },
  {
    title: "Danh sách trung tâm cứu hộ",
    href: "#",
    description:
      "Xem các trung tâm cứu trợ đang chăm sóc thú cưng và sẵn sàng kết nối với bạn.",
  },
  {
    title: "Thủ tục nhận nuôi",
    href: "#",
    description:
      "Tìm hiểu các bước để trở thành người đồng hành cùng thú cưng của PawShelter.",
  },
];


const supports: { title: string; href: string; description: string }[] = [
  {
    title: "Ủng hộ",
    href: "#",
    description:
      "Chung tay hỗ trợ PawShelter bằng hiện vật, tài chính hoặc thời gian của bạn.",
  },
  {
    title: "Cộng đồng",
    href: "/newfeed",
    description:
      "Kết nối với những người cùng chung tình yêu thú cưng, chia sẻ và lan tỏa yêu thương.",
  },
  {
    title: "Danh sách bài viết",
    href: "#",
    description:
      "Đọc các câu chuyện, hướng dẫn chăm sóc và thông tin hữu ích về thế giới thú cưng.",
  },
];

export function HeaderMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent mr-1">
            Giới thiệu
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2  grid-cols-1 ">
              {intros.map((intro) => (
                <ListItem
                  key={intro.title}
                  title={intro.title}
                  href={intro.href}
                >
                  {intro.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent mr-1">
            Nhận nuôi
          </NavigationMenuTrigger>
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
          <NavigationMenuTrigger className="bg-transparent mr-1">
            Hỗ trợ
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2  grid-cols-1 ">
              {supports.map((support) => (
                <ListItem
                  key={support.title}
                  title={support.title}
                  href={support.href}
                >
                  {support.description}
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
