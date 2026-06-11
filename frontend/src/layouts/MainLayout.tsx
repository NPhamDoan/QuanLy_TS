import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Content area — left margin matches sidebar width at each breakpoint */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <Header onMenuClick={handleMenuClick} />

        <main className="flex-1 bg-white p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
