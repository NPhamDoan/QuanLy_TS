import { useState, type FormEvent } from 'react';
import { capNhatTaiKhoan } from '../../../api/admin.api';
import type { TaiKhoanRow } from '../types';

interface UserEditFormProps {
  user: TaiKhoanRow;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserEditForm({ user, onSuccess, onCancel }: UserEditFormProps) {
  const [hoTen, setHoTen] = useState(user.hoTen);
  const [vaiTro, setVaiTro] = useState<'admin' | 'staff'>(user.vaiTro);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await capNhatTaiKhoan(user.id, { hoTen, vaiTro });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 border-2 border-purple-700/30">
      <h2 className="text-lg font-semibold mb-4">
        Sửa thông tin: <span className="font-mono text-purple-700">{user.tenDangNhap}</span>
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
          <input
            type="text"
            required
            value={hoTen}
            onChange={e => setHoTen(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
          <select
            value={vaiTro}
            onChange={e => setVaiTro(e.target.value as 'admin' | 'staff')}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-700 bg-slate-100 rounded text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
