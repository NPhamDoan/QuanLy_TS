import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  // Header chỉ hiển thị trên mobile (<768px) để chứa nút hamburger mở sidebar.
  // Trên tablet/desktop sidebar luôn hiển thị nên không cần header.
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm md:hidden">
      <div className="flex items-center h-14 px-4">
        <button
          onClick={onMenuClick}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-200"
          aria-label="Mở menu"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      </div>
    </header>
  );
}
