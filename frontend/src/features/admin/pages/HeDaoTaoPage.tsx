import { useState, useEffect, useCallback } from 'react';
import { GraduationCap } from 'lucide-react';
import { layDanhSachDanhMucAdmin, themDanhMuc, capNhatDanhMuc, xoaDanhMuc } from '../../../api/admin.api';
import CatalogTable, { type CatalogColumn } from '../components/CatalogTable';
import CatalogForm, { type CatalogField } from '../components/CatalogForm';
import type { CatalogItem } from '../types';

const ENDPOINT = 'he-dao-tao';
const columns: CatalogColumn[] = [{ key: 'tenHe', label: 'Tên hệ' }];
const fields: CatalogField[] = [{ key: 'tenHe', label: 'Tên hệ', type: 'text' }];

export default function HeDaoTaoPage() {
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
      setError('Không thể tải danh sách hệ đào tạo');
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
        <GraduationCap className="w-7 h-7 text-purple-700" />
        Quản lý Hệ đào tạo
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <CatalogForm
        key={editingItem ? `edit-${editingItem.id}` : 'add'}
        fields={fields}
        initialValues={editingItem ? { tenHe: editingItem['tenHe'] } : undefined}
        onSubmit={editingItem ? handleEdit : handleAdd}
        onCancel={editingItem ? () => setEditingItem(null) : undefined}
        isEditing={!!editingItem}
        title={editingItem ? 'Cập nhật hệ đào tạo' : 'Thêm hệ đào tạo'}
      />

      <CatalogTable
        items={items}
        columns={columns}
        onEdit={setEditingItem}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        title="Danh sách hệ đào tạo"
        emptyMessage="Chưa có hệ đào tạo nào"
      />
    </div>
  );
}
