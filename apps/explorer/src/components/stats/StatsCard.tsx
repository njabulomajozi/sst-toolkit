import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

interface IStatsCardProps {
  title: string;
  value: number;
  description: string;
  className?: string;
}

export const StatsCard = memo(function StatsCard({
  title,
  value,
  description,
  className = "",
}: IStatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value.toLocaleString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
});

