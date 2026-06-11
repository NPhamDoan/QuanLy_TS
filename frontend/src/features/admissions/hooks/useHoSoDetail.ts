import { useState, useEffect, useCallback } from 'react';
import {
  layHoSoTheoId,
  laySinhVien,
  layTepTheoHoSo,
  capNhatTrangThai,
  xoaTepDinhKem,
} from '../../../api/tuyensinh.api';
import { getErrorMessage } from '../../../utils/formatters';
import type { HoSoTuyenSinh, SinhVien, TepDinhKem } from '../types';

export function useHoSoDetail(maHoSo: string): {
  hoSo: HoSoTuyenSinh | null;
  sinhVien: SinhVien | null;
  tepList: TepDinhKem[];
  loading: boolean;
  error: string | null;
  updateTrangThai: (trangThai: string, ghiChu?: string) => Promise<void>;
  deleteTep: (maTep: string) => Promise<void>;
  refetch: () => void;
} {
  const [hoSo, setHoSo] = useState<HoSoTuyenSinh | null>(null);
  const [sinhVien, setSinhVien] = useState<SinhVien | null>(null);
  const [tepList, setTepList] = useState<TepDinhKem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi song song: lấy hồ sơ + lấy tệp đính kèm
      const [hoSoRes, tepRes] = await Promise.all([
        layHoSoTheoId(maHoSo),
        layTepTheoHoSo(maHoSo),
      ]);

      const hoSoData: HoSoTuyenSinh = hoSoRes.data;
      setHoSo(hoSoData);
      setTepList(tepRes.data);

      // Sau đó lấy thông tin sinh viên từ maSinhVien
      const svRes = await laySinhVien(hoSoData.maSinhVien);
      setSinhVien(svRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [maHoSo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateTrangThai = useCallback(
    async (trangThai: string, ghiChu?: string) => {
      try {
        await capNhatTrangThai(maHoSo, trangThai, ghiChu);
        await fetchData();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [maHoSo, fetchData]
  );

  const deleteTep = useCallback(
    async (maTep: string) => {
      try {
        await xoaTepDinhKem(maTep);
        await fetchData();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [fetchData]
  );

  return {
    hoSo,
    sinhVien,
    tepList,
    loading,
    error,
    updateTrangThai,
    deleteTep,
    refetch: fetchData,
  };
}
