import { NavLink } from 'react-router-dom';
import {
  Users,
  Calendar,
  Layers,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/admin/tai-khoan', label: 'Quản lý Người dùng', icon: Users },
  { to: '/admin/nam-tuyen-sinh', label: 'Năm tuyển sinh', icon: Calendar },
  { to: '/admin/dot-tuyen-sinh', label: 'Đợt tuyển sinh', icon: Layers },
  { to: '/admin/nganh-dang-ky', label: 'Ngành đăng ký', icon: BookOpen },
  { to: '/admin/he-dao-tao', label: 'Hệ đào tạo', icon: GraduationCap },
];

/**
 * Sidebar cho khu vực /admin. Cùng pattern responsive với `layouts/Sidebar`:
 * - Mobile (<768px): ẩn mặc định, mở qua nút hamburger trong header.
 * - Tablet/desktop (>=768px): luôn hiển thị, fixed bên trái.
 */
export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { logout } = useAuth();

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 min-h-[44px] transition-colors duration-200 ${
      isActive
        ? 'bg-purple-100 border-l-4 border-purple-700 text-purple-700 font-semibold'
        : 'border-l-4 border-transparent text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white text-slate-800
          border-r border-slate-200
          flex flex-col transition-transform duration-200
          w-60 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header tím */}
        <div className="flex items-center gap-3 px-4 h-16 bg-purple-700 shrink-0">
          <GraduationCap className="w-6 h-6 shrink-0 text-white" />
          <span className="text-lg font-semibold whitespace-nowrap text-white">
            Quản trị hệ thống
          </span>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="ml-auto md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-white/80 hover:text-white"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={onClose}
                  aria-label={label}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mx-4 my-3 border-t border-slate-200" />
          <ul>
            <li>
              <NavLink
                to="/"
                onClick={onClose}
                aria-label="Về trang chính"
                className="flex items-center gap-3 px-4 py-3 min-h-[44px] border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap">Về trang chính</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-3 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 min-h-[44px] rounded-lg bg-purple-700 text-white font-medium hover:bg-purple-800 active:bg-purple-900 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
            aria-label="Đăng xuất"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
