import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, format: 'number' | 'currency' | 'percentage' = 'number'): string {
  if (isNaN(num)) return 'N/A';
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    case 'percentage':
      return `${(num * 100).toFixed(1)}%`;
    default:
      if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
      if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
      if (Math.abs(num) >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
      return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
}

export function detectColumnType(values: any[]): 'string' | 'number' | 'date' | 'boolean' | 'unknown' {
  const nonNull = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNull.length === 0) return 'unknown';

  const allBoolean = nonNull.every(v => 
    typeof v === 'boolean' || ['true', 'false', '0', '1', 'yes', 'no'].includes(String(v).toLowerCase())
  );
  if (allBoolean) return 'boolean';

  const allNumber = nonNull.every(v => !isNaN(Number(v)) && v !== '');
  if (allNumber) return 'number';

  const allDate = nonNull.every(v => {
    const d = new Date(v);
    return d instanceof Date && !isNaN(d.getTime());
  });
  if (allDate) return 'date';

  return 'string';
}

export function cleanValue(value: any, type: string): any {
  if (value === null || value === undefined || value === '') return null;
  
  switch (type) {
    case 'number':
      const n = Number(value);
      return isNaN(n) ? null : n;
    case 'date':
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d.toISOString();
    case 'boolean':
      const s = String(value).toLowerCase();
      if (['true', '1', 'yes'].includes(s)) return true;
      if (['false', '0', 'no'].includes(s)) return false;
      return null;
    default:
      return String(value);
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}
