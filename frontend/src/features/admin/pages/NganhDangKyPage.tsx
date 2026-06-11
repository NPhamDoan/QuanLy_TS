import { useState, useEffect, useCallback } from 'react';
import { BookOpen } from 'lucide-react';
import { layDanhSachDanhMucAdmin, themDanhMuc, capNhatDanhMuc, xoaDanhMuc } from '../../../api/admin.api';
import CatalogTable, { type CatalogColumn } from '../components/CatalogTable';
import CatalogForm, { type CatalogField } from '../components/CatalogForm';
import type { CatalogItem } from '../types';

const ENDPOINT = 'nganh-dang-ky';
const columns: CatalogColumn[] = [
  { key: 'tenNganh', label: 'Tên ngành' },
  { key: 'maNganh', label: 'Mã ngành' },
];
const fields: CatalogField[] = [
  { key: 'tenNganh', label: 'Tên ngành', type: 'text' },
  { key: 'maNganh', label: 'Mã ngành', type: 'text' },
];

export default function NganhDangKyPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = useCallback(async () => {
    setError('');
    try {
      const data = await layDanhSachDanhMucAdmin(ENDPOINT);
      setItems(data);
    } catch {
      setError('Không thể tải danh sách ngành đăng ký');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleAdd = async (data: Record<string, any>) => {
    await themDanhMuc(ENDPOINT, data);
    await fetchList();
  };

  const handleEdit = async (data: Record<string, any>) => {
    if (!editingItem) return;
    await capNhatDanhMuc(ENDPOINT, editingItem.id, data);
    setEditingItem(null);
    await fetchList();
  };

  const handleDelete = async (id: number) => {
    await xoaDanhMuc(ENDPOINT, id);
    await fetchList();
  };

  const handleStatusChange = async (id: number, newStatus: 'hoat_dong' | 'khong_hoat_dong') => {
    await capNhatDanhMuc(ENDPOINT, id, { trangThai: newStatus });
    await fetchList();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="flex items-center gap-3 text-2xl font-bold mb-6 text-slate-900">
        <BookOpen className="w-7 h-7 text-purple-700" />
        Quản lý Ngành đăng ký
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <CatalogForm
        key={editingItem ? `edit-${editingItem.id}` : 'add'}
        fields={fields}
        initialValues={editingItem ? { tenNganh: editingItem['tenNganh'], maNganh: editingItem['maNganh'] } : undefined}
        onSubmit={editingItem ? handleEdit : handleAdd}
        onCancel={editingItem ? () => setEditingItem(null) : undefined}
        isEditing={!!editingItem}
        title={editingItem ? 'Cập nhật ngành đăng ký' : 'Thêm ngành đăng ký'}
      />

      <CatalogTable
        items={items}
        columns={columns}
        onEdit={setEditingItem}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        title="Danh sách ngành đăng ký"
        emptyMessage="Chưa có ngành đăng ký nào"
      />
    </div>
  );
}
