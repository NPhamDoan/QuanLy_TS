import { useState, useEffect, useCallback } from 'react';
import { Layers } from 'lucide-react';
import { layDanhSachDanhMucAdmin, themDanhMuc, capNhatDanhMuc, xoaDanhMuc } from '../../../api/admin.api';
import CatalogTable, { type CatalogColumn } from '../components/CatalogTable';
import CatalogForm, { type CatalogField } from '../components/CatalogForm';
import type { CatalogItem, NamTuyenSinhItem } from '../types';

const ENDPOINT = 'dot-tuyen-sinh';
const columns: CatalogColumn[] = [
  { key: 'tenDot', label: 'Tên đợt' },
  { key: 'namTuyenSinh', label: 'Năm tuyển sinh' },
];

export default function DotTuyenSinhPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [namOptions, setNamOptions] = useState<NamTuyenSinhItem[]>([]);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = useCallback(async () => {
    setError('');
    try {
      const [dotData, namData] = await Promise.all([
        layDanhSachDanhMucAdmin(ENDPOINT),
        layDanhSachDanhMucAdmin('nam-tuyen-sinh'),
      ]);
      setItems(dotData);
      setNamOptions(namData);
    } catch {
      setError('Không thể tải danh sách đợt tuyển sinh');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchList(); }, [fetchList]);

  const fields: CatalogField[] = [
    { key: 'tenDot', label: 'Tên đợt', type: 'text' },
    {
      key: 'namTuyenSinhId',
      label: 'Năm tuyển sinh',
      type: 'select',
      options: namOptions.map(n => ({ value: n.id, label: String(n.nam) })),
    },
  ];

  const handleAdd = async (data: Record<string, any>) => {
    await themDanhMuc(ENDPOINT, { ...data, namTuyenSinhId: Number(data.namTuyenSinhId) });
    await fetchList();
  };

  const handleEdit = async (data: Record<string, any>) => {
    if (!editingItem) return;
    await capNhatDanhMuc(ENDPOINT, editingItem.id, { ...data, namTuyenSinhId: Number(data.namTuyenSinhId) });
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
        <Layers className="w-7 h-7 text-purple-700" />
        Quản lý Đợt tuyển sinh
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <CatalogForm
        key={editingItem ? `edit-${editingItem.id}` : 'add'}
        fields={fields}
        initialValues={editingItem ? { tenDot: editingItem['tenDot'], namTuyenSinhId: editingItem['namTuyenSinhId'] } : undefined}
        onSubmit={editingItem ? handleEdit : handleAdd}
        onCancel={editingItem ? () => setEditingItem(null) : undefined}
        isEditing={!!editingItem}
        title={editingItem ? 'Cập nhật đợt tuyển sinh' : 'Thêm đợt tuyển sinh'}
      />

      <CatalogTable
        items={items}
        columns={columns}
        onEdit={setEditingItem}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        title="Danh sách đợt tuyển sinh"
        emptyMessage="Chưa có đợt tuyển sinh nào"
      />
    </div>
  );
}
