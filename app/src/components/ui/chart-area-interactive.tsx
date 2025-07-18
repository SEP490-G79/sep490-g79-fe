"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  pets: number;
}

interface ChartAreaInteractiveProps {
  data?: ChartData[];
}

export const ChartAreaInteractive = ({ data }: ChartAreaInteractiveProps) => {
  const defaultData = [
    { name: "Tháng 1", pets: 30 },
    { name: "Tháng 2", pets: 45 },
    { name: "Tháng 3", pets: 60 },
    { name: "Tháng 4", pets: 80 },
    { name: "Tháng 5", pets: 65 },
    { name: "Tháng 6", pets: 90 },
  ];

  const chartData = data || defaultData;

  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="pets"
            stroke="#4F46E5"
            fill="#C7D2FE"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
