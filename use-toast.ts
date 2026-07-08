import { DataColumn, Dataset, DataSummary } from '@/types';
import { detectColumnType, cleanValue, generateId } from './utils';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function parseFile(file: File): Promise<Record<string, any>[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'csv':
    case 'txt':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
}

function parseCSV(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error('Failed to parse CSV: ' + results.errors[0].message));
        } else {
          resolve(results.data as Record<string, any>[]);
        }
      },
      error: (error) => reject(error),
    });
  });
}

function parseExcel(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData as Record<string, any>[]);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

function parseJSON(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          resolve(data);
        } else if (typeof data === 'object' && data !== null) {
          const values = Object.values(data);
          if (values.length > 0 && Array.isArray(values[0])) {
            resolve(values[0] as Record<string, any>[]);
          } else {
            resolve([data] as Record<string, any>[]);
          }
        } else {
          reject(new Error('JSON must contain an array of objects'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

export function analyzeColumns(data: Record<string, any>[]): DataColumn[] {
  if (data.length === 0) return [];
  
  const columns: DataColumn[] = [];
  const keys = Object.keys(data[0]);
  
  for (const key of keys) {
    const values = data.map(row => row[key]);
    const type = detectColumnType(values);
    const nullable = values.some(v => v === null || v === undefined || v === '');
    const sample = values.filter((v, i, arr) => v !== null && v !== undefined && arr.indexOf(v) === i).slice(0, 5);
    
    columns.push({ name: key, type, nullable, sample });
  }
  
  return columns;
}

export function cleanData(data: Record<string, any>[], columns: DataColumn[]): Record<string, any>[] {
  return data.map(row => {
    const cleaned: Record<string, any> = {};
    for (const col of columns) {
      cleaned[col.name] = cleanValue(row[col.name], col.type);
    }
    return cleaned;
  });
}

export function generateSummary(data: Record<string, any>[], columns: DataColumn[]): DataSummary {
  const totalRows = data.length;
  const totalColumns = columns.length;
  const numericColumns = columns.filter(c => c.type === 'number').length;
  const dateColumns = columns.filter(c => c.type === 'date').length;
  const categoricalColumns = columns.filter(c => c.type === 'string').length;
  
  let missingValues = 0;
  const totalCells = totalRows * totalColumns;
  
  for (const row of data) {
    for (const col of columns) {
      if (row[col.name] === null || row[col.name] === undefined || row[col.name] === '') {
        missingValues++;
      }
    }
  }
  
  return {
    totalRows,
    totalColumns,
    numericColumns,
    dateColumns,
    categoricalColumns,
    missingValues,
    completeness: totalCells > 0 ? ((totalCells - missingValues) / totalCells) * 100 : 100,
  };
}

export function createDataset(name: string, data: Record<string, any>[], description?: string): Omit<Dataset, 'id' | 'userId' | 'createdAt' | 'updatedAt'> {
  const columns = analyzeColumns(data);
  const cleanedData = cleanData(data, columns);
  
  return {
    name,
    description,
    columns,
    data: cleanedData,
    rowCount: cleanedData.length,
  };
}

export function exportToCSV(data: Record<string, any>[]): string {
  return Papa.unparse(data);
}

export function exportToExcel(data: Record<string, any>[]): Uint8Array {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
}
