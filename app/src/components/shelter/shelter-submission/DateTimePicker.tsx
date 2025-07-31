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

  const isDateDisabled = (date: Date) => {
    const day = startOfDay(date);
    if (minDate && isBefore(day, startOfDay(minDate))) return true;
    if (maxDate && isAfter(day, startOfDay(maxDate))) return true;
    return false;
  };
   const handleReset = () => {
  const now = startOfDay(new Date());
  setTempDate(now);
  onChange(now);
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
            {format(date, "dd/MM/yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 space-y-0">
          <Calendar
            mode="single"
            selected={startOfDay(date)}
            onSelect={(d) => {
              if (d) {
                const newDate = startOfDay(d);
                onChange(newDate);
              }
            }}
            disabled={isDateDisabled}
            initialFocus
          />
           <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="ml-auto"
              title="Đặt lại thời gian"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
