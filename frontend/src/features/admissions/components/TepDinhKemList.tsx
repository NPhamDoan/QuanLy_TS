import { Trash2, FileText, Download } from 'lucide-react';
import axiosClient from '../../../api/axiosClient';
import type { TepDinhKem } from '../types';

interface TepDinhKemListProps {
  tepList: TepDinhKem[];
  onDelete: (maTep: string) => void;
}

async function handleDownload(maTep: string, tenTep: string) {
  try {
    const response = await axiosClient.get(`/tep-dinh-kem/download/${maTep}`, {
      responseType: 'blob',
    });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = tenTep;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    alert('Không thể tải tệp. Vui lòng thử lại.');
  }
}

export default function TepDinhKemList({ tepList, onDelete }: TepDinhKemListProps) {
  if (tepList.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <FileText className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm text-slate-500">Chưa có tệp đính kèm nào</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <ul className="divide-y divide-slate-100">
        {tepList.map((tep) => (
          <li
            key={tep.maTep}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {tep.tenTep}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{tep.loaiTep}</span>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleDownload(tep.maTep, tep.tenTep)}
                    className="inline-flex items-center gap-1 text-[#A51C30] transition-colors duration-200 hover:text-[#A51C30]/80"
                  >
                    Tải xuống
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Xóa tệp"
              onClick={() => onDelete(tep.maTep)}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
