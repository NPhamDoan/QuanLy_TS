import { useState } from 'react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import type { CatalogItem } from '../types';

export interface CatalogColumn {
  key: string;
  label: string;
}

interface CatalogTableProps {
  items: CatalogItem[];
  columns: CatalogColumn[];
  onEdit: (item: CatalogItem) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, newStatus: 'hoat_dong' | 'khong_hoat_dong') => void;
  title?: string;
  emptyMessage?: string;
}

export default function CatalogTable({
  items,
  columns,
  onEdit,
  onDelete,
  onStatusChange,
  title = 'Danh sách',
  emptyMessage = 'Chưa có dữ liệu',
}: CatalogTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CatalogItem | null>(null);
  const [error, setError] = useState('');

  const handleStatusToggle = async (item: CatalogItem) => {
    setError('');
    const newStatus = item.trangThai === 'hoat_dong' ? 'khong_hoat_dong' : 'hoat_dong';
    setLoadingId(item.id);
    try {
      await onStatusChange(item.id, newStatus);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setError('');
    setLoadingId(deleteTarget.id);
    try {
      await onDelete(deleteTarget.id);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError(err.response.data?.error || 'Không thể xóa mục đang được sử dụng');
      } else {
        setError(err.response?.data?.error || 'Có lỗi xảy ra khi xóa');
      }
    } finally {
      setLoadingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="text-lg font-semibold p-6 pb-4">{title}</h2>

      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 font-medium text-gray-600">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 font-medium text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-3">
                    {String(item[col.key] ?? '')}
                  </td>
                ))}
                <td className="px-6 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      item.trangThai === 'hoat_dong'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleStatusToggle(item)}
                      disabled={loadingId === item.id}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                        item.trangThai === 'hoat_dong'
                          ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {loadingId === item.id
                        ? '...'
                        : item.trangThai === 'hoat_dong'
                          ? 'Tắt'
                          : 'Bật'}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      disabled={loadingId === item.id}
                      className="px-3 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-8 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
