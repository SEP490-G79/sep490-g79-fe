import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdoptionSubmissionsByWeek } from "@/apis/shelter.api";
import { toast } from "sonner";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  forms: {
    label: "Mẫu đơn nhận nuôi",
    color: "var(--chart-1)",
  },
} as const;

export function ChartBarMultiple() {
  const { shelterId } = useParams();
  const [chartData, setChartData] = useState<{ week: string; forms: number }[]>(
    []
  );

  useEffect(() => {
    if (!shelterId) return;

    getAdoptionSubmissionsByWeek(shelterId)
      .then((data) => {
        const formatted = data.map((item: { week: string; count: number }) => ({
          week: item.week,
          forms: item.count,
        }));
        setChartData(formatted);
      })
      .catch(() => {
        toast.error("Không thể tải biểu đồ mẫu đơn nhận nuôi theo tuần");
      });
  }, [shelterId]);

  const totalForms = chartData.reduce((sum, item) => sum + item.forms, 0);

  return (
    <Card className="h-full w-full shadow-xl border-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">
          Biểu đồ mẫu đơn nhận nuôi
        </CardTitle>
        <CardDescription>Trong 4 tuần gần nhất</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barSize={36} barGap={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                style={{ fontSize: 14 }}
                stroke="currentColor"
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.95}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.6}
                  />
                </linearGradient>
              </defs>
              <Bar
                dataKey="forms"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                minPointSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
        <div className="flex gap-2 leading-none font-semibold">
          Cập nhật 4 tuần gần nhất <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Tổng số đơn:{" "}
          <span className="font-semibold text-foreground">{totalForms}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
