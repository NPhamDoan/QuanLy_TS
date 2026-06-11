import { useState, type FormEvent } from 'react';
import { datLaiMatKhauTaiKhoan } from '../../../api/admin.api';
import type { TaiKhoanRow } from '../types';

interface UserPasswordFormProps {
  user: TaiKhoanRow;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserPasswordForm({ user, onSuccess, onCancel }: UserPasswordFormProps) {
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhan, setXacNhan] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (matKhauMoi.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (matKhauMoi !== xacNhan) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await datLaiMatKhauTaiKhoan(user.id, matKhauMoi);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 border-2 border-amber-200">
      <h2 className="text-lg font-semibold mb-4">
        Đặt lại mật khẩu: <span className="font-mono text-amber-600">{user.tenDangNhap}</span>
      </h2>

      <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded mb-4 border border-amber-200">
        Người dùng sẽ bị đăng xuất khỏi mọi phiên và phải đăng nhập lại bằng mật khẩu mới.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={matKhauMoi}
            onChange={e => setMatKhauMoi(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={xacNhan}
            onChange={e => setXacNhan(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
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
