import { useState } from 'react';
import { capNhatTrangThaiTaiKhoan } from '../../../api/admin.api';
import type { TaiKhoanRow } from '../types';

interface UserTableProps {
  users: TaiKhoanRow[];
  currentUserId: number;
  onStatusChange: () => void;
  onEdit: (user: TaiKhoanRow) => void;
  onResetPassword: (user: TaiKhoanRow) => void;
}

export default function UserTable({
  users,
  currentUserId,
  onStatusChange,
  onEdit,
  onResetPassword,
}: UserTableProps) {
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleToggleStatus = async (user: TaiKhoanRow) => {
    setError('');
    const newStatus = user.trangThai === 'hoat_dong' ? 'vo_hieu_hoa' : 'hoat_dong';
    setLoadingId(user.id);

    try {
      await capNhatTrangThaiTaiKhoan(user.id, newStatus);
      onStatusChange();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="text-lg font-semibold p-6 pb-4">Danh sách người dùng</h2>

      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-600">Tên đăng nhập</th>
              <th className="px-6 py-3 font-medium text-gray-600">Họ tên</th>
              <th className="px-6 py-3 font-medium text-gray-600">Vai trò</th>
              <th className="px-6 py-3 font-medium text-gray-600">Trạng thái</th>
              <th className="px-6 py-3 font-medium text-gray-600">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono">
                    {user.tenDangNhap}
                    {isSelf && <span className="ml-2 text-xs text-slate-400">(bạn)</span>}
                  </td>
                  <td className="px-6 py-3">{user.hoTen}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      user.vaiTro === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.vaiTro === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      user.trangThai === 'hoat_dong'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => onEdit(user)}
                        className="px-3 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onResetPassword(user)}
                        className="px-3 py-1 rounded text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                      >
                        Đổi mật khẩu
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={loadingId === user.id || (isSelf && user.trangThai === 'hoat_dong')}
                        title={isSelf && user.trangThai === 'hoat_dong' ? 'Không thể vô hiệu hóa tài khoản của chính mình' : ''}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          user.trangThai === 'hoat_dong'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {loadingId === user.id
                          ? '...'
                          : user.trangThai === 'hoat_dong'
                            ? 'Vô hiệu hóa'
                            : 'Kích hoạt'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Chưa có người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
