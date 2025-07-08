import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, CornerDownLeft, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Option, Question } from "@/types/Question";

type Props = {
  question: Question;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<Question>>;
};
export default function MultipleChoiceOption({
  question,
  setSelectedQuestion,
}: Props) {
  const defaultOptions: Option[] = [
    {
      title: "",
      isTrue: false,
    },
  ];

  const [options, setOptions] = useState<Option[]>(
    question.options && question.options.length > 0
      ? question.options
      : defaultOptions
  );


  //create option
  const handleCreateOption = () => {
    const newOptionTitle = ``;
    if (options.some((opt) => opt.title.trim() == "")) {
      toast.error("Vui lòng điền tất cả các câu trả lời trước khi thêm.");
      return;
    }
    if (
      options.some(
        (opt) =>
          opt.title.trim().toLowerCase() == newOptionTitle.trim().toLowerCase()
      )
    ) {
      toast.error("Câu trả lời không được trùng lặp!");
      return;
    }
    const newOption: Option = {
      title: newOptionTitle,
      isTrue: false,
    };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);

    // Update selected question
    setSelectedQuestion({
      ...question,
      type: "MULTIPLECHOICE",
      options: updatedOptions,
    });
  };


  // Toggle đáp án đúng (isTrue) cho multi-choice
  const handleTrueToggle = (value: string) => {
    const updated = options.map((opt) =>
      opt.title == value ? { ...opt, isTrue: !opt.isTrue } : opt
    );
    setOptions(updated);
    // update selected question
    setSelectedQuestion({
      ...question,
      type: "MULTIPLECHOICE",
      options: updated,
    });
  };

  // Xóa option
  const handleDelete = (valueToDelete: string) => {
    const updated = options.filter((opt) => opt.title !== valueToDelete);
    setOptions(updated);
    setSelectedQuestion({
      ...question,
      type: "MULTIPLECHOICE",
      options: updated,
    });
  };

  // Đổi label + kiểm tra trùng
  const handleLabelChange = (oldTitle: string, newRaw: string) => {
    const newTitle = newRaw.trim();
    if (newTitle == "") {
      toast.error("Câu trả lời không được để trống!");
      return;
    }
    if (
      options.some(
        (opt) =>
          opt.title.trim().toLowerCase() === newTitle.toLowerCase() &&
          opt.title !== oldTitle
      )
    ) {
      toast.error("Câu trả lời không được trùng lặp!");
      return;
    }

    const updated = options.map((opt) =>
      opt.title == oldTitle ? { ...opt, title: newTitle } : opt
    );
    setOptions(updated);
    setSelectedQuestion({
      ...question,
      type: "MULTIPLECHOICE",
      options: updated,
    });
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
              placeholder="Nhập câu trả lời"
              autoFocus={option.title == ""}
              defaultValue={option.title}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              onBlur={(e) =>{
                const raw = e.currentTarget.value;
                const trimmed = raw.trim();
                // empty check
                if (trimmed == "") {
                  toast.error("Nội dung câu trả lời  không được để trống!");
                  // revert UI
                  e.currentTarget.value = e.currentTarget.defaultValue;
                  return;
                }
                // duplicate check
                if (
                  options.some(
                    (opt) => opt.title !== option.title && opt.title.toLowerCase() === trimmed.toLowerCase()
                  )
                ) {
                  toast.error("Không thể tạo option trùng lặp!");
                  e.currentTarget.value = e.currentTarget.defaultValue;
                  return;
                }
                // valid
                handleLabelChange(option.title, raw);
              }}
              className="
              text-sm font-normal bg-transparent border-none outline-none shadow-none dark:bg-transparent
              cursor-pointer hover:bg-[var(--secondary-foreground)]
              focus:outline-1 focus:cursor-text flex-1 max-w-[40rem] overflow-hidden
            "
            />
          </div>

          {/* Các nút action */}
          <div className="flex items-center gap-2">
            {option.isTrue && (
              <Button disabled variant="link" className="text-green-500">
                <Check />
              </Button>
            )}
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
              onClick={handleCreateOption}
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
