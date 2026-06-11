import { useSearchParams, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useHoSoList } from '../hooks/useHoSoList';
import HoSoFilters from '../components/HoSoFilters';
import HoSoTable from '../components/HoSoTable';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import EmptyState from '../../../components/common/EmptyState';

export default function AdmissionListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTrangThai = searchParams.get('trangThai') ?? undefined;

  const { data, loading, error, filters, setFilters, refetch } = useHoSoList(
    initialTrangThai ? { trangThai: initialTrangThai } : undefined,
  );

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
        <FileText className="w-7 h-7 text-[#A51C30]" />
        Hồ sơ tuyển sinh
      </h1>

      <HoSoFilters filters={filters} onFilterChange={setFilters} />

      {loading && <SkeletonLoader type="table" />}

      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && data.length === 0 && (
        <EmptyState
          title="Không có hồ sơ nào"
          description="Hãy thử điều chỉnh bộ lọc hoặc tạo hồ sơ mới"
          actionLabel="Tạo hồ sơ mới"
          onAction={() => navigate('/ho-so/tao-moi')}
        />
      )}

      {!loading && !error && data.length > 0 && (
        <HoSoTable data={data} onRowClick={(id) => navigate(`/ho-so/${id}`)} />
      )}
    </div>
  );
}
