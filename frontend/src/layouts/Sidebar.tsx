import { NavLink } from 'react-router-dom';
import { Home, FileText, FilePlus, X, GraduationCap, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { to: '/', label: 'Trang chủ', icon: Home },
  { to: '/ho-so', label: 'Hồ sơ tuyển sinh', icon: FileText },
  { to: '/ho-so/tao-moi', label: 'Tạo hồ sơ mới', icon: FilePlus },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const linkClass = (isActive: boolean) =>
    `flex items-center gap-3 px-4 py-3 min-h-[44px] transition-colors duration-200 ${
      isActive
        ? 'bg-red-100 border-l-4 border-[#A51C30] text-[#A51C30] font-semibold'
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

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-white text-slate-800
          border-r border-slate-200
          flex flex-col transition-transform duration-200
          w-60 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo / Header — nền tím */}
        <div className="flex items-center gap-3 px-4 h-16 bg-[#A51C30] shrink-0">
          <GraduationCap className="w-6 h-6 shrink-0 text-white" />
          <span className="text-lg font-semibold whitespace-nowrap text-white">
            Quản lý Tuyển sinh
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

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map(({ to, label, icon: Icon }) => (
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

          {/* Admin menu — only for admin role */}
          {user?.vaiTro === 'admin' && (
            <>
              <div className="mx-4 my-3 border-t border-slate-200" />
              <ul>
                <li>
                  <NavLink
                    to="/admin"
                    onClick={onClose}
                    aria-label="Quản trị"
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    <Shield className="w-5 h-5 shrink-0" />
                    <span className="whitespace-nowrap">Quản trị</span>
                  </NavLink>
                </li>
              </ul>
            </>
          )}
        </nav>

        {/* Logout button — nền tím, có hover effect rõ */}
        <div className="border-t border-slate-200 p-3 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 min-h-[44px] rounded-lg bg-[#A51C30] text-white font-medium hover:bg-[#8b1827] active:bg-[#6e1420] transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
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
