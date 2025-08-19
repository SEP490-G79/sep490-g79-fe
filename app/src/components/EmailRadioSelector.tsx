import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";
import { CircleX } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // nếu dùng Tailwind + shadcn

interface EmailRadioSelectProps {
  value: string | null;
  onChange: (val: string | null) => void;
  label?: string;
  suggestions: {
    name: string;
    email: string;
    avatar: string;
  }[];
  placeholder?: string;
}

export function EmailRadioSelector({
  value,
  onChange,
  label,
  suggestions,
  placeholder = "Chọn trạm cứu hộ...",
}: EmailRadioSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredSuggestions = useMemo(() => {
    return suggestions
      .slice(0, 5)
      .filter((sug) =>
        sug.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        sug.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
  }, [suggestions, searchKeyword]);

  const handleSelect = (email: string) => {
    if (value === email) {
      onChange(null); // bỏ chọn nếu nhấn lại
    } else {
      onChange(email);
      setOpen(false);
    }
  };

  return (
    <FormItem className="w-full">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              onClick={() => setOpen(!open)}
              className="w-full min-h-[2.5rem] border rounded-md px-3 py-2 flex flex-wrap items-center gap-2 cursor-text"
            >
              {!value ? (
                <span className="text-muted-foreground text-sm font-semibold">{placeholder}</span>
              ) : (
                <p
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  {value}
                </p>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[30vw] p-2 space-y-2">
            <Input
              placeholder="Tìm tên hoặc email..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="h-8"
            />

            <div className="max-h-52 overflow-y-auto">
              {filteredSuggestions.length > 0 ? (
                <RadioGroup value={value || ""} onValueChange={handleSelect}>
                  {filteredSuggestions.map((sug) => (
                    <label
                      key={sug.email}
                      htmlFor={sug.email}
                      className={cn(
                        "flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer rounded-sm"
                      )}
                    >
                      <RadioGroupItem value={sug.email} id={sug.email} />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={sug.avatar} alt={sug.email + " avatar"} />
                      </Avatar>
                      <span>{sug.name} ({sug.email})</span>
                    </label>
                  ))}
                </RadioGroup>
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-1">
                  Không có email phù hợp
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
