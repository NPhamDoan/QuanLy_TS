import { useState, useEffect, useCallback } from 'react';
import { layThongKeHoSo } from '../../../api/tuyensinh.api';
import { getErrorMessage } from '../../../utils/formatters';
import type { DashboardStats } from '../types';

export function useDashboardStats(): {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await layThongKeHoSo();
      setStats(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
