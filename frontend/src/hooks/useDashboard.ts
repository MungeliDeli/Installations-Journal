import { useQuery } from '@tanstack/react-query';
import { dashboardApi, type DashboardData } from '../services/dashboardApi';

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};