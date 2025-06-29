"use client";

import * as React from "react";

export function SectionCardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
