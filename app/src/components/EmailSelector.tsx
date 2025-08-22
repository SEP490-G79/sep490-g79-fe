import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CircleX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface EmailMultiSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
  label?: string;
  suggestions: {
    email: string,
    avatar: string
  }[];
  placeholder?: string;
}

export function EmailSelector({
  value,
  onChange,
  label,
  suggestions,
  placeholder = "Chọn email...",
}: EmailMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const toggleEmail = (email: string) => {
    if (value.includes(email)) {
      onChange(value.filter((e) => e !== email));
    } else {
      onChange([...value, email]);
    }
  };

  const filteredSuggestions = useMemo(() => {
  const result = suggestions.filter(s =>
    s.email.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  return result.slice(0, 5); // đổi số tuỳ ý
  }, [suggestions, searchKeyword]);

  return (
    <FormItem className="w-[30vw]">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              onClick={() => setOpen(!open)}
              className="w-full min-h-[2.5rem] border rounded-md px-3 py-2 flex flex-wrap items-start gap-2 cursor-text"
            >
              {value.length === 0 ? (
                <span className="text-muted-foreground text-sm font-semibold">{placeholder}</span>
              ) : (
                value.map((email) => (
                  <Badge
                    key={email}
                    variant="default"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleEmail(email);
                    }}
                  >
                    {email} <CircleX />
                  </Badge>
                ))
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[30vw] p-2 space-y-2">
            <Input
              placeholder="Tìm email..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="h-8"
            />

            <div className="max-h-52 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion.email}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-accent cursor-pointer rounded-sm"
                  onClick={() => toggleEmail(suggestion.email)}
                >
                  <Checkbox checked={value.includes(suggestion.email)} />
                  <span className="flex flex-row gap-2">
                    <Avatar className="ring ring-2 ring-primary">
                      <AvatarImage src={suggestion.avatar} alt={suggestion.email+ " avatar"}/>
                      <AvatarFallback>{suggestion.email && suggestion.email[0]}</AvatarFallback>
                    </Avatar>
                    <span className="my-auto">{suggestion.email}</span>
                    </span>
                </div>
              ))}
              {filteredSuggestions.length === 0 && (
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
