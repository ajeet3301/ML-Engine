"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Database,
  LineChart,
  PieChart,
  Sparkles,
  ArrowRight,
  Check,
  Upload,
  Lock,
} from "lucide-react";
import { ThemeProvider, useTheme } from "@/components/layout/theme-provider";

export default function LandingPage() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  );
}

function LandingContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">ML Engine</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
                {theme === "light" ? <Brain className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
              </Button>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-60" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            <Badge variant="outline" className="px-4 py-1.5 text-sm glass">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
              AI-Powered Business Analytics
            </Badge>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              Turn Data into{" "}
              <span className="text-gradient">Decisions</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload any business dataset. Our AI automatically analyzes it, predicts trends, and delivers actionable insights through beautiful dashboards.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Start for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                  Try Demo
                  <Zap className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground mt-2">Complete analytics platform powered by AI</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} icon={f.icon} title={f.title} description={f.description} color={f.color} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">From data to insights in minutes</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Import Any Data</h2>
            <p className="text-muted-foreground mt-2">Support for all major data formats</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {formats.map((f) => (
              <Badge key={f} variant="outline" className="text-lg px-6 py-3 glass">
                {f}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 glass-card rounded-2xl p-12">
          <h2 className="text-4xl font-bold">Ready to Analyze?</h2>
          <p className="text-xl text-muted-foreground">
            Start using ML Engine today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 text-lg px-8">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                Try Guest Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold">ML Engine</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered business analytics. Built with Next.js & React.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Card({ icon: Icon, title, description, color }: { icon: any; title: string; description: string; color: string }) {
  return (
    <div className="glass-card p-6 space-y-4 hover:scale-[1.02] transition-transform">
      <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

const features = [
  { icon: Upload, title: "Easy Import", description: "Upload CSV, Excel, JSON or paste data directly. Automatic type detection.", color: "bg-blue-500" },
  { icon: Brain, title: "AI Analysis", description: "Automatic pattern detection, trend analysis, and anomaly detection.", color: "bg-violet-500" },
  { icon: TrendingUp, title: "Predictions", description: "ML-powered forecasts for sales, demand, revenue, and more.", color: "bg-green-500" },
  { icon: BarChart3, title: "Visualizations", description: "Interactive charts: bar, line, pie, area, scatter, and more.", color: "bg-amber-500" },
  { icon: Shield, title: "Secure", description: "Your data stays private. JWT authentication and secure processing.", color: "bg-rose-500" },
  { icon: Zap, title: "Fast", description: "Optimized for speed. Instant insights even with large datasets.", color: "bg-cyan-500" },
];

const steps = [
  { title: "Upload Data", description: "Import your business data in any supported format" },
  { title: "AI Analyzes", description: "Our engine automatically detects patterns and trends" },
  { title: "Get Insights", description: "View predictions and insights on your dashboard" },
];

const formats = ["CSV", "Excel", "JSON", "XML", "TXT", "Google Sheets", "PostgreSQL", "MySQL", "MongoDB", "REST API"];
