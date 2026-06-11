import { useState, useEffect, useCallback } from 'react';
import { layDanhSachHoSo } from '../../../api/tuyensinh.api';
import type { HoSoFilter } from '../../../api/tuyensinh.api';
import { getErrorMessage } from '../../../utils/formatters';
import type { HoSoTuyenSinh } from '../types';

export function useHoSoList(initialFilters?: HoSoFilter): {
  data: HoSoTuyenSinh[];
  loading: boolean;
  error: string | null;
  filters: HoSoFilter;
  setFilters: (f: HoSoFilter) => void;
  refetch: () => void;
} {
  const [data, setData] = useState<HoSoTuyenSinh[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HoSoFilter>(initialFilters ?? {});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await layDanhSachHoSo(filters);
      setData(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, filters, setFilters, refetch: fetchData };
}
