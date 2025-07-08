import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Option, Question } from "@/types/Question";
import { Trash2, CornerDownLeft, Check } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  question: Question;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<Question>>;
};
export default function YesNoOption({ question, setSelectedQuestion }: Props) {
  const defaultOptions: Option[] = [
    {
      title: "Yes",
      isTrue: false,
    },
    {
      title: "No",
      isTrue: false,
    },
  ];

  const [options, setOptions] = React.useState<Option[]>(
    question.options && question.options.length > 0
      ? question.options
      : defaultOptions
  );

  const [selectedValue, setSelectedValue] = React.useState(
    options.find((o) => o.isTrue)?.title || ""
  );

  const handleValueChange = (value: string) => {
 
    const updatedOptions = options.map(opt => ({
      ...opt,
      isTrue: opt.title == value,
    }));
    setOptions(updatedOptions);
    setSelectedValue(value);

    // update selected quétion
    setSelectedQuestion({
      ...question,
      type: "YESNO",
      options: updatedOptions,
    });
  };


  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={handleValueChange}
      className="space-y-1"
    >
      {options.map((option) => (
        <div
          key={option.title}
          onClick={() => handleValueChange(option.title)}
          className={`
            flex items-center gap-4 px-2 py-1 rounded-sm border transition-all duration-200
            bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
            dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer
            ${option.isTrue ? "border-4" : ""}
          `}
        >
          {/* Radio + Label */}
          <div className="flex items-center gap-4 flex-1">
            <RadioGroupItem
              value={option.title}
              id={option.title}
              className="cursor-pointer"
            />
            <span className="text-sm font-normal">{option.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {option.isTrue && (
              <Button disabled variant="link" className="text-green-500">
                <Check />
              </Button>
            )}
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
