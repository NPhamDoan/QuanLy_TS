import { useNavigate } from 'react-router-dom';
import {
  FileStack,
  FileInput,
  FileSearch,
  FileCheck,
  FileX,
  FilePlus2,
  List,
  Home,
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import StatCard from '../../../components/common/StatCard';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function DashboardPage() {
  const { stats, loading, error, refetch } = useDashboardStats();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
        <Home className="w-7 h-7 text-[#A51C30]" />
        Trang chủ
      </h1>

      {loading && <SkeletonLoader type="stat-cards" />}

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {stats && !loading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon={<FileStack className="w-6 h-6" />}
              count={stats.total}
              label="Tổng hồ sơ"
              colorClass="bg-[#A51C30]"
              onClick={() => navigate('/ho-so')}
            />
            <StatCard
              icon={<FileInput className="w-6 h-6" />}
              count={stats.moiNop}
              label="Mới nộp"
              colorClass="bg-amber-500"
              onClick={() => navigate('/ho-so?trangThai=moi_nop')}
            />
            <StatCard
              icon={<FileSearch className="w-6 h-6" />}
              count={stats.dangKiemTra}
              label="Đang kiểm tra"
              colorClass="bg-blue-500"
              onClick={() => navigate('/ho-so?trangThai=dang_kiem_tra')}
            />
            <StatCard
              icon={<FileCheck className="w-6 h-6" />}
              count={stats.hoanTat}
              label="Hoàn tất"
              colorClass="bg-emerald-500"
              onClick={() => navigate('/ho-so?trangThai=hoan_tat')}
            />
            <StatCard
              icon={<FileX className="w-6 h-6" />}
              count={stats.tuChoi}
              label="Từ chối"
              colorClass="bg-red-500"
              onClick={() => navigate('/ho-so?trangThai=tu_choi')}
            />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Hành động nhanh</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/ho-so/tao-moi')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#A51C30] text-white rounded-lg hover:bg-[#A51C30] transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#A51C30]"
              >
                <FilePlus2 className="w-5 h-5" />
                Tạo hồ sơ mới
              </button>
              <button
                onClick={() => navigate('/ho-so')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-slate-500"
              >
                <List className="w-5 h-5" />
                Xem danh sách hồ sơ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
