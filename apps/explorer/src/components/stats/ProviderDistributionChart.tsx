import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "~/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

interface IProviderDistributionChartProps {
  title: string;
  description: string;
  data: Array<{ provider: string; count: number }>;
  config: Record<string, { label: string; color: string }>;
  tooltipFormatter: (value: number) => string;
  providerColors: Record<string, string>;
  className?: string;
}

export const ProviderDistributionChart = memo(function ProviderDistributionChart({
  title,
  description,
  data,
  config,
  tooltipFormatter,
  providerColors,
  className = "",
}: IProviderDistributionChartProps) {
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
              nameKey="provider"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={30}
              label={({ percent, provider }) =>
                percent >= 0.05 ? `${provider}: ${(percent * 100).toFixed(0)}%` : ""
              }
              labelLine={false}
              className="text-xs font-medium"
            >
              {data.map(({ provider }, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={providerColors[provider] || providerColors.Other}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [tooltipFormatter(value as number), ""]}
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
                  nameKey="provider"
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

