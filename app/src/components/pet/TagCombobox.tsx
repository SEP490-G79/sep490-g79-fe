import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Check } from "lucide-react";
import { useMemo, useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TagComboboxProps {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  closeOnSelect?: boolean;      // ⬅ thêm
  clearable?: boolean;          // ⬅ thêm
  maxMenuHeight?: number;       // ⬅ thêm
}

export default function TagCombobox({
  label,
  options,
  selected,
  onChange,
  placeholder = "Chọn...",
  closeOnSelect = false,
  clearable = true,
  maxMenuHeight = 240, // ~max-h-60
}: TagComboboxProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isSelected = useCallback((v: string) => selected.includes(v), [selected]);

  const handleSelect = (item: string) => {
    const next = isSelected(item)
      ? selected.filter((v) => v !== item)
      : [...selected, item];
    onChange(next);
    if (closeOnSelect) setOpen(false);
  };

  const handleRemove = (tag: string) => {
    onChange(selected.filter((v) => v !== tag));
  };

  const handleClearAll = () => onChange([]);

  const hasSelection = selected.length > 0;

  // Backspace để xóa tag cuối khi trigger đang focus
  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !open && hasSelection) {
      e.preventDefault();
      onChange(selected.slice(0, -1));
    }
    if ((e.key === "Enter" || e.key === " ") && !open) {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const renderedOptions = useMemo(() => options, [options]);

  return (
    <div>
      {label && <label className="text-base font-medium text-foreground block mb-1">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={triggerRef}
            role="combobox"
            aria-expanded={open}
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={onTriggerKeyDown}
            className="w-full min-h-[40px] flex items-center flex-wrap gap-1 px-3 py-2 border border-input rounded-md bg-background text-sm cursor-text focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {!hasSelection && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}

            {selected.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 bg-primary text-primary-foreground"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(tag);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </Badge>
            ))}

            {clearable && hasSelection && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto h-6 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Tìm..." />
            <CommandEmpty>Không có kết quả</CommandEmpty>

            <div style={{ maxHeight: maxMenuHeight, overflowY: "auto" }}>
              <CommandGroup>
                {renderedOptions.map((item) => {
                  const active = isSelected(item);
                  return (
                    <CommandItem
                      key={item}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={`h-4 w-4 ${active ? "opacity-100" : "opacity-0"}`}
                      />
                      <span>{item}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
