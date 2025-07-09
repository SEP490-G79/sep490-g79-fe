import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Option, Question } from "@/types/Question";
import { Trash2, CornerDownLeft, Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  question: Question;
  setSelectedQuestion: React.Dispatch<React.SetStateAction<Question>>;
};
export default function SingleChoiceOption({
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

  const [selectedValue, setSelectedValue] = useState(
    options.find((o) => o.isTrue)?.title || ""
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
      type: "SINGLECHOICE",
      options: updatedOptions,
    });
  };

  // delete option
  const handleDelete = (valueToDelete: string) => {
    const updatedOptions = options.filter((opt) => opt.title !== valueToDelete);

    const newSelected = selectedValue == valueToDelete ? "" : selectedValue;

    setOptions(updatedOptions);
    setSelectedValue(newSelected);

    // Update selected question
    setSelectedQuestion({
      ...question,
      type: "SINGLECHOICE",
      options: updatedOptions.map((opt) => ({
        title: opt.title,
        isTrue: opt.title == newSelected,
      })),
    });
  };

  // select option
  const handleValueChange = (value: string) => {
    const updatedOptions = options.map((opt) => ({
      ...opt,
      isTrue: opt.title == value,
    }));
    setOptions(updatedOptions);
    setSelectedValue(value);

    // Update selected question
    setSelectedQuestion({
      ...question,
      type: "SINGLECHOICE",
      options: updatedOptions,
    });
  };

  // update title
  const handleLabelChange = (oldTitle: string, newRaw: string) => {
    const newTitleTrim = newRaw.trim();
    if (newTitleTrim.length == 0) {
      toast.error("Nội dung câu trả lời  không được để trống!");
      // revert state
      setOptions((prev) =>
        prev.map((opt) =>
          opt.title == oldTitle ? { ...opt, title: oldTitle } : opt
        )
      );
      return;
    }
    if (
      options.some(
        (opt) =>
          opt.title !== oldTitle &&
          opt.title.toLowerCase() === newTitleTrim.toLowerCase()
      )
    ) {
      toast.error("Không thể tạo option trùng lặp!");
      // revert state
      setOptions((prev) =>
        prev.map((opt) =>
          opt.title === oldTitle ? { ...opt, title: oldTitle } : opt
        )
      );
      return;
    }
    const updatedOptions = options.map((opt) =>
      opt.title === oldTitle ? { ...opt, title: newTitleTrim } : opt
    );
    setOptions(updatedOptions);
    if (selectedValue === oldTitle) setSelectedValue(newTitleTrim);
    setSelectedQuestion({
      ...question,
      type: "SINGLECHOICE",
      options: updatedOptions,
    });
  };

  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={handleValueChange}
      className="space-y-2"
    >
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
          {/* Radio + Label */}
          <div className="flex items-center gap-4 flex-1">
            <RadioGroupItem
              value={option.title}
              id={option.title}
              className="cursor-pointer"
            />
            <Input
              type="text"
              defaultValue={option.title}
              autoFocus={option.title == ""}
              placeholder="Nhập câu trả lời"
              onFocus={(e) => e.currentTarget.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              onBlur={(e) => {
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

          {/* Actions */}
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
    </RadioGroup>
  );
}
