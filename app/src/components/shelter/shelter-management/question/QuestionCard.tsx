import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  ChevronsUpDown,
  CircleCheckBig,
  Grip,
  Square,
  SquareCheck,
  SquareCheckBig,
  Text,
  ToggleLeft,
  Trash,
} from "lucide-react";
import { useState } from "react";
import TextOption from "./TextOption";
import SingleChoiceOption from "./SingleChoiceOption";
import YesNoOption from "./YesNoOption";
import MultipleChoiceOption from "./MultipleChoiceOption";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Value } from "@radix-ui/react-select";

export function QuestionCard({}) {
  const [isOpen, setIsOpen] = useState(false);
  const [questionType, setQuestionType] = useState("");
  
  const questionTypes = [
    {
      value: "text",
      Icon: <Text />,
      component: <TextOption />,
    },
    {
      value: "single",
      Icon: <CircleCheckBig />,
      component: <SingleChoiceOption />,
    },
    {
      value: "multiple",
      Icon: <SquareCheckBig />,
      component: <MultipleChoiceOption />,
    },
    {
      value: "yesno",
      Icon: <ToggleLeft />,
      component: <YesNoOption />,
    },
  ];
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="basis-full flex flex-col gap-2 my-1 py-5 "
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
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-(--destructive) hover:text-(--destructive) cursor-pointer "
          >
            <Trash />
          </Button>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer"
            >
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="flex flex-col gap-2 px-6">
        {!questionType ? (
          <div className="px-2 grid grid-cols-2 md:grid-cols-4 gap-1">
            {questionTypes.map((type) => (
              <Button
                variant="outline"
                className="
                justify-start w-full
               
                 "
                onClick={() => setQuestionType(type.value)}
              >
                <span className="text-(--foregrounds) flex gap-2">
                  {" "}
                  <span className="translate-y-0.5">{type.Icon}</span>{" "}
                  {type.value}{" "}
                </span>
              </Button>
            ))}
          </div>
        ) : (
          <>
            {questionTypes.find((type) => type.value == questionType)?.component}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default QuestionCard;
