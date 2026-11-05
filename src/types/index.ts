export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'unknown';
  nullable: boolean;
  sample: any[];
}

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  columns: DataColumn[];
  data: Record<string, any>[];
  rowCount: number;
  insights?: AIInsight[];
  predictions?: Prediction[];
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation' | 'correlation';
  title: string;
  description: string;
  confidence: number;
  category: string;
  createdAt: string;
}

export interface Prediction {
  id: string;
  type: string;
  target: string;
  value: number | number[];
  confidence: number;
  method: string;
  horizon?: string;
  insight: string;
  createdAt: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'treemap' | 'histogram' | 'forecast';
  xAxis: string;
  yAxis: string;
  groupBy?: string;
  title: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'kpi' | 'table' | 'insights';
  title: string;
  config: ChartConfig | KPIConfig | TableConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface KPIConfig {
  metric: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  format: 'number' | 'currency' | 'percentage';
  prefix?: string;
  suffix?: string;
}

export interface TableConfig {
  columns: string[];
  pageSize: number;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'png';
  includeCharts: boolean;
  includeInsights: boolean;
  dateRange?: { from: Date; to: Date };
}

export interface UploadResult {
  success: boolean;
  dataset?: Dataset;
  errors?: string[];
  warnings?: string[];
}

export interface AnalysisResult {
  insights: AIInsight[];
  predictions: Prediction[];
  correlations: Correlation[];
  summary: DataSummary;
}

export interface Correlation {
  column1: string;
  column2: string;
  coefficient: number;
  strength: 'weak' | 'moderate' | 'strong';
}

export interface DataSummary {
  totalRows: number;
  totalColumns: number;
  numericColumns: number;
  dateColumns: number;
  categoricalColumns: number;
  missingValues: number;
  completeness: number;
}

export interface FilterState {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}
