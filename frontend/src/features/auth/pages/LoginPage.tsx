import { Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-slate-500">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        {/* Logo + tên hệ thống (đồng bộ với sidebar header) */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-[#A51C30] flex items-center justify-center mb-3">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Tuyển sinh</h1>
          <p className="mt-1 text-sm text-slate-500">Đăng nhập để tiếp tục</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md border border-slate-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
