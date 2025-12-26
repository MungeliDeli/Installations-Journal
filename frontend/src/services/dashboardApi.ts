import { api } from './api';

export interface DashboardStats {
  allTime: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  averages: {
    rsrp: number;
    speed: number;
  };
}

export interface ChartDataPoint {
  date?: string;
  week?: string;
  month?: string;
  count: number;
  label?: string;
  startDate?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  chartData: {
    daily: ChartDataPoint[];
    weekly: ChartDataPoint[];
    monthly: ChartDataPoint[];
  };
}

export const dashboardApi = {
  getDashboardStats: async (): Promise<DashboardData> => {
    const response = await api.get('/installations/dashboard');
    return response.data;
  },
};