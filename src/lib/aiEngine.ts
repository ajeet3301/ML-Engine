import { DataColumn, AIInsight, Prediction, Correlation, AnalysisResult, DataSummary } from '@/types';
import { generateSummary } from './dataProcessor';
import { mean, standardDeviation, sampleCorrelation } from 'simple-statistics';

export function analyzeData(data: Record<string, any>[], columns: DataColumn[]): AnalysisResult {
  const summary = generateSummary(data, columns);
  const insights = generateInsights(data, columns, summary);
  const predictions = generatePredictions(data, columns);
  const correlations = findCorrelations(data, columns);

  return { insights, predictions, correlations, summary };
}

function generateInsights(data: Record<string, any>[], columns: DataColumn[], summary: DataSummary): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date().toISOString();

  // Data quality insights
  if (summary.missingValues > 0) {
    insights.push({
      id: generateInsightId(),
      type: 'anomaly',
      title: 'Missing Data Detected',
      description: `Dataset contains ${summary.missingValues} missing values (${(100 - summary.completeness).toFixed(1)}% incomplete). Consider data cleaning before analysis.`,
      confidence: 0.95,
      category: 'Data Quality',
      createdAt: now,
    });
  }

  // Numeric column insights
  const numericCols = columns.filter(c => c.type === 'number');
  for (const col of numericCols) {
    const values = data.map(r => Number(r[col.name])).filter(v => !isNaN(v));
    if (values.length === 0) continue;

    const colMean = mean(values);
    const stdDev = standardDeviation(values);
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Check for outliers
    const outliers = values.filter(v => Math.abs(v - colMean) > 2.5 * stdDev);
    if (outliers.length > 0) {
      insights.push({
        id: generateInsightId(),
        type: 'anomaly',
        title: `Outliers in ${col.name}`,
        description: `Found ${outliers.length} potential outliers in ${col.name}. Values range from ${formatNum(min)} to ${formatNum(max)} with mean ${formatNum(colMean)}.`,
        confidence: 0.85,
        category: 'Anomaly Detection',
        createdAt: now,
      });
    }

    // Trend for date-related columns
    const dateCol = columns.find(c => c.type === 'date');
    if (dateCol && values.length > 5) {
      const sorted = [...values].sort((a, b) => a - b);
      const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
      const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
      
      if (firstHalf.length > 0 && secondHalf.length > 0) {
        const firstAvg = mean(firstHalf);
        const secondAvg = mean(secondHalf);
        const change = ((secondAvg - firstAvg) / Math.abs(firstAvg)) * 100;
        
        if (Math.abs(change) > 5) {
          insights.push({
            id: generateInsightId(),
            type: 'trend',
            title: `${col.name} ${change > 0 ? 'Increasing' : 'Decreasing'}`,
            description: `${col.name} shows a ${Math.abs(change).toFixed(1)}% ${change > 0 ? 'increase' : 'decrease'} over the recorded period.`,
            confidence: Math.min(0.9, 0.7 + Math.abs(change) / 200),
            category: 'Trend Analysis',
            createdAt: now,
          });
        }
      }
    }
  }

  // Category distribution insights
  const catCols = columns.filter(c => c.type === 'string');
  for (const col of catCols) {
    const distribution = getDistribution(data, col.name);
    const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    
    if (entries.length > 1) {
      const topValue = entries[0];
      const topPercent = (topValue[1] / data.length) * 100;
      
      insights.push({
        id: generateInsightId(),
        type: 'recommendation',
        title: `${col.name} Distribution`,
        description: `"${topValue[0]}" is the most frequent ${col.name} at ${topPercent.toFixed(1)}% of records.`,
        confidence: 0.88,
        category: 'Distribution',
        createdAt: now,
      });
    }
  }

  return insights;
}

function generatePredictions(data: Record<string, any>[], columns: DataColumn[]): Prediction[] {
  const predictions: Prediction[] = [];
  const now = new Date().toISOString();
  const numericCols = columns.filter(c => c.type === 'number');
  const dateCol = columns.find(c => c.type === 'date');

  // Time series predictions
  if (dateCol && numericCols.length > 0) {
    for (const targetCol of numericCols.slice(0, 3)) {
      const values = data
        .map(r => ({ date: new Date(r[dateCol.name]).getTime(), value: Number(r[targetCol.name]) }))
        .filter(r => !isNaN(r.date) && !isNaN(r.value))
        .sort((a, b) => a.date - b.date);

      if (values.length < 5) continue;

      const vals = values.map(v => v.value);
      const trend = linearRegression(vals);
      
      if (trend.slope !== undefined) {
        const lastValue = vals[vals.length - 1];
        const nextValue = lastValue + trend.slope;
        const change = trend.slope / Math.abs(lastValue || 1);
        
        predictions.push({
          id: generateInsightId(),
          type: 'forecast',
          target: targetCol.name,
          value: Math.round(nextValue * 100) / 100,
          confidence: Math.min(0.92, 0.6 + (1 / (1 + Math.abs(trend.r2 - 1))) * 0.3),
          method: 'Linear Regression',
          horizon: 'Next period',
          insight: `${targetCol.name} is projected to ${trend.slope > 0 ? 'increase' : 'decrease'} by ${Math.abs(change * 100).toFixed(1)}% to ${formatNum(nextValue)}.`,
          createdAt: now,
        });
      }
    }
  }

  // Demand prediction from frequency
  const quantityCol = numericCols.find(c => 
    c.name.toLowerCase().includes('quantity') || 
    c.name.toLowerCase().includes('qty') ||
    c.name.toLowerCase().includes('amount') ||
    c.name.toLowerCase().includes('count')
  );

  const productCol = columns.find(c => 
    c.name.toLowerCase().includes('product') ||
    c.name.toLowerCase().includes('item') ||
    c.name.toLowerCase().includes('name')
  );

  if (quantityCol && productCol) {
    const productTotals: Record<string, number> = {};
    for (const row of data) {
      const product = String(row[productCol.name] || 'Unknown');
      const qty = Number(row[quantityCol.name]) || 0;
      productTotals[product] = (productTotals[product] || 0) + qty;
    }

    const sorted = Object.entries(productTotals).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const [topProduct, topQty] = sorted[0];
      
      predictions.push({
        id: generateInsightId(),
        type: 'demand',
        target: topProduct,
        value: Math.round(topQty * 1.1),
        confidence: 0.82,
        method: 'Frequency Analysis',
        horizon: 'Next period',
        insight: `"${topProduct}" is your best-performing item. Demand expected to increase by ~10%. Recommended stock: ${Math.round(topQty * 1.1)} units.`,
        createdAt: now,
      });
    }
  }

  return predictions;
}

function findCorrelations(data: Record<string, any>[], columns: DataColumn[]): Correlation[] {
  const correlations: Correlation[] = [];
  const numericCols = columns.filter(c => c.type === 'number');

  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i];
      const col2 = numericCols[j];

      const pairs = data
        .map(r => [Number(r[col1.name]), Number(r[col2.name])])
        .filter(p => !isNaN(p[0]) && !isNaN(p[1]));

      if (pairs.length < 5) continue;

      const x = pairs.map(p => p[0]);
      const y = pairs.map(p => p[1]);

      try {
        const r = sampleCorrelation(x, y);
        if (!isNaN(r) && Math.abs(r) > 0.3) {
          const strength = Math.abs(r) > 0.7 ? 'strong' : Math.abs(r) > 0.5 ? 'moderate' : 'weak';
          correlations.push({
            column1: col1.name,
            column2: col2.name,
            coefficient: Math.round(r * 1000) / 1000,
            strength,
          });
        }
      } catch {
        // Skip if correlation can't be computed
      }
    }
  }

  return correlations.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));
}

function linearRegression(values: number[]): { slope: number; intercept: number; r2: number } {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = values;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((s, xi, i) => s + xi * y[i], 0);
  const sumX2 = x.reduce((s, xi) => s + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const yMean = sumY / n;
  const ssTotal = y.reduce((s, yi) => s + Math.pow(yi - yMean, 2), 0);
  const ssResidual = y.reduce((s, yi, i) => s + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
  const r2 = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;

  return { slope, intercept, r2 };
}

function getDistribution(data: Record<string, any>[], column: string): Record<string, number> {
  const dist: Record<string, number> = {};
  for (const row of data) {
    const val = String(row[column] || 'Unknown');
    dist[val] = (dist[val] || 0) + 1;
  }
  return dist;
}

function generateInsightId(): string {
  return 'insight_' + Math.random().toString(36).substring(2, 11);
}

function formatNum(n: number): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(2);
}
