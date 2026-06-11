import { useState, type FormEvent } from 'react';
import { taoTaiKhoan } from '../../../api/admin.api';
import type { TaoTaiKhoanPayload } from '../types';

interface UserFormProps {
  onSuccess: () => void;
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [form, setForm] = useState<TaoTaiKhoanPayload>({
    tenDangNhap: '',
    matKhau: '',
    hoTen: '',
    vaiTro: 'staff',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await taoTaiKhoan(form);
      setForm({ tenDangNhap: '', matKhau: '', hoTen: '', vaiTro: 'staff' });
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('Tên đăng nhập đã tồn tại');
      } else {
        setError(err.response?.data?.error || 'Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Tạo người dùng mới</h2>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
          <input
            type="text"
            required
            value={form.tenDangNhap}
            onChange={e => setForm(f => ({ ...f, tenDangNhap: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            required
            value={form.matKhau}
            onChange={e => setForm(f => ({ ...f, matKhau: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
          <input
            type="text"
            required
            value={form.hoTen}
            onChange={e => setForm(f => ({ ...f, hoTen: e.target.value }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
          <select
            value={form.vaiTro}
            onChange={e => setForm(f => ({ ...f, vaiTro: e.target.value as 'admin' | 'staff' }))}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="staff">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang tạo...' : 'Tạo người dùng'}
        </button>
      </div>
    </form>
  );
}
