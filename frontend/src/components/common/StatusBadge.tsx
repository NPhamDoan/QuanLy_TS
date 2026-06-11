import { type TrangThaiHoSo, TRANG_THAI_MAP } from '../../features/admissions/types';

interface StatusBadgeProps {
  status: TrangThaiHoSo;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color, bgColor } = TRANG_THAI_MAP[status];

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color} ${bgColor}`}>
      {label}
    </span>
  );
}
