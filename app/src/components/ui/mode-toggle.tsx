"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme/theme-provider";

type ThemeKey = "light" | "dark" | "system";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const animateThemeChange = async (nextTheme: ThemeKey) => {
    const root = document.documentElement;
    const trigger = btnRef.current;

    // Fallback nếu chưa hỗ trợ View Transitions
    const applyTheme = () => {
      // Tính "effective theme" để đảm bảo DOM phản ánh ngay lập tức
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const willBeDark = nextTheme === "dark" || (nextTheme === "system" && systemDark);
      flushSync(() => {
        root.classList.toggle("dark", willBeDark);
      });
      // Đồng bộ với context/provider (persist, localStorage, v.v.)
      setTheme(nextTheme);
    };

    // Nếu không có trigger hoặc không hỗ trợ API → áp dụng trực tiếp
    if (!trigger || !(document as any).startViewTransition) {
      applyTheme();
      return;
    }

    // Bắt đầu transition và đảm bảo cập nhật DOM trong callback
    await (document as any).startViewTransition(() => {
      applyTheme();
    }).ready;

    // Tạo hiệu ứng tròn nở ra từ tâm của nút
    const { top, left, width, height } = trigger.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={btnRef} variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => animateThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => animateThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => animateThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
