import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Grip, Trash } from "lucide-react";
import { useState } from "react";
import TextOption from "./TextOption";
import SingleChoiceOption from "./SingleChoiceOption";
import YesNoOption from "./YesNoOption";
import MultipleChoiceOption from "./MultipleChoiceOption";

export function QuestionCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="basis-full flex flex-col gap-2 my-3 "
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="flex">
          <Button variant={"link"} className="cursor-grab">
            <Grip />
          </Button>
          <Input
            type="text"
            defaultValue="Question titles"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="text-sm overflow-hidden font-semibold px-2 py-1 
            bg-transparent border-none outline-none shadow-none cursor-pointer
            dark:bg-transparent
            focus:outline-1 focus:outline-(--border) focus:border-1 focus:border-(--border) focus:cursor-text
            rounded-sm transition-colors duration-200 min-w-[25rem]"
          />
        </div>
        <div>
          <Button variant="ghost" size="icon" className="size-8 text-(--destructive) hover:text-(--destructive) cursor-pointer ">
            <Trash />
          </Button>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="flex flex-col gap-2 px-6">
        <TextOption/>
        <SingleChoiceOption/>
        <YesNoOption/>
        <MultipleChoiceOption/>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default QuestionCard;
