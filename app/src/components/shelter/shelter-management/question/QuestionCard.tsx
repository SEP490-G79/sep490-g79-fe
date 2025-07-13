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

type Props = {
  question: Question;
  setQuestionsList: React.Dispatch<React.SetStateAction<Question[]>>;
};

export function QuestionCard({ question, setQuestionsList }: Props) {
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
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="basis-full flex flex-col gap-2 my-1 py-5 hover:bg-(--secondary)/40 rounded-sm
      border-2 border-(--border)/20 dark:border-(--border)/20 dark:bg-(--secondary)/30 transition-colors duration-200 hover:border-(--primary) dark:hover:border-(--primary)
      hover:shadow-sm shadow-xs dark:hover:shadow-none dark:shadow-(--secondary) cursor-pointer
      dark:hover:bg-(--secondary)/50 hover:cursor-grab active:cursor-grabbing active:shadow-none
      "
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="flex">
          <Button variant={"link"} className="cursor-grab">
            <Grip />
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
            dark:bg-transparent hover:bg-(--secondary-foreground)
            focus:outline-1 focus:outline-(--border) focus:border-1 focus:border-(--border) focus:cursor-text
            rounded-sm transition-colors duration-200 min-w-[25rem]"
          />
        </div>
        <div>
          
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
