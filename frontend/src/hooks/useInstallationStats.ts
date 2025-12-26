import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Installation } from '../types/installation';

interface InstallationStats {
  installations: Installation[];
  count: number;
  period: {
    start: string;
    end: string;
    type: string;
  };
}

export function useInstallationStats(date: Date, type: 'daily' | 'weekly' | 'monthly') {
  const [data, setData] = useState<InstallationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/installations/stats', {
          params: {
            date: date.toISOString(),
            type
          }
        });
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch installation stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [date, type]);

  return { data, isLoading, error };
}