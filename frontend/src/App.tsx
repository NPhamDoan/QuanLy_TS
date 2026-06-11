import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import LoginPage from './features/auth/pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './features/admissions/pages/DashboardPage';
import AdmissionListPage from './features/admissions/pages/AdmissionListPage';
import CreateAdmissionPage from './features/admissions/pages/CreateAdmissionPage';
import AdmissionDetailPage from './features/admissions/pages/AdmissionDetailPage';
import AdminLayout from './features/admin/pages/AdminLayout';
import UserManagementPage from './features/admin/pages/UserManagementPage';
import NamTuyenSinhPage from './features/admin/pages/NamTuyenSinhPage';
import DotTuyenSinhPage from './features/admin/pages/DotTuyenSinhPage';
import NganhDangKyPage from './features/admin/pages/NganhDangKyPage';
import HeDaoTaoPage from './features/admin/pages/HeDaoTaoPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/ho-so" element={<AdmissionListPage />} />
              <Route path="/ho-so/tao-moi" element={<CreateAdmissionPage />} />
              <Route path="/ho-so/:id" element={<AdmissionDetailPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/tai-khoan" replace />} />
                <Route path="tai-khoan" element={<UserManagementPage />} />
                <Route path="nam-tuyen-sinh" element={<NamTuyenSinhPage />} />
                <Route path="dot-tuyen-sinh" element={<DotTuyenSinhPage />} />
                <Route path="nganh-dang-ky" element={<NganhDangKyPage />} />
                <Route path="he-dao-tao" element={<HeDaoTaoPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
