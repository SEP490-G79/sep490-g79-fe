import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, CornerDownLeft } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface Option {
  value: string;
  label: string;
  isTrue: boolean;
}

export default function YesNoOption() {
  const [selectedValue, setSelectedValue] = React.useState("2");
  const [options, setOptions] = React.useState([
    { value: "Yes", label: "Yes", isTrue: false },
    { value: "No", label: "No", isTrue: false },
  ]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    setOptions((opts) =>
      opts.map((opt) => ({
        ...opt,
        isTrue: opt.value == value,
      }))
    );
  };

  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={handleValueChange}
      className="space-y-1"
    >
      {options.map((option) => (
        <div
          key={option.value}
          className={`
            flex items-center gap-4 px-2 py-1 rounded-sm border transition-all duration-200
            ${option.isTrue ? "border-4 border-green-500" : ""}
          `}
        >
          {/* Radio + Label */}
          <div className="flex items-center gap-4 flex-1">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="cursor-pointer"
            />
            <span className="text-sm font-normal">{option.label}</span>
            
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
