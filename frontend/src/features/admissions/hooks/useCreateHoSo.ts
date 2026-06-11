import { useState, useCallback } from 'react';
import {
  taoSinhVien,
  taoHoSo,
  type SinhVienPayload,
  type HoSoPayload,
} from '../../../api/tuyensinh.api';
import { getErrorMessage } from '../../../utils/formatters';

export function useCreateHoSo(): {
  submit: (
    sinhVien: SinhVienPayload,
    hoSo: Omit<HoSoPayload, 'maSinhVien'>
  ) => Promise<string>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (
      sinhVien: SinhVienPayload,
      hoSo: Omit<HoSoPayload, 'maSinhVien'>
    ): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Tạo sinh viên
        const svRes = await taoSinhVien(sinhVien);
        const maSinhVien: string = svRes.data.maSinhVien;

        // Step 2: Tạo hồ sơ với maSinhVien từ bước 1
        const hsRes = await taoHoSo({ ...hoSo, maSinhVien });
        const maHoSo: string = hsRes.data.maHoSo;

        return maHoSo;
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { submit, loading, error };
}
