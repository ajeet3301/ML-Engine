"use client";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useStore((s) => s.sidebarOpen);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Navbar />
        <main
          className={cn(
            "pt-16 transition-all duration-300 min-h-screen",
            sidebarOpen ? "pl-64" : "pl-16"
          )}
        >
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
