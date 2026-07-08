"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Brain,
  BarChart3,
  Download,
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Upload Data",
    description: "Import CSV, Excel, or JSON",
    icon: Upload,
    href: "/dashboard/upload",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "AI Analysis",
    description: "Get AI-powered insights",
    icon: Brain,
    href: "/dashboard/analysis",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    title: "Visualizations",
    description: "Create charts & graphs",
    icon: BarChart3,
    href: "/dashboard/charts",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Export Report",
    description: "Download PDF or Excel",
    icon: Download,
    href: "/dashboard/reports",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
];

export function QuickActions() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex flex-col items-center gap-3 hover:bg-accent transition-colors"
              >
                <div className={`h-10 w-10 rounded-lg ${action.bg} flex items-center justify-center`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
