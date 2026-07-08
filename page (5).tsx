"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  FileSpreadsheet,
  FileJson,
  FileText,
  Trash2,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function RecentDatasets() {
  const datasets = useStore((s) => s.datasets);
  const removeDataset = useStore((s) => s.removeDataset);
  const setCurrentDataset = useStore((s) => s.setCurrentDataset);
  const { toast } = useToast();

  if (datasets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Database className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No datasets yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Upload your first dataset to start analyzing with AI-powered insights
        </p>
        <Link href="/dashboard/upload" className="mt-4">
          <Button>Upload Data</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    removeDataset(id);
    toast({ title: "Dataset deleted", description: "The dataset has been removed." });
  };

  const handleAnalyze = (dataset: (typeof datasets)[0]) => {
    setCurrentDataset(dataset);
    toast({ title: "Dataset selected", description: `Analyzing ${dataset.name}...` });
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rows</TableHead>
            <TableHead>Columns</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow key={dataset.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <span className="font-medium">{dataset.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  CSV
                </Badge>
              </TableCell>
              <TableCell>{dataset.rowCount.toLocaleString()}</TableCell>
              <TableCell>{dataset.columns.length}</TableCell>
              <TableCell>
                {Math.round(JSON.stringify(dataset.data).length / 1024)} KB
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href="/dashboard/analysis">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleAnalyze(dataset)}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(dataset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
