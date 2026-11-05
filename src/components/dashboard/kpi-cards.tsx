"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  TrendingUp,
  Brain,
  AlertTriangle,
  FileCheck,
  Activity,
} from "lucide-react";

export function KPICards() {
  const datasets = useStore((s) => s.datasets);
  const insights = useStore((s) => s.insights);
  const predictions = useStore((s) => s.predictions);

  const totalRows = datasets.reduce((sum, d) => sum + d.rowCount, 0);
  const totalColumns = datasets.reduce(
    (sum, d) => sum + d.columns.length,
    0
  );
  const anomalies = insights.filter((i) => i.type === "anomaly").length;
  const trends = insights.filter((i) => i.type === "trend").length;

  const kpis = [
    {
      title: "Total Datasets",
      value: datasets.length,
      description: "Uploaded datasets",
      icon: Database,
      trend: "+12%",
      trendUp: true,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Total Rows",
      value: totalRows.toLocaleString(),
      description: "Data points analyzed",
      icon: FileCheck,
      trend: "+8%",
      trendUp: true,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "AI Insights",
      value: insights.length,
      description: `${trends} trends, ${anomalies} anomalies`,
      icon: Brain,
      trend: "+24%",
      trendUp: true,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      title: "Predictions",
      value: predictions.length,
      description: "ML forecasts generated",
      icon: TrendingUp,
      trend: "+15%",
      trendUp: true,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="glass-card overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <Badge
                variant={kpi.trendUp ? "success" : "destructive"}
                className="text-xs"
              >
                {kpi.trend}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {kpi.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
