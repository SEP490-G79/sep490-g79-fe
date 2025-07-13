import { Input } from "@/components/ui/input";
import React from "react";

function TextOption() {
  return (
    <div>
      <Input
        type="text"
        placeholder="Text input ..."
        disabled
        className="font-normal text-sm overflow-hidden px-2 py-1 
            bg-transparent dark:bg-transparent
            border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
            dark:bg-input/30 dark:border-input dark:hover:bg-input/50
            border-t-0 border-x-0
            outline-none
            shadow-none cursor-pointer
            focus:cursor-text 
            rounded-none transition-colors duration-200 min-w-[25rem] disabled"
      />
    </div>
  );
}

export default TextOption;
