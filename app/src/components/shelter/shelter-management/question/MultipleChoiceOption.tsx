import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, CornerDownLeft, Check } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import type { Option, Question } from "@/types/Question";


type Props = {
  question: Question;
  setSelectedQuestion:React.Dispatch<
  React.SetStateAction<Question>>
};
export default function MultipleChoiceOption({ question, setSelectedQuestion }: Props) {
  const [options, setOptions] = React.useState<Option[]>([
    ...question.options
  ]);
  useEffect(()=>{
    setSelectedQuestion({...question,options:options})

  },[])

  // Toggle đáp án đúng (isTrue) cho multi-choice
  const handleTrueToggle = (value: string) => {
    setOptions((opts) =>
      opts.map((opt) =>
        opt.title == value ? { ...opt, isTrue: !opt.isTrue } : opt
      )
    );
  };

  // Xóa option
  const handleDelete = (valueToDelete: string) => {
    setOptions((opts) => opts.filter((opt) => opt.title !== valueToDelete));
  };

  // Đổi label + kiểm tra trùng
  const handleLabelChange = (value: string, newLabel: string) => {
    const trimmed = newLabel.trim();
    const duplicate = options.some(
      (opt) =>
        opt.title !== value &&
        opt.title.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      toast.error("Không thể tạo option trùng lặp!");
      return;
    }
    setOptions((opts) =>
      opts.map((opt) =>
        opt.title === value ? { ...opt, label: trimmed } : opt
      )
    );
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div
          key={option.title}
          className={`
            flex items-center gap-4 px-2 py-1 rounded-sm border transition-all duration-200
            border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
            dark:bg-input/30 dark:border-input dark:hover:bg-input/50
            ${option.isTrue ? "border-4 " : ""}
          `}
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Checkbox để đánh dấu đúng */}
            <Checkbox
              id={option.title}
              checked={option.isTrue}
              onCheckedChange={() => handleTrueToggle(option.title)}
              className="cursor-pointer"
            />

            {/* Label có thể edit */}
            <Input
              type="text"
              defaultValue={option.title}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              onBlur={(e) =>
                handleLabelChange(option.title, e.currentTarget.value)
              }
              className="
              text-sm font-normal bg-transparent border-none outline-none shadow-none dark:bg-transparent
              cursor-pointer hover:bg-[var(--secondary-foreground)]
              focus:outline-1 focus:cursor-text flex-1 max-w-[40rem] overflow-hidden
            "
            />
          </div>

          {/* Các nút action */}
          <div className="flex items-center gap-2">
            {option.isTrue && (<Button disabled variant="link" className="text-green-500"><Check/></Button>)}
            <Button
              variant="link"
              size="icon"
              onClick={() => handleDelete(option.title)}
              className="text-[var(--destructive)] hover:text-[var(--destructive)] cursor-pointer"
            >
              <Trash2 />
            </Button>
            <Button
              variant="link"
              size="icon"
              className="text-[var(--muted-foreground)] hover:text-[var(--muted)] cursor-pointer"
              onClick={() => {
                // placeholder cho undo/duplicate nếu cần
              }}
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
