// Example chart utilities for ChartContainer and Tooltip
import { ResponsiveContainer } from "recharts";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export function ChartContainer({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ChartConfig;
}) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "solid",
}: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm">
      <p className="text-sm font-medium">{label}</p>
      <ul className="mt-2 flex flex-col gap-1">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-2 text-sm">
            <span
              className={`inline-block h-2 w-2 rounded-full border ${
                indicator === "dashed" ? "border-dashed" : ""
              }`}
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="ml-auto font-medium">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const ChartTooltip = (props: any) => <>{props.children}</>;
