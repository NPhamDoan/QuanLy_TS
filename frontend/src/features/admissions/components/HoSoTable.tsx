import { Eye } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import type { HoSoTuyenSinh } from '../types';

interface HoSoTableProps {
  data: HoSoTuyenSinh[];
  onRowClick: (maHoSo: string) => void;
}

export default function HoSoTable({ data, onRowClick }: HoSoTableProps) {
  return (
    <>
      {/* Desktop/Tablet: Table layout (≥768px) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Mã hồ sơ</th>
              <th className="px-4 py-3 font-medium">Họ tên SV</th>
              <th className="px-4 py-3 font-medium">Ngành</th>
              <th className="px-4 py-3 font-medium">Năm</th>
              <th className="px-4 py-3 font-medium">Đợt</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((hoSo) => (
              <tr
                key={hoSo.maHoSo}
                onClick={() => onRowClick(hoSo.maHoSo)}
                className="cursor-pointer transition-colors duration-200 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium text-slate-900">{hoSo.maHoSo}</td>
                <td className="px-4 py-3 text-slate-700">{hoSo.hoTen || hoSo.maSinhVien}</td>
                <td className="px-4 py-3 text-slate-700">{hoSo.nganhDangKy}</td>
                <td className="px-4 py-3 text-slate-700">{hoSo.namTuyenSinh}</td>
                <td className="px-4 py-3 text-slate-700">{hoSo.dotTuyenSinh}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={hoSo.trangThai} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    aria-label="Xem chi tiết"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(hoSo.maHoSo);
                    }}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors duration-200 hover:bg-red-100 hover:text-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card layout (<768px) */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((hoSo) => (
          <div
            key={hoSo.maHoSo}
            onClick={() => onRowClick(hoSo.maHoSo)}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors duration-200 hover:bg-slate-50"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">{hoSo.maHoSo}</span>
              <StatusBadge status={hoSo.trangThai} />
            </div>
            <div className="mb-3 space-y-1 text-sm text-slate-600">
              <p><span className="font-medium text-slate-500">Họ tên SV:</span> {hoSo.hoTen || hoSo.maSinhVien}</p>
              <p><span className="font-medium text-slate-500">Ngành:</span> {hoSo.nganhDangKy}</p>
              <p><span className="font-medium text-slate-500">Năm:</span> {hoSo.namTuyenSinh} · {hoSo.dotTuyenSinh}</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                aria-label="Xem chi tiết"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(hoSo.maHoSo);
                }}
                className="rounded-lg p-1.5 text-slate-500 transition-colors duration-200 hover:bg-red-100 hover:text-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
