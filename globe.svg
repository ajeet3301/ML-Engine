"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { RecentDatasets } from "@/components/dashboard/recent-datasets";
import { AIInsightsPanel } from "@/components/dashboard/ai-insights";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  Database,
  TrendingUp,
  Brain,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const datasets = useStore((s) => s.datasets);
  const insights = useStore((s) => s.insights);
  const predictions = useStore((s) => s.predictions);

  const hasData = datasets.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to ML Engine</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analytics platform for your business data
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Upload Data
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Datasets */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Recent Datasets
              </CardTitle>
              <CardDescription>
                {hasData
                  ? `${datasets.length} dataset${datasets.length !== 1 ? "s" : ""} uploaded`
                  : "No datasets yet. Upload your first dataset to get started."}
              </CardDescription>
            </div>
            <Link href="/dashboard/upload">
              <Button variant="outline" size="sm" className="gap-1">
                Upload
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <RecentDatasets />
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>
              {insights.length > 0
                ? `${insights.length} insight${insights.length !== 1 ? "s" : ""} generated`
                : "Upload data to generate AI insights"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIInsightsPanel limit={5} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Predictions Preview */}
      {predictions.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI Predictions
            </CardTitle>
            <CardDescription>
              ML-powered forecasts based on your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {predictions.slice(0, 3).map((pred) => (
                <Card key={pred.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2">
                      {pred.type}
                    </Badge>
                    <p className="font-medium text-sm">{pred.target}</p>
                    <p className="text-2xl font-bold mt-1">
                      {typeof pred.value === "number"
                        ? pred.value.toLocaleString()
                        : pred.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {pred.insight}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Progress value={pred.confidence * 100} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(pred.confidence * 100)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
