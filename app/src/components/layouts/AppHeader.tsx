import React from "react";
import { ModeToggle } from "../ui/mode-toggle";

function AppHeader() {
  return (
    <header className="md:px-12 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="flex h-14 justify-between px-4 ">
        <div className="grid-cols-1 basis-sm">Logo</div>
        <div className="grid-cols-2 basis-4xl">
          
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
