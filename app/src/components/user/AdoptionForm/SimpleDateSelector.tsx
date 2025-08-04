import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import clsx from "clsx";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Ho_Chi_Minh"); // Đặt timezone mặc định

interface Props {
    value: Date | null;
    onChange: (date: Date) => void;
    minDate: Date;
    maxDate: Date;
}

export const SimpleDateSelector = ({ value, onChange, minDate, maxDate }: Props) => {
    const [viewDate, setViewDate] = React.useState(value || new Date());

    // Luôn dùng dayjs.tz để đảm bảo giờ VN
    const startOfMonth = dayjs(viewDate).tz().startOf("month");
    const endOfMonth = dayjs(viewDate).tz().endOf("month");
    const startDay = startOfMonth.startOf("isoWeek");
    const endDay = endOfMonth.endOf("isoWeek");

    const days: Date[] = [];
    let day = startDay.clone();
    while (day.isBefore(endDay) || day.isSame(endDay, "day")) {
        days.push(day.toDate());
        day = day.add(1, "day");
    }

    const isSameDay = (d1: Date, d2: Date) =>
        dayjs(d1).tz().isSame(dayjs(d2).tz(), "day");

    const isDisabled = (date: Date) =>
        dayjs(date).tz().isBefore(dayjs(minDate).tz(), "day") ||
        dayjs(date).tz().isAfter(dayjs(maxDate).tz(), "day");

    const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

    const handleMonthChange = (delta: number) => {
        setViewDate(dayjs(viewDate).tz().add(delta, "month").toDate());
    };

    return (
        <div className="w-full max-w-sm">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="text-center mb-4">
                    <h3 className="font-semibold text-gray-800 text-lg">Chọn thời gian phỏng vấn</h3>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <button onClick={() => handleMonthChange(-1)}>
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-md font-medium text-gray-700">
                        {dayjs(viewDate).tz().format("MMMM YYYY")}
                    </span>
                    <button onClick={() => handleMonthChange(1)}>
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-500 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="p-1">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((d, idx) => {
                        const disabled = isDisabled(d);
                        const selected = isSameDay(d, value || new Date());

                        return (
                            <button
                                key={idx}
                                disabled={disabled}
                                onClick={() => onChange(d)}
                                className={clsx(
                                    "aspect-square text-sm rounded-lg transition-all duration-200",
                                    disabled
                                        ? "text-gray-300 cursor-not-allowed bg-transparent border-none"
                                        : selected
                                            ? "bg-blue-600 text-white shadow-lg scale-110 dark:shadow-none"
                                            : "bg-white hover:bg-blue-100 border border-blue-200 hover:border-blue-400 dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                                )}
                            >
                                {d.getDate()}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
