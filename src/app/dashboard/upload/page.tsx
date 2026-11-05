"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "@/lib/store";
import { parseFile, createDataset } from "@/lib/dataProcessor";
import { analyzeData } from "@/lib/aiEngine";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  FileJson,
  FileText,
  CheckCircle,
  AlertCircle,
  Database,
  Table,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const addDataset = useStore((s) => s.addDataset);
  const setInsights = useStore((s) => s.setInsights);
  const setPredictions = useStore((s) => s.setPredictions);
  const setCurrentDataset = useStore((s) => s.setCurrentDataset);
  const { toast } = useToast();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [datasetName, setDatasetName] = useState("");
  const [manualData, setManualData] = useState("");
  const [analysisType, setAnalysisType] = useState("auto");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        await processFile(file);
      }
    },
    [datasetName]
  );

  const processFile = async (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      setProgress(20);
      const rawData = await parseFile(file);
      setProgress(50);

      const name = datasetName || file.name.replace(/\.[^/.]+$/, "");
      const datasetData = createDataset(name, rawData, `Uploaded from ${file.name}`);
      setProgress(70);

      const fullDataset = {
        ...datasetData,
        id: `ds_${Date.now()}`,
        userId: "user_1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Run AI analysis
      const result = analyzeData(fullDataset.data, fullDataset.columns);
      fullDataset.insights = result.insights;
      fullDataset.predictions = result.predictions;
      setProgress(90);

      addDataset(fullDataset);
      setCurrentDataset(fullDataset);
      setInsights(result.insights);
      setPredictions(result.predictions);
      setProgress(100);

      toast({
        title: "Upload successful!",
        description: `${fullDataset.rowCount.toLocaleString()} rows imported from ${file.name}`,
        variant: "success",
      });

      toast({
        title: "AI Analysis Complete",
        description: `${result.insights.length} insights and ${result.predictions.length} predictions generated.`,
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setDatasetName("");
    }
  };

  const handleManualEntry = async () => {
    if (!manualData.trim()) {
      toast({ title: "Empty data", description: "Please enter some data", variant: "warning" });
      return;
    }

    setUploading(true);
    try {
      let parsed;
      try {
        parsed = JSON.parse(manualData);
      } catch {
        // Try CSV
        const lines = manualData.trim().split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        parsed = lines.slice(1).map((line) => {
          const values = line.split(",");
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => {
            obj[h] = values[i]?.trim() || "";
          });
          return obj;
        });
      }

      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      const name = datasetName || "Manual Dataset";
      const datasetData = createDataset(name, dataArray);

      const fullDataset = {
        ...datasetData,
        id: `ds_${Date.now()}`,
        userId: "user_1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = analyzeData(fullDataset.data, fullDataset.columns);
      fullDataset.insights = result.insights;
      fullDataset.predictions = result.predictions;

      addDataset(fullDataset);
      setCurrentDataset(fullDataset);
      setInsights(result.insights);
      setPredictions(result.predictions);

      toast({ title: "Data imported!", description: `${fullDataset.rowCount} rows processed.`, variant: "success" });
      setManualData("");
      setDatasetName("");
    } catch (error: any) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "application/json": [".json"],
      "text/plain": [".txt"],
    },
    multiple: true,
    disabled: uploading,
  });

  const supportedFormats = [
    { icon: FileSpreadsheet, label: "CSV", ext: ".csv" },
    { icon: FileSpreadsheet, label: "Excel", ext: ".xlsx" },
    { icon: FileJson, label: "JSON", ext: ".json" },
    { icon: FileText, label: "Text", ext: ".txt" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Data</h1>
        <p className="text-muted-foreground mt-1">
          Import your business data for AI-powered analysis
        </p>
      </div>

      <Tabs defaultValue="file" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          {/* Dataset Name */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Dataset Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Dataset name (optional - defaults to filename)"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="max-w-md"
              />
            </CardContent>
          </Card>

          {/* Dropzone */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/20 hover:border-muted-foreground/40",
                  uploading && "opacity-50 pointer-events-none"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? "Drop files here" : "Drag & drop files here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex gap-3 mt-2">
                    {supportedFormats.map((fmt) => (
                      <Badge key={fmt.label} variant="outline" className="gap-1">
                        <fmt.icon className="h-3 w-3" />
                        {fmt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress */}
              {uploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Processing data...
                    </span>
                    <span className="text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Accepted Files */}
              {acceptedFiles.length > 0 && !uploading && (
                <div className="mt-6 space-y-2">
                  <p className="text-sm font-medium">Selected files:</p>
                  {acceptedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table className="h-5 w-5 text-primary" />
                Manual Data Entry
              </CardTitle>
              <CardDescription>
                Paste CSV data or JSON array
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Dataset name"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
              />
              <textarea
                className="w-full h-64 rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder={`Example CSV format:\nDate,Product,Quantity,Price\n2024-01-01,Widget A,100,29.99\n2024-01-02,Widget B,150,19.99\n2024-01-03,Widget A,120,29.99`}
                value={manualData}
                onChange={(e) => setManualData(e.target.value)}
              />
              <Button
                onClick={handleManualEntry}
                disabled={uploading || !manualData.trim()}
                className="w-full"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Process Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
