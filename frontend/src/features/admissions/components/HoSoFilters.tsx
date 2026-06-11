import { useState, useEffect } from 'react';
import type { HoSoFilter } from '../../../api/tuyensinh.api';
import type { TrangThaiHoSo } from '../types';
import { layDanhMuc } from '../../../api/admin.api';
import type {
  NamTuyenSinhItem,
  DotTuyenSinhItem,
  NganhDangKyItem,
} from '../../admin/types';

interface HoSoFiltersProps {
  filters: HoSoFilter;
  onFilterChange: (filters: HoSoFilter) => void;
}

const TRANG_THAI_OPTIONS: { value: TrangThaiHoSo; label: string }[] = [
  { value: 'moi_nop', label: 'Mới nộp' },
  { value: 'dang_kiem_tra', label: 'Đang kiểm tra' },
  { value: 'thieu_giay_to', label: 'Thiếu giấy tờ' },
  { value: 'hoan_tat', label: 'Hoàn tất' },
  { value: 'tu_choi', label: 'Từ chối' },
];

export default function HoSoFilters({ filters, onFilterChange }: HoSoFiltersProps) {
  const [namList, setNamList] = useState<NamTuyenSinhItem[]>([]);
  const [dotList, setDotList] = useState<DotTuyenSinhItem[]>([]);
  const [nganhList, setNganhList] = useState<NganhDangKyItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchCatalogs() {
      try {
        const [nam, dot, nganh] = await Promise.all([
          layDanhMuc('nam-tuyen-sinh'),
          layDanhMuc('dot-tuyen-sinh'),
          layDanhMuc('nganh-dang-ky'),
        ]);
        if (!cancelled) {
          setNamList(nam);
          setDotList(dot);
          setNganhList(nganh);
        }
      } catch {
        // Silently fail — filters will just show empty dropdowns
      }
    }
    fetchCatalogs();
    return () => { cancelled = true; };
  }, []);

  const handleIdChange = (field: 'namTuyenSinhId' | 'dotTuyenSinhId' | 'nganhDangKyId', value: string) => {
    const next: HoSoFilter = {
      ...filters,
      [field]: value ? Number(value) : undefined,
    };
    // Đổi năm → reset đợt (đợt phụ thuộc năm)
    if (field === 'namTuyenSinhId') {
      next.dotTuyenSinhId = undefined;
    }
    onFilterChange(next);
  };

  const handleTrangThaiChange = (value: string) => {
    onFilterChange({ ...filters, trangThai: value || undefined });
  };

  const selectClass =
    'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-colors duration-200 focus:border-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-200';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Lọc theo năm tuyển sinh"
        value={filters.namTuyenSinhId ?? ''}
        onChange={(e) => handleIdChange('namTuyenSinhId', e.target.value)}
        className={selectClass}
      >
        <option value="">Năm — Tất cả</option>
        {namList.map((item) => (
          <option key={item.id} value={item.id}>{item.nam}</option>
        ))}
      </select>

      <select
        aria-label="Lọc theo đợt tuyển sinh"
        value={filters.dotTuyenSinhId ?? ''}
        onChange={(e) => handleIdChange('dotTuyenSinhId', e.target.value)}
        disabled={!filters.namTuyenSinhId}
        className={`${selectClass} disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
      >
        <option value="">
          {filters.namTuyenSinhId ? 'Đợt — Tất cả' : 'Đợt — Chọn năm trước'}
        </option>
        {dotList
          .filter((item) =>
            filters.namTuyenSinhId
              ? item.namTuyenSinhId === filters.namTuyenSinhId
              : false
          )
          .map((item) => (
            <option key={item.id} value={item.id}>{item.tenDot}</option>
          ))}
      </select>

      <select
        aria-label="Lọc theo trạng thái"
        value={filters.trangThai ?? ''}
        onChange={(e) => handleTrangThaiChange(e.target.value)}
        className={selectClass}
      >
        <option value="">Trạng thái — Tất cả</option>
        {TRANG_THAI_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <select
        aria-label="Lọc theo ngành đăng ký"
        value={filters.nganhDangKyId ?? ''}
        onChange={(e) => handleIdChange('nganhDangKyId', e.target.value)}
        className={selectClass}
      >
        <option value="">Ngành — Tất cả</option>
        {nganhList.map((item) => (
          <option key={item.id} value={item.id}>{item.tenNganh}</option>
        ))}
      </select>
    </div>
  );
}
