"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

export function SectionCard({
  icon,
  title,
  number,
  changePercentage,
  isHigher,
}: {
  icon: React.ReactNode;
  title: string;
  number: number | string;
  changePercentage: string;
  isHigher: boolean;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{number}</div>
        <div
          className={`flex items-center text-sm ${
            isHigher ? "text-green-600" : "text-red-600"
          }`}
        >
          {isHigher ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          {changePercentage}
        </div>
      </div>
    </div>
  );
}
