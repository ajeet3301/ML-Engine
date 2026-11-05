"use client";

import { useTheme } from "./theme-provider";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Bell, User, LogOut, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const datasets = useStore((s) => s.datasets);
  const currentDataset = useStore((s) => s.currentDataset);

  return (
    <header
      className="fixed top-0 right-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 transition-all duration-300"
      style={{ left: sidebarOpen ? "16rem" : "4rem" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          {currentDataset && (
            <Badge variant="secondary" className="gap-1">
              <Database className="h-3 w-3" />
              {currentDataset.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Dataset count */}
        {datasets.length > 0 && (
          <Badge variant="outline" className="hidden sm:flex">
            {datasets.length} dataset{datasets.length !== 1 ? "s" : ""}
          </Badge>
        )}

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Database className="mr-2 h-4 w-4" />
              My Datasets
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
