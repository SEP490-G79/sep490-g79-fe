import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { X } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface TagComboboxProps {
    options: string[]
    selected: string[]
    onChange: (value: string[]) => void
    placeholder?: string
     label?: string  
}

export default function TagCombobox({
    label,
    options,
    selected,
    onChange,
    placeholder = "Chọn...",
}: TagComboboxProps) {
    const [open, setOpen] = useState(false)

    const handleSelect = (item: string) => {
        if (selected.includes(item)) {
            onChange(selected.filter((v) => v !== item))
        } else {
            onChange([...selected, item])
        }
    }

    return (
        <div>
            <label className="text-base font-medium text-foreground block mb-1">{label}</label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div
                        onClick={() => setOpen(true)}
                        className="w-full min-h-[40px] flex items-center flex-wrap gap-1 px-3 py-2 border border-input rounded-md bg-background text-sm cursor-text"
                    >
                        {selected.length === 0 && (
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(selected.filter((item) => item !== tag));
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
           
                    <Command>
                        <CommandInput placeholder="Tìm..." />
                        <CommandEmpty>Không có kết quả</CommandEmpty>
                        <div className="max-h-60 overflow-y-auto">
                        <CommandGroup>
                            {options.map((item) => (
                                <CommandItem
                                    key={item}
                                    onSelect={() => handleSelect(item)}
                                >
                                    {selected.includes(item) ? "✔ " : ""}
                                    {item}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        </div>
                        
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
