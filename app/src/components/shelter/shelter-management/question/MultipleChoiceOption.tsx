import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, CornerDownLeft } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
  isTrue: boolean;
}

export default function MultipleChoiceOption() {
  const [options, setOptions] = React.useState<Option[]>([
    { value: "1", label: "Option 1", isTrue: false },
    { value: "2", label: "Option 2", isTrue: false },
    { value: "3", label: "Option 3", isTrue: false },
    { value: "4", label: "Option 4", isTrue: false },
  ]);

  // Toggle đáp án đúng (isTrue) cho multi-choice
  const handleTrueToggle = (value: string) => {
    setOptions((opts) =>
      opts.map((opt) =>
        opt.value === value ? { ...opt, isTrue: !opt.isTrue } : opt
      )
    );
  };

  // Xóa option
  const handleDelete = (valueToDelete: string) => {
    setOptions((opts) => opts.filter((opt) => opt.value !== valueToDelete));
  };

  // Đổi label + kiểm tra trùng
  const handleLabelChange = (value: string, newLabel: string) => {
    const trimmed = newLabel.trim();
    const duplicate = options.some(
      (opt) =>
        opt.value !== value &&
        opt.label.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      toast.error("Không thể tạo option trùng lặp!");
      return;
    }
    setOptions((opts) =>
      opts.map((opt) =>
        opt.value === value ? { ...opt, label: trimmed } : opt
      )
    );
  };

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div
          key={option.value}
          className={`
            flex items-center gap-4 px-2 py-1 rounded-sm border transition-all duration-200
            ${option.isTrue ? "border-4 border-green-500" : ""}
          `}
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Checkbox để đánh dấu đúng */}
            <Checkbox
              id={option.value}
              checked={option.isTrue}
              onCheckedChange={() => handleTrueToggle(option.value)}
              className="cursor-pointer"
            />

            {/* Label có thể edit */}
            <Input
              type="text"
              defaultValue={option.label}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              onBlur={(e) =>
                handleLabelChange(option.value, e.currentTarget.value)
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
            <Button
              variant="link"
              size="icon"
              onClick={() => handleDelete(option.value)}
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
