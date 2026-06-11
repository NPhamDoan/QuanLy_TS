import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, User, IdCard, BookOpen, GraduationCap, CheckCircle2, Circle } from 'lucide-react';
import { useHoSoDetail } from '../hooks/useHoSoDetail';
import { type TrangThaiHoSo, TRANG_THAI_MAP } from '../types';
import { formatDate } from '../../../utils/formatters';
import StatusBadge from '../../../components/common/StatusBadge';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import AvatarUpload from '../../../components/common/AvatarUpload';
import TepDinhKemList from '../components/TepDinhKemList';
import TepDinhKemForm from '../components/TepDinhKemForm';
import UpdateHistoryTimeline from '../components/UpdateHistoryTimeline';

const TRANG_THAI_OPTIONS: TrangThaiHoSo[] = [
  'moi_nop',
  'dang_kiem_tra',
  'thieu_giay_to',
  'hoan_tat',
  'tu_choi',
];

// Thứ tự bước review để vẽ timeline
const REVIEW_STEPS: { status: TrangThaiHoSo; label: string }[] = [
  { status: 'moi_nop', label: 'Đã nộp' },
  { status: 'dang_kiem_tra', label: 'Đang kiểm tra' },
  { status: 'hoan_tat', label: 'Hoàn tất' },
];

export default function AdmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    hoSo,
    sinhVien,
    tepList,
    loading,
    error,
    updateTrangThai,
    deleteTep,
    refetch,
  } = useHoSoDetail(id!);

  const [newTrangThai, setNewTrangThai] = useState<TrangThaiHoSo | ''>('');
  const [ghiChuUpdate, setGhiChuUpdate] = useState('');
  const [ghiChuError, setGhiChuError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (hoSo) {
      setNewTrangThai(hoSo.trangThai);
      setGhiChuUpdate('');
      setGhiChuError(null);
    }
  }, [hoSo?.trangThai]);

  const hasChanges =
    hoSo !== null &&
    (newTrangThai !== hoSo.trangThai || ghiChuUpdate.trim().length > 0);

  const handleUpdateTrangThai = async () => {
    if (!newTrangThai || updating || !hasChanges) return;

    // Validate ghiChu
    const trimmed = ghiChuUpdate.trim();
    if (trimmed.length === 0) {
      setGhiChuError('Ghi chú là bắt buộc');
      return;
    }
    if (trimmed.length < 5 || trimmed.length > 500) {
      setGhiChuError('Ghi chú phải từ 5 đến 500 ký tự');
      return;
    }
    setGhiChuError(null);

    setUpdating(true);
    try {
      await updateTrangThai(newTrangThai, trimmed);
      setGhiChuUpdate('');
      setUpdateError(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Cập nhật trạng thái thất bại';
      setUpdateError(message);
      setTimeout(() => setUpdateError(null), 5000);
    }
    finally { setUpdating(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try { await deleteTep(deleteTarget); } catch {}
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif-heading text-3xl text-slate-900">Chi tiết hồ sơ</h1>
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif-heading text-3xl text-slate-900">Chi tiết hồ sơ</h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!hoSo || !sinhVien) return null;

  const currentStepIndex = REVIEW_STEPS.findIndex((s) => s.status === hoSo.trangThai);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="font-serif-heading text-3xl text-slate-900">Chi tiết hồ sơ</h1>
        <p className="mt-1 text-sm text-slate-500">
          Xem và xử lý hồ sơ tuyển sinh của thí sinh
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* =============== CỘT TRÁI =============== */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Avatar with upload */}
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <AvatarUpload
                  hoTen={sinhVien.hoTen}
                  maSinhVien={sinhVien.maSinhVien}
                  anhDaiDien={sinhVien.anhDaiDien}
                  size={96}
                />
                <span
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                    hoSo.trangThai === 'hoan_tat'
                      ? 'bg-emerald-500'
                      : hoSo.trangThai === 'tu_choi'
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-4 font-serif-heading text-xl font-semibold text-slate-900">
                {sinhVien.hoTen}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {hoSo.nganhDangKy} · {hoSo.heDaoTao}
              </p>
              <span className="mt-3 inline-block px-3 py-1 rounded-full bg-red-50 text-[#A51C30] text-xs font-medium">
                Mã hồ sơ: {hoSo.maHoSo}
              </span>
            </div>

            <hr className="my-5 border-slate-200" />

            {/* Contact info */}
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-700">
                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="truncate">{sinhVien.email}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{sinhVien.soDienThoai}</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                <span>{sinhVien.diaChi}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{formatDate(sinhVien.ngaySinh)} · {sinhVien.gioiTinh}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <IdCard className="w-4 h-4 shrink-0 text-slate-400" />
                <span className="font-mono text-xs">{sinhVien.cccd}</span>
              </li>
            </ul>
          </div>

          {/* Review Progress Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Tiến độ xử lý
            </h3>
            <ol className="relative">
              {REVIEW_STEPS.map((step, idx) => {
                const isCompleted = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;
                const isRejected =
                  hoSo.trangThai === 'tu_choi' && idx === currentStepIndex;

                return (
                  <li key={step.status} className="flex gap-4 pb-5 last:pb-0 relative">
                    {/* Vertical connector line */}
                    {idx < REVIEW_STEPS.length - 1 && (
                      <span
                        className={`absolute left-[14px] top-7 bottom-0 w-0.5 ${
                          isCompleted ? 'bg-[#A51C30]' : 'bg-slate-200'
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    {/* Step node */}
                    <div className="shrink-0 relative z-10">
                      {isCompleted ? (
                        <div className="w-7 h-7 rounded-full bg-[#A51C30] text-white flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : isCurrent ? (
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                            isRejected
                              ? 'bg-red-100 text-red-600 ring-2 ring-red-500'
                              : 'bg-red-100 text-[#A51C30] ring-2 ring-[#A51C30]'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white text-slate-400 flex items-center justify-center border border-slate-300">
                          <Circle className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 pt-0.5">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent
                            ? isRejected
                              ? 'text-red-600'
                              : 'text-[#A51C30]'
                            : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {TRANG_THAI_MAP[hoSo.trangThai].label}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* =============== CỘT PHẢI =============== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin hồ sơ — dạng bảng khoa học */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif-heading text-xl font-semibold text-slate-900 mb-4">
              Thông tin tuyển sinh
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3 pr-4 text-left font-semibold">Năm</th>
                    <th className="py-3 pr-4 text-left font-semibold">Đợt</th>
                    <th className="py-3 pr-4 text-left font-semibold">Ngành</th>
                    <th className="py-3 text-left font-semibold">Hệ đào tạo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-4 pr-4 font-medium text-slate-900">{hoSo.namTuyenSinh}</td>
                    <td className="py-4 pr-4 text-slate-700">{hoSo.dotTuyenSinh}</td>
                    <td className="py-4 pr-4 text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        {hoSo.nganhDangKy}
                      </span>
                    </td>
                    <td className="py-4 text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        {hoSo.heDaoTao}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="pt-3 text-xs text-slate-500">
                      <User className="w-3 h-3 inline mr-1" />
                      Mã SV: <span className="font-mono">{hoSo.maSinhVien}</span>
                      <span className="mx-2">·</span>
                      Ngày tạo: {formatDate(hoSo.ngayTao)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tệp đính kèm */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-heading text-xl font-semibold text-slate-900">
                Tệp đính kèm
              </h3>
              <TepDinhKemForm maHoSo={id!} onSuccess={refetch} />
            </div>
            <TepDinhKemList
              tepList={tepList}
              onDelete={(maTep) => setDeleteTarget(maTep)}
            />
          </div>

          {/* Cập nhật trạng thái */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif-heading text-xl font-semibold text-slate-900 mb-1">
              Cập nhật trạng thái
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Hiện tại: <StatusBadge status={hoSo.trangThai} />
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="trangThai" className="block text-sm font-medium text-slate-700 mb-1">
                  Trạng thái mới
                </label>
                <select
                  id="trangThai"
                  value={newTrangThai}
                  onChange={(e) => setNewTrangThai(e.target.value as TrangThaiHoSo)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                  {TRANG_THAI_OPTIONS.map((tt) => (
                    <option key={tt} value={tt}>
                      {TRANG_THAI_MAP[tt].label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ghiChuUpdate" className="block text-sm font-medium text-slate-700 mb-1">
                  Ghi chú <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="ghiChuUpdate"
                  rows={3}
                  value={ghiChuUpdate}
                  onChange={(e) => {
                    setGhiChuUpdate(e.target.value);
                    setGhiChuError(null);
                  }}
                  placeholder="Nhập ghi chú (bắt buộc, 5-500 ký tự)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-200"
                />
                {ghiChuError && <p className="mt-1 text-xs text-red-600">{ghiChuError}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!hasChanges || updating}
                  onClick={handleUpdateTrangThai}
                  className="inline-flex items-center rounded-lg bg-[#A51C30] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#A51C30] focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
              {updateError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                  {updateError}
                </div>
              )}
            </div>
          </div>

          {/* Lịch sử cập nhật */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif-heading text-xl font-semibold text-slate-900 mb-4">
              Lịch sử cập nhật
            </h3>
            <UpdateHistoryTimeline maHoSo={id!} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Xóa tệp đính kèm"
        message="Bạn có chắc chắn muốn xóa tệp đính kèm này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
