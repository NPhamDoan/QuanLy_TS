import { useState, useEffect, useCallback } from 'react';
import { getLichSuCapNhat, type LichSuCapNhatItem } from '../../../api/tuyensinh.api';
import { getErrorMessage } from '../../../utils/formatters';

export function useUpdateHistory(maHoSo: string): {
  history: LichSuCapNhatItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [history, setHistory] = useState<LichSuCapNhatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLichSuCapNhat(maHoSo);
      setHistory(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [maHoSo]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
}
