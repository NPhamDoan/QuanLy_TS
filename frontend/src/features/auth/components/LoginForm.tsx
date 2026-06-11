import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { AxiosError } from 'axios';

export default function LoginForm() {
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(tenDangNhap, matKhau);
      navigate('/', { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      setError(axiosErr.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
      setMatKhau('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="tenDangNhap" className="block text-sm font-medium text-slate-700 mb-1">
          Tên đăng nhập
        </label>
        <input
          id="tenDangNhap"
          type="text"
          required
          autoComplete="username"
          value={tenDangNhap}
          onChange={(e) => setTenDangNhap(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-[#A51C30] focus:outline-none focus:ring-1 focus:ring-[#A51C30]
                     disabled:bg-slate-50 disabled:text-slate-400"
          disabled={isSubmitting}
          placeholder="Nhập tên đăng nhập"
        />
      </div>

      <div>
        <label htmlFor="matKhau" className="block text-sm font-medium text-slate-700 mb-1">
          Mật khẩu
        </label>
        <input
          id="matKhau"
          type="password"
          required
          autoComplete="current-password"
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm
                     focus:border-[#A51C30] focus:outline-none focus:ring-1 focus:ring-[#A51C30]
                     disabled:bg-slate-50 disabled:text-slate-400"
          disabled={isSubmitting}
          placeholder="Nhập mật khẩu"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#A51C30] px-4 py-2.5 text-sm font-medium text-white shadow-sm
                   hover:bg-[#8b1827] focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2
                   disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
