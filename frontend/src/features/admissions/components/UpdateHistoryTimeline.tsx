import { useEffect, useState } from 'react';
import { useUpdateHistory } from '../hooks/useUpdateHistory';
import { TRANG_THAI_MAP, type TrangThaiHoSo } from '../types';

interface Props {
  maHoSo: string;
  refreshTrigger: number;
}

function formatThoiGian(isoString: string): string {
  const date = new Date(isoString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function StatusBadge({ trangThai }: { trangThai: TrangThaiHoSo }) {
  const info = TRANG_THAI_MAP[trangThai];
  if (!info) return <span>{trangThai}</span>;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${info.bgColor} ${info.color}`}>
      {info.label}
    </span>
  );
}

export default function UpdateHistoryTimeline({ maHoSo, refreshTrigger }: Props) {
  const { history, loading, error, refetch } = useUpdateHistory(maHoSo);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch();
      setDisplayCount(20);
    }
  }, [refreshTrigger, refetch]);

  if (loading) {
    return (
      <div className="relative pl-6">
        <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-slate-200" />
        <ul className="space-y-4">
          {[1, 2, 3].map((i) => (
            <li key={i} className="relative animate-pulse">
              <div className="absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-20 rounded-full bg-slate-200" />
                  <div className="h-3 w-3 rounded bg-slate-100" />
                  <div className="h-5 w-20 rounded-full bg-slate-200" />
                </div>
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-3 rounded bg-slate-100" />
                  <div className="h-3 w-28 rounded bg-slate-100" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <svg className="mx-auto h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-3 inline-flex items-center rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
        <svg className="mx-auto h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="mt-2 text-sm text-slate-500">Chưa có lịch sử cập nhật</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      {/* Vertical timeline line */}
      <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-slate-200" />

      <ul className="space-y-4">
        {history.slice(0, displayCount).map((item) => (
          <li key={item.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-400 ring-2 ring-white" />
            </div>

            <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
              {/* Status badges: old → new */}
              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge trangThai={item.trangThaiCu} />
                <span className="text-xs text-slate-400">→</span>
                <StatusBadge trangThai={item.trangThaiMoi} />
              </div>

              {/* Ghi chú */}
              {item.ghiChu && (
                <p className="mt-1.5 text-sm text-slate-700">{item.ghiChu}</p>
              )}

              {/* Meta: người thực hiện + thời gian */}
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{item.nguoiThucHien}</span>
                <span>·</span>
                <span>{formatThoiGian(item.thoiGian)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {history.length > displayCount && (
        <button
          type="button"
          onClick={() => setDisplayCount((prev) => prev + 20)}
          className="mt-4 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Xem thêm ({history.length - displayCount} mục còn lại)
        </button>
      )}
    </div>
  );
}
