"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useTheme } from "./theme-provider";
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Data", icon: Upload },
  { href: "/dashboard/analysis", label: "AI Analysis", icon: Brain },
  { href: "/dashboard/charts", label: "Charts", icon: BarChart3 },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const setSidebarOpen = useStore((s) => s.setSidebarOpen);
  const { theme } = useTheme();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className={cn("overflow-hidden transition-all", sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0")}>
          <h1 className="text-lg font-bold text-gradient whitespace-nowrap">ML Engine</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 shrink-0"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                  <span className={cn("overflow-hidden transition-all whitespace-nowrap", sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0")}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom section */}
      <div className="border-t p-4">
        <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">ME</span>
          </div>
          <div className={cn("overflow-hidden transition-all", sidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0")}>
            <p className="text-sm font-medium truncate">ML Engine</p>
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
