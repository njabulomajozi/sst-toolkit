import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "~/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

interface ICategoryBreakdownChartProps {
  title: string;
  description: string;
  data: Array<{ category: string; count: number }>;
  config: Record<string, { label: string; color: string }>;
  colors: string[];
  tooltipFormatter: (value: number) => string;
  className?: string;
}

const pieLabelFormatter = ({ percent, category }: { category: string; percent: number }) => {
  if (percent < 0.05) return "";
  const shortCategory = category.includes(" > ")
    ? category.split(" > ")[1]
    : category;
  return `${shortCategory}: ${(percent * 100).toFixed(0)}%`;
};

export const CategoryBreakdownChart = memo(function CategoryBreakdownChart({
  title,
  description,
  data,
  config,
  colors,
  tooltipFormatter,
  className = "",
}: ICategoryBreakdownChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={30}
              label={pieLabelFormatter}
              labelLine={false}
              className="text-xs font-medium"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index]}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [tooltipFormatter(value as number), name]}
                  labelFormatter={(label) => (
                    <span className="font-semibold">{label}</span>
                  )}
                />
              }
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  className="flex-wrap justify-center gap-4"
                  nameKey="category"
                />
              }
              verticalAlign="bottom"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});

