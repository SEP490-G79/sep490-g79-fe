"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

export function SectionCard({
  icon,
  title,
  number,
  changePercentage,
  isHigher,
  iconColor = "--color-primary", // mặc định màu chính
}: {
  icon: React.ReactNode;
  title: string;
  number: number | string;
  changePercentage?: string;
  isHigher?: boolean;
  iconColor?: string;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className={`text-(--${iconColor})`}>{icon}</div>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold">{number}</div>
        {changePercentage && (
          <div
            className={`flex items-center text-sm ${
              isHigher ? "text-green-600" : "text-red-600"
            }`}
          >
            {isHigher ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {changePercentage}
          </div>
        )}
      </div>
    </div>
  );
}
