import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, CornerDownLeft, Check } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
  isTrue: boolean;
}

export default function SingleChoiceOption() {
  const [selectedValue, setSelectedValue] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([
    { value: "1", label: "Option 1", isTrue: false },
    { value: "2", label: "Option 2", isTrue: false },
    { value: "3", label: "Option 3", isTrue: false },
    { value: "4", label: "Option 4", isTrue: false },
  ]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    setOptions((opts) =>
      opts.map((opt) => ({
        ...opt,
        isTrue: opt.value === value,
      }))
    );
  };

  const handleDelete = (valueToDelete: string) => {
    setOptions((opts) => opts.filter((opt) => opt.value !== valueToDelete));
    if (selectedValue === valueToDelete) {
      handleValueChange("");
    }
  };

  const handleLabelChange = (value: string, newLabel: string) => {
    const trimmed = newLabel.trim();
    const duplicate = options.some(
      (opt) =>
        opt.value !== value &&
        opt.label.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      // Bạn có thể thay alert bằng toast hoặc inline error message
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
    <RadioGroup
      value={selectedValue}
      onValueChange={handleValueChange}
      className="space-y-2"
    >
      {options.map((option) => (
        <div
          key={option.value}
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
              value={option.value}
              id={option.value}
              className="cursor-pointer"
            />
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

          {/* Actions */}
          <div className="flex items-center gap-2">
            {option.isTrue && (<Button disabled variant="link" className="text-green-500"><Check/></Button>)}

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
                /* Ví dụ: undo hoặc duplicate nếu cần */
              }}
            >
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
