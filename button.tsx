import { create } from 'zustand';
import { Dataset, AIInsight, Prediction, FilterState } from '@/types';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Datasets
  datasets: Dataset[];
  currentDataset: Dataset | null;
  setDatasets: (datasets: Dataset[]) => void;
  setCurrentDataset: (dataset: Dataset | null) => void;
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;

  // Analysis
  insights: AIInsight[];
  predictions: Prediction[];
  setInsights: (insights: AIInsight[]) => void;
  setPredictions: (predictions: Prediction[]) => void;

  // Filters
  filters: FilterState[];
  setFilters: (filters: FilterState[]) => void;
  addFilter: (filter: FilterState) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useStore = create<AppState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),

  datasets: [],
  currentDataset: null,
  setDatasets: (datasets) => set({ datasets }),
  setCurrentDataset: (dataset) => set({ currentDataset: dataset }),
  addDataset: (dataset) => set((state) => ({ datasets: [...state.datasets, dataset] })),
  removeDataset: (id) => set((state) => ({ datasets: state.datasets.filter((d) => d.id !== id) })),

  insights: [],
  predictions: [],
  setInsights: (insights) => set({ insights }),
  setPredictions: (predictions) => set({ predictions }),

  filters: [],
  setFilters: (filters) => set({ filters }),
  addFilter: (filter) => set((state) => ({ filters: [...state.filters, filter] })),
  removeFilter: (index) => set((state) => ({ filters: state.filters.filter((_, i) => i !== index) })),
  clearFilters: () => set({ filters: [] }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
