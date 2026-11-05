"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/layout/theme-provider";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  Database,
  Trash2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const datasets = useStore((s) => s.datasets);
  const setDatasets = useStore((s) => s.setDatasets);
  const setInsights = useStore((s) => s.setInsights);
  const setPredictions = useStore((s) => s.setPredictions);
  const setCurrentDataset = useStore((s) => s.setCurrentDataset);

  const [notifications, setNotifications] = useState(true);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [clearing, setClearing] = useState(false);

  const handleClearAll = async () => {
    setClearing(true);
    await new Promise((r) => setTimeout(r, 500));
    setDatasets([]);
    setInsights([]);
    setPredictions([]);
    setCurrentDataset(null);
    setClearing(false);
    toast({ title: "Data cleared", description: "All datasets and insights have been removed.", variant: "success" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your preferences and data</p>
      </div>

      {/* Appearance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" ? "Dark mode" : "Light mode"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4 mr-1" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4 mr-1" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Control notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Get notified about analysis completions</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-Analysis</p>
              <p className="text-xs text-muted-foreground">Automatically analyze data after upload</p>
            </div>
            <Switch checked={autoAnalyze} onCheckedChange={setAutoAnalyze} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass-card border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Manage your stored data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Stored Datasets</p>
              <p className="text-xs text-muted-foreground">
                {datasets.length} dataset{datasets.length !== 1 ? "s" : ""} using{" "}
                {Math.round(datasets.reduce((s, d) => s + JSON.stringify(d).length, 0) / 1024)} KB
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              disabled={clearing || datasets.length === 0}
            >
              {clearing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            About ML Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>ML Engine v1.0.0</p>
            <p>AI-powered business analytics platform</p>
            <p>Built with Next.js, React, Tailwind CSS, and Recharts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
