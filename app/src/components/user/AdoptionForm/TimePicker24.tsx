// TimePicker24.tsx
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type Props = {
  value: string;                 // "HH:mm" | ""
  onChange: (v: string) => void;
  min?: string;                  // "HH:mm"
  max?: string;                  // "HH:mm"
  stepMinutes?: number;          // default 30
  /** mốc bắt đầu/kết thúc render danh sách (không ảnh hưởng validate nếu min/max rộng hơn/nhỏ hơn) */
  startAt?: string;              // default "07:00"
  endAt?: string;                // default "23:59"
  className?: string;
  buttonClassName?: string;
  placeholder?: string;          // default "Chọn giờ"
  disabled?: boolean;
  showQuickActions?: boolean;    // default true
};

const toMins = (s?: string) => {
  if (!s) return undefined;
  const [h, m] = s.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return undefined;
  return h * 60 + m;
};
const toHHMM = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
const searchKey = (hhmm: string) => hhmm.replace(":", "");

export const TimePicker24: React.FC<Props> = ({
  value,
  onChange,
  min,
  max,
  stepMinutes = 30,         
  startAt = "07:00",         
  endAt = "22:00",           
  className,
  buttonClassName,
  placeholder = "Chọn giờ",
  disabled,
  showQuickActions = true,
}) => {
  const [open, setOpen] = React.useState(false);
  const now = React.useMemo(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }, []);

  // Giới hạn validate (min/max)
  const rawMin = toMins(min);
  const rawMax = toMins(max);
  const minM = rawMin ?? 0;
  let maxM = rawMax ?? 23 * 60 + 59;
  if (rawMin !== undefined && rawMax !== undefined && rawMax <= rawMin) {
    maxM = 23 * 60 + 59; // safeguard
  }

  // Giới hạn hiển thị (startAt/endAt)
  const startM = Math.max(toMins(startAt) ?? 0, 0);
  const endM = Math.min(toMins(endAt) ?? (23 * 60 + 59), 23 * 60 + 59);

  // Danh sách + grouping theo giờ (hiển thị giao giữa [startAt,endAt] và [00:00,23:59])
  const grouped = React.useMemo(() => {
    const from = Math.max(0, startM);
    const to = Math.min(23 * 60 + 59, endM);

  const byHour = new Map<
  string,
  { label: string; value: string; disabled: boolean; alt: string; isNow: boolean }[]
>();


    // Bắt đầu từ mốc rounded theo step
   let t = from - (from % stepMinutes); 
   
    for (; t <= to; t += stepMinutes) {
      const hhmm = toHHMM(t);
      const disabled = t < minM || t > maxM; // disable nếu ngoài min/max
      const hr = hhmm.slice(0, 2);
      const alt = `${hhmm} ${searchKey(hhmm)}`;
      const isNow = searchKey(hhmm).slice(0, 3) === searchKey(now).slice(0, 3);

      if (!byHour.has(hr)) byHour.set(hr, []);
byHour.get(hr)!.push({ label: hhmm, value: hhmm, disabled, alt, isNow });

    }
    return byHour;
  }, [stepMinutes, minM, maxM, startM, endM, now]);

  // Auto scroll tới item đã chọn
  const selectedRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (open && selectedRef.current) {
      const id = setTimeout(() => selectedRef.current?.scrollIntoView({ block: "center" }), 0);
      return () => clearTimeout(id);
    }
  }, [open, value]);

  const handlePick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const selectedLabel = value || "";

  const renderQuick = () => {
    if (!showQuickActions) return null;
    const quicks: { label: string; val: string | null; onClick?: () => void }[] = [
      { label: "Giờ hiện tại", val: now },
      { label: "Đặt lại", val: null, onClick: () => onChange("") },
    ];
    return (
      <div className="sticky bottom-0 border-t bg-background p-2 flex gap-2 flex-wrap">
        {quicks.map((q, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={q.val !== null && (toMins(q.val)! < minM || toMins(q.val)! > maxM)}
            onClick={() => (q.onClick ? q.onClick() : q.val !== null && handlePick(q.val))}
          >
            {q.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-between text-left font-normal", !selectedLabel && "text-muted-foreground", buttonClassName)}
            disabled={disabled}
            aria-label="Chọn giờ"
          >
            {selectedLabel || placeholder}
            <svg aria-hidden="true" className="ml-2 h-4 w-4 opacity-60" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/>
            </svg>
          </Button>
        </PopoverTrigger>

        <PopoverContent side="bottom" sideOffset={4} align="start" className="z-50 w-[280px] p-0">
          <Command shouldFilter >
            <CommandInput  placeholder="Tìm giờ (vd: 0930, 09:30)..." className="h-9" />
            <CommandEmpty>Không tìm thấy thời gian phù hợp.</CommandEmpty>

            <CommandList className="max-h-48 overflow-auto">
         {Array.from(grouped.entries()).map(([hour, items]) => (
                <CommandGroup key={hour} heading={`${hour} giờ`}>
                  {items.map((opt) => {
                    const isSelected = value === opt.value;
                    return (
                      <CommandItem
                        key={opt.value}
                        value={`${opt.value} ${opt.alt}`}
                        disabled={opt.disabled}
                        onSelect={() => !opt.disabled && handlePick(opt.value)}
                      >
                        <div
                          ref={isSelected ? selectedRef : undefined}
                          className={cn("flex w-full items-center justify-between", opt.disabled && "opacity-50")}
                          title={opt.disabled ? "Ngoài khoảng cho phép" : ""}
                        >
                          <span className={cn("tabular-nums", opt.isNow && "font-semibold")}>
                            {opt.label}
                            {opt.isNow && <span className="ml-2 text-xs opacity-70">(hiện tại)</span>}
                          </span>
                          {isSelected && (
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3-3a1 1 0 011.415-1.415l2.293 2.293 6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
            </CommandList>

            {renderQuick()}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
