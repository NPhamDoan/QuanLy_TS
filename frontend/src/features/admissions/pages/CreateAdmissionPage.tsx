import { useNavigate } from 'react-router-dom';
import HoSoForm from '../components/HoSoForm';

export default function CreateAdmissionPage() {
  const navigate = useNavigate();

  const handleSuccess = (maHoSo: string) => {
    navigate(`/ho-so/${maHoSo}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Tạo hồ sơ tuyển sinh
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl">
          Nhập thông tin sinh viên và hồ sơ tuyển sinh để tạo bản ghi mới.
          Các trường có dấu <span className="text-[#A51C30]">*</span> là bắt buộc.
        </p>
      </div>

      <HoSoForm onSuccess={handleSuccess} />
    </div>
  );
}
