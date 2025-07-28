import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import clsx from "clsx";

interface Props {
    value: Date | null;
    onChange: (date: Date) => void;
    minDate: Date;
    maxDate: Date;
}

export const SimpleDateSelector = ({ value, onChange, minDate, maxDate }: Props) => {
    const [viewDate, setViewDate] = React.useState(value || new Date());

    const startOfMonth = dayjs(viewDate).startOf("month");
    const endOfMonth = dayjs(viewDate).endOf("month");
    const startDay = startOfMonth.startOf("week");
    const endDay = endOfMonth.endOf("week");

    const days: Date[] = [];
    let day = startDay;
    while (day.isBefore(endDay)) {
        days.push(day.toDate());
        day = day.add(1, "day");
    }

    const isSameDay = (d1: Date, d2: Date) => dayjs(d1).isSame(dayjs(d2), "day");
    const isDisabled = (date: Date) => dayjs(date).isBefore(dayjs(minDate), "day") || dayjs(date).isAfter(dayjs(maxDate), "day");

    const handleMonthChange = (delta: number) => {
        setViewDate(dayjs(viewDate).add(delta, "month").toDate());
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
                        {dayjs(viewDate).format("MMMM YYYY")}
                    </span>
                    <button onClick={() => handleMonthChange(1)}>
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-500 mb-2">
                    {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
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
                                        ? "text-gray-300 cursor-not-allowed"
                                        : selected
                                            ? "bg-blue-600 text-white shadow-lg scale-110"
                                            : "bg-white hover:bg-blue-100 border border-blue-200 hover:border-blue-400"
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
