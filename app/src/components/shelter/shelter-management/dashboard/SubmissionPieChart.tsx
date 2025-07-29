// components/shelter/shelter-management/dashboard/SubmissionPieChart.tsx

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface SubmissionPieChartProps {
  approved: number;
  rejected: number;
  pending: number;
}

const COLORS = ["#4ade80", "#f87171", "#facc15"];

export const SubmissionPieChart = ({
  approved,
  rejected,
  pending,
}: SubmissionPieChartProps) => {
  const data = [
    { name: "Thành công", value: approved },
    { name: "Từ chối", value: rejected },
    { name: "Đang xử lý", value: pending },
  ];

  const total = approved + rejected + pending;

  const legendItems = [
    {
      name: "Đang xử lý",
      value: pending,
      color: "#facc15",
      percentage: total ? ((pending / total) * 100).toFixed(0) : "0",
    },
    {
      name: "Từ chối",
      value: rejected,
      color: "#f87171",
      percentage: total ? ((rejected / total) * 100).toFixed(0) : "0",
    },
    {
      name: "Thành công",
      value: approved,
      color: "#4ade80",
      percentage: total ? ((approved / total) * 100).toFixed(0) : "0",
    },
  ];

  return (
    <Card className="h-full w-full shadow-xl border-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">
          Tỷ lệ đơn nhận nuôi
        </CardTitle>
        <CardDescription>
          Phân bố số lượng đơn duyệt, từ chối và Đang xử lý
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center h-[360px]">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={false}
                labelLine={true}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} đơn`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom legend with percentage */}
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm" style={{ color: item.color }}>
                {item.name}: {item.value} đơn ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
