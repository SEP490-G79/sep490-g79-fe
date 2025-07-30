"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyAdoptionStat {
  week: string;
  count: number;
}

interface AdoptionLineChartProps {
  data: WeeklyAdoptionStat[];
}

export const AdoptionLineChart = ({ data }: AdoptionLineChartProps) => {
  return (
    <Card className="shadow-xl border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-green-600">
          Biểu đồ số lượt nhận nuôi theo tuần
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Dữ liệu 10 tuần gần nhất
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="week"
              angle={-25}
              textAnchor="end"
              interval={0}
              tickMargin={10}
              style={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              allowDecimals={false}
              style={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "white", borderRadius: 8 }}
              labelStyle={{ fontWeight: "bold" }}
              formatter={(value: number) => [`${value} lượt`, "Số lượng"]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#16a34a", strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
