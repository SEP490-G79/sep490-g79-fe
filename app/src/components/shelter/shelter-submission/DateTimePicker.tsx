import * as React from "react";
import { format, isBefore, isAfter, startOfDay } from "date-fns";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  label?: React.ReactNode;
  date: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DateTimePicker({
  label,
  date,
  onChange,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(date);

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hours" | "minutes"
  ) => {
    const newDate = new Date(tempDate);
    if (type === "hours") newDate.setHours(Number(e.target.value));
    else newDate.setMinutes(Number(e.target.value));
    setTempDate(newDate);
    onChange(newDate);
  };

  const handleReset = () => {
    const now = new Date();
    setTempDate(now);
    onChange(now);
  };

  const isDateDisabled = (date: Date) => {
    const day = startOfDay(date);
    if (minDate && isBefore(day, startOfDay(minDate))) return true;
    if (maxDate && isAfter(day, startOfDay(maxDate))) return true;
    return false;
  };

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "dd/MM/yyyy HH:mm")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 space-y-0 ">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={(d) => {
              if (d) {
                const newDate = new Date(d);
                newDate.setHours(tempDate.getHours());
                newDate.setMinutes(tempDate.getMinutes());
                setTempDate(newDate);
                onChange(newDate);
              }
            }}
            disabled={isDateDisabled}
            initialFocus
          />
          <div className="flex items-center gap-4 border-t pt-2 ml-4">
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground">Giờ</label>
              <input
                type="number"
                min={0}
                max={23}
                value={tempDate.getHours()}
                onChange={(e) => handleTimeChange(e, "hours")}
                className="w-16 p-1 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground">Phút</label>
              <input
                type="number"
                min={0}
                max={59}
                value={tempDate.getMinutes()}
                onChange={(e) => handleTimeChange(e, "minutes")}
                className="w-16 p-1 border rounded"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="ml-auto"
              title="Đặt lại thời gian"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
