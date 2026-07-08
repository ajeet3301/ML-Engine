"use client";

import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig = {
  trend: { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30", label: "Trend" },
  anomaly: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30", label: "Anomaly" },
  prediction: { icon: Brain, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/30", label: "Prediction" },
  recommendation: { icon: Lightbulb, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30", label: "Recommendation" },
  correlation: { icon: BarChart3, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/30", label: "Correlation" },
};

interface AIInsightsPanelProps {
  limit?: number;
}

export function AIInsightsPanel({ limit }: AIInsightsPanelProps) {
  const insights = useStore((s) => s.insights);
  const datasets = useStore((s) => s.datasets);

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Brain className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          {datasets.length > 0
            ? "Run AI analysis to generate insights"
            : "Upload data first to get AI insights"}
        </p>
      </div>
    );
  }

  const displayInsights = limit ? insights.slice(0, limit) : insights;

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {displayInsights.map((insight) => {
          const config = typeConfig[insight.type] || typeConfig.recommendation;
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className="flex gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
            >
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium truncate">{insight.title}</p>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                    {config.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {insight.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
