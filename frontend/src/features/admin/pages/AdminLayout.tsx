import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../../layouts/Header';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      {/* Content area — left margin matches sidebar width at md+. Mobile = 0. */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <Header onMenuClick={handleMenuClick} />

        <main className="flex-1 bg-white p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
