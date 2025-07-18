import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Check,
  CheckCircle,
  ChevronsDown,
  ChevronsUp,
  ChevronsUpDown,
  CircleCheckBig,
  CircleSlash,
  Equal,
  Grip,
  GripVertical,
  Menu,
  Square,
  SquareCheck,
  SquareCheckBig,
  Text,
  ToggleLeft,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import type { Question } from "@/types/Question";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
type Props = {
  question: Question;
  setQuestionsList: React.Dispatch<React.SetStateAction<Question[]>>;
  _id?: string;
};

export function QuestionCard({ question, setQuestionsList, _id }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [isOpen, setIsOpen] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(question);
  useEffect(() => {
    setQuestionsList((prev) =>
      prev.map((q) => (q._id == selectedQuestion._id ? selectedQuestion : q))
    );
  }, [selectedQuestion, setQuestionsList]);
  const questionTypes = [
    {
      value: "TEXT",
      Icon: <Text />,
      component: <TextOption />,
    },
    {
      value: "SINGLECHOICE",
      Icon: <CircleCheckBig />,
      component: (
        <SingleChoiceOption
          question={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      ),
    },
    {
      value: "MULTIPLECHOICE",
      Icon: <SquareCheckBig />,
      component: (
        <MultipleChoiceOption
          question={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      ),
    },
    {
      value: "YESNO",
      Icon: <ToggleLeft />,
      component: (
        <YesNoOption
          question={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      ),
    },
  ];

  const handleDelete = (deleteID: string) => {
    setQuestionsList((prev) => prev.filter((q) => q._id != deleteID));
  };

  const mockPriority = [
    { value: "NONE", label: "Không", icon:<CircleSlash/> },
    { value: "LOW", label: "Thấp", icon:<ChevronsDown/> },
    { value: "MEDIUM", label: "Trung bình", icon:<Equal/> },
    { value: "HIGH", label: "Cao", icon:<ChevronsUp/> },
  ];
  return (
    <Collapsible
      ref={setNodeRef}
      style={style}
      open={isOpen}
      onOpenChange={setIsOpen}
      className="basis-full flex flex-col gap-2 my-1 py-5 active:bg-(--secondary)/40 rounded-sm
      border-2 border-(--border)/20 dark:border-(--border)/20 dark:bg-(--secondary)/30 transition-colors duration-200 
      
      hover:shadow-sm shadow-xs dark:hover:shadow-none dark:shadow-(--secondary) cursor-pointer
      dark:hover:bg-(--secondary)/50  active:shadow-none
      "
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="flex ">
          <Button
            variant={"link"}
            className="hover:cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical />
          </Button>
          <Input
            type="text"
            defaultValue={question.title}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            onBlur={(e) => {
              setSelectedQuestion({
                ...selectedQuestion,
                title: e.currentTarget.value,
              });
            }}
            className="text-sm overflow-hidden font-semibold px-2 py-1 
            bg-transparent border-none outline-none shadow-none cursor-pointer
            dark:bg-transparent hover:bg-(--secondary)/60 dark:hover:bg-(--secondary)/60
            focus:outline-1 focus:outline-(--border) focus:border-1 focus:border-(--border) focus:cursor-text
            rounded-sm transition-colors duration-200 min-w-[25rem]"
          />
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                // aria-expanded={open}
                className="w-[150px] justify-between"
              >
                {mockPriority.find(
                  (p) =>
                    p.value.toUpperCase() ==
                    selectedQuestion.priority.toUpperCase()
                )?.label ?? "Chọn độ ưu tiên"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {mockPriority.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.value.toLowerCase()}
                        onSelect={(val) =>
                          setSelectedQuestion((prev) => ({
                            ...prev,
                            priority: val,
                          }))
                        }
                        className="flex items-center justify-between"
                      >
                        <span className="flex gap-2">{opt.icon} {opt.label}</span>
                        {selectedQuestion.priority.toUpperCase() == opt.value.toUpperCase() && (
                          <Check className="text-primary ml-2" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-(--destructive) hover:text-(--destructive) cursor-pointer "
            onClick={() => handleDelete(selectedQuestion._id)}
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
        {!selectedQuestion.type ? (
          <div className="px-2 grid grid-cols-2 md:grid-cols-4 gap-1">
            {questionTypes.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                className="
                justify-start w-full
               
                 "
                onClick={() =>
                  setSelectedQuestion({
                    ...selectedQuestion,
                    type: type.value.toUpperCase(),
                  })
                }
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
            {
              questionTypes.find((type) => type.value == selectedQuestion.type)
                ?.component
            }
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default QuestionCard;
