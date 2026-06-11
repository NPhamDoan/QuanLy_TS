import { useState, useEffect, useCallback } from 'react';
import { Users } from 'lucide-react';
import { layDanhSachTaiKhoan } from '../../../api/admin.api';
import { useAuth } from '../../auth/hooks/useAuth';
import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';
import UserEditForm from '../components/UserEditForm';
import UserPasswordForm from '../components/UserPasswordForm';
import type { TaiKhoanRow } from '../types';

export default function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<TaiKhoanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<TaiKhoanRow | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<TaiKhoanRow | null>(null);

  const fetchUsers = useCallback(async () => {
    setError('');
    try {
      const data = await layDanhSachTaiKhoan();
      setUsers(data);
    } catch {
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (u: TaiKhoanRow) => {
    setResetPasswordUser(null);
    setEditingUser(u);
    scrollToTop();
  };

  const handleResetPassword = (u: TaiKhoanRow) => {
    setEditingUser(null);
    setResetPasswordUser(u);
    scrollToTop();
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    fetchUsers();
  };

  const handleResetPasswordSuccess = () => {
    setResetPasswordUser(null);
    fetchUsers();
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
        <Users className="w-7 h-7 text-purple-700" />
        Quản lý Người dùng
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-purple-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      {editingUser ? (
        <UserEditForm
          user={editingUser}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingUser(null)}
        />
      ) : resetPasswordUser ? (
        <UserPasswordForm
          user={resetPasswordUser}
          onSuccess={handleResetPasswordSuccess}
          onCancel={() => setResetPasswordUser(null)}
        />
      ) : (
        <UserForm onSuccess={fetchUsers} />
      )}

      <UserTable
        users={users}
        currentUserId={user!.id}
        onStatusChange={fetchUsers}
        onEdit={handleEdit}
        onResetPassword={handleResetPassword}
      />
    </div>
  );
}
