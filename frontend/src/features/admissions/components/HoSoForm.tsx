import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Check, User, FileCheck, CircleCheck, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useCreateHoSo } from '../hooks/useCreateHoSo';
import { validateField, validateForm } from '../utils/validation';
import { layDanhMuc } from '../../../api/admin.api';
import axiosClient from '../../../api/axiosClient';
import type { FormErrors } from '../types';
import type {
  NamTuyenSinhItem,
  DotTuyenSinhItem,
  NganhDangKyItem,
  HeDaoTaoItem,
} from '../../admin/types';

interface HoSoFormProps {
  onSuccess: (maHoSo: string) => void;
}

const INITIAL_FORM = {
  hoTen: '',
  ngaySinh: '',
  gioiTinh: '',
  cccd: '',
  email: '',
  soDienThoai: '',
  diaChi: '',
  namTuyenSinhId: '',
  dotTuyenSinhId: '',
  nganhDangKyId: '',
  heDaoTaoId: '',
  ghiChu: '',
};

const SINHVIEN_FIELDS = [
  'hoTen', 'ngaySinh', 'gioiTinh', 'cccd', 'email', 'soDienThoai', 'diaChi',
] as const;

const HOSO_FIELDS = [
  'namTuyenSinhId', 'dotTuyenSinhId', 'nganhDangKyId', 'heDaoTaoId',
] as const;

export default function HoSoForm({ onSuccess }: HoSoFormProps) {
  const [formData, setFormData] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // wizard state
  const { submit, loading } = useCreateHoSo();
  const formRef = useRef<HTMLFormElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [namTuyenSinhList, setNamTuyenSinhList] = useState<NamTuyenSinhItem[]>([]);
  const [dotTuyenSinhList, setDotTuyenSinhList] = useState<DotTuyenSinhItem[]>([]);
  const [nganhDangKyList, setNganhDangKyList] = useState<NganhDangKyItem[]>([]);
  const [heDaoTaoList, setHeDaoTaoList] = useState<HeDaoTaoItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchCatalogs() {
      setCatalogLoading(true);
      setCatalogError(null);
      try {
        const [nam, dot, nganh, he] = await Promise.all([
          layDanhMuc('nam-tuyen-sinh'),
          layDanhMuc('dot-tuyen-sinh'),
          layDanhMuc('nganh-dang-ky'),
          layDanhMuc('he-dao-tao'),
        ]);
        if (!cancelled) {
          setNamTuyenSinhList(nam);
          setDotTuyenSinhList(dot);
          setNganhDangKyList(nganh);
          setHeDaoTaoList(he);
        }
      } catch {
        if (!cancelled) setCatalogError('Không thể tải danh mục. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    }
    fetchCatalogs();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Đổi năm tuyển sinh → reset đợt tuyển sinh (vì đợt phụ thuộc năm)
      if (name === 'namTuyenSinhId') {
        next.dotTuyenSinhId = '';
      }
      return next;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'ghiChu') return;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /** Validate các field thuộc step hiện tại. Trả về true nếu hợp lệ. */
  const validateStep = (currentStep: 1 | 2): boolean => {
    const fields = currentStep === 1 ? SINHVIEN_FIELDS : HOSO_FIELDS;
    const stepErrors: FormErrors = {};
    for (const f of fields) {
      const err = validateField(f, formData[f]);
      if (err) stepErrors[f] = err;
    }
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(1)) {
      setStep(2);
      scrollToTop();
    } else {
      // Scroll tới lỗi đầu tiên
      const firstErrorField = SINHVIEN_FIELDS.find((f) => validateField(f, formData[f]));
      if (firstErrorField && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstErrorField}"]`);
        (el as HTMLElement)?.focus();
      }
    }
  };

  const handleBack = () => {
    setStep(1);
    scrollToTop();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate toàn bộ form trước khi submit
    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      // Nếu có lỗi ở step 1, quay lại step 1
      const hasSinhVienError = SINHVIEN_FIELDS.some((f) => formErrors[f]);
      if (hasSinhVienError) {
        setStep(1);
        scrollToTop();
      }
      return;
    }

    try {
      const maHoSo = await submit(
        {
          hoTen: formData.hoTen,
          ngaySinh: formData.ngaySinh,
          gioiTinh: formData.gioiTinh,
          cccd: formData.cccd,
          email: formData.email,
          soDienThoai: formData.soDienThoai,
          diaChi: formData.diaChi,
        },
        {
          namTuyenSinhId: Number(formData.namTuyenSinhId),
          dotTuyenSinhId: Number(formData.dotTuyenSinhId),
          nganhDangKyId: Number(formData.nganhDangKyId),
          heDaoTaoId: Number(formData.heDaoTaoId),
          ghiChu: formData.ghiChu || undefined,
        }
      );

      // Upload avatar nếu user đã chọn ảnh
      if (avatarFile && maHoSo) {
        try {
          // Lấy maSinhVien từ response (cần gọi API lấy hồ sơ)
          const { data: hoSoData } = await axiosClient.get(`/ho-so/${maHoSo}`);
          if (hoSoData?.maSinhVien) {
            const fd = new FormData();
            fd.append('avatar', avatarFile);
            await axiosClient.post(`/sinhvien/${hoSoData.maSinhVien}/avatar`, fd, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          }
        } catch {
          // Avatar upload thất bại không block flow chính
        }
      }

      onSuccess(maHoSo);
    } catch {
      setServerError('Đã xảy ra lỗi khi tạo hồ sơ. Vui lòng thử lại.');
    }
  };

  // Trạng thái mỗi section (để stepper hiển thị check)
  const sinhvienDone = SINHVIEN_FIELDS.every(
    (f) => formData[f].trim() !== '' && !validateField(f, formData[f])
  );
  const hoSoDone = HOSO_FIELDS.every((f) => formData[f] !== '');

  const fieldClass = (name: string) =>
    `w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A51C30] ${
      errors[name] ? 'border-red-400 focus:ring-red-400' : 'border-slate-300'
    }`;

  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  if (catalogLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="h-6 w-6 animate-spin text-[#A51C30]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="ml-2 text-sm text-slate-600">Đang tải danh mục...</span>
      </div>
    );
  }

  if (catalogError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {catalogError}
        <button onClick={() => window.location.reload()} className="ml-2 underline hover:no-underline">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ==== Stepper ==== */}
      <Stepper
        currentStep={step === 1 ? 1 : sinhvienDone && hoSoDone ? 3 : 2}
        sinhvienDone={sinhvienDone}
        hoSoDone={hoSoDone}
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8"
      >
        {/* ============= STEP 1: Thông tin sinh viên ============= */}
        {step === 1 && (
          <section>
            <h2 className="font-serif-heading text-2xl font-semibold text-slate-900 pb-3 border-b border-slate-200">
              Thông tin sinh viên
            </h2>

            {/* Avatar upload */}
            <div className="mt-5 flex flex-col items-center">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="relative group w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden hover:border-[#A51C30] transition-colors"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#A51C30]" />
                )}
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Chọn ảnh</span>
                </div>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <p className="mt-2 text-xs text-slate-500">Ảnh Sinh Viên (tùy chọn)</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="hoTen" className={labelClass}>
                  Họ và tên <span className="text-[#A51C30]">*</span>
                </label>
                <input
                  id="hoTen" name="hoTen" type="text"
                  value={formData.hoTen} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('hoTen')} placeholder="Nguyễn Văn A"
                />
                {errors.hoTen && <p className="mt-1 text-xs text-red-500">{errors.hoTen}</p>}
              </div>
              <div>
                <label htmlFor="ngaySinh" className={labelClass}>
                  Ngày sinh <span className="text-[#A51C30]">*</span>
                </label>
                <input
                  id="ngaySinh" name="ngaySinh" type="date"
                  value={formData.ngaySinh} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('ngaySinh')}
                />
                {errors.ngaySinh && <p className="mt-1 text-xs text-red-500">{errors.ngaySinh}</p>}
              </div>
              <div>
                <label htmlFor="gioiTinh" className={labelClass}>
                  Giới tính <span className="text-[#A51C30]">*</span>
                </label>
                <select
                  id="gioiTinh" name="gioiTinh"
                  value={formData.gioiTinh} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('gioiTinh')}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                {errors.gioiTinh && <p className="mt-1 text-xs text-red-500">{errors.gioiTinh}</p>}
              </div>
              <div>
                <label htmlFor="cccd" className={labelClass}>
                  Số CCCD <span className="text-[#A51C30]">*</span>
                </label>
                <input
                  id="cccd" name="cccd" type="text"
                  value={formData.cccd} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('cccd')} placeholder="012345678901" maxLength={12}
                />
                {errors.cccd && <p className="mt-1 text-xs text-red-500">{errors.cccd}</p>}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-[#A51C30]">*</span>
                </label>
                <input
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('email')} placeholder="email@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="soDienThoai" className={labelClass}>
                  Số điện thoại <span className="text-[#A51C30]">*</span>
                </label>
                <input
                  id="soDienThoai" name="soDienThoai" type="tel"
                  value={formData.soDienThoai} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('soDienThoai')} placeholder="0901234567"
                />
                {errors.soDienThoai && <p className="mt-1 text-xs text-red-500">{errors.soDienThoai}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="diaChi" className={labelClass}>
                  Địa chỉ <span className="text-[#A51C30]">*</span>
                </label>
                <textarea
                  id="diaChi" name="diaChi"
                  value={formData.diaChi} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('diaChi')} rows={2}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
                {errors.diaChi && <p className="mt-1 text-xs text-red-500">{errors.diaChi}</p>}
              </div>
            </div>
          </section>
        )}

        {/* ============= STEP 2: Thông tin hồ sơ ============= */}
        {step === 2 && (
          <section>
            <h2 className="font-serif-heading text-2xl font-semibold text-slate-900 pb-3 border-b border-slate-200">
              Thông tin hồ sơ
            </h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="namTuyenSinhId" className={labelClass}>
                  Năm tuyển sinh <span className="text-[#A51C30]">*</span>
                </label>
                <select
                  id="namTuyenSinhId" name="namTuyenSinhId"
                  value={formData.namTuyenSinhId} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('namTuyenSinhId')}
                >
                  <option value="">-- Chọn năm --</option>
                  {namTuyenSinhList.map((item) => (
                    <option key={item.id} value={item.id}>{item.nam}</option>
                  ))}
                </select>
                {errors.namTuyenSinhId && <p className="mt-1 text-xs text-red-500">{errors.namTuyenSinhId}</p>}
              </div>
              <div>
                <label htmlFor="dotTuyenSinhId" className={labelClass}>
                  Đợt tuyển sinh <span className="text-[#A51C30]">*</span>
                </label>
                <select
                  id="dotTuyenSinhId" name="dotTuyenSinhId"
                  value={formData.dotTuyenSinhId} onChange={handleChange} onBlur={handleBlur}
                  disabled={!formData.namTuyenSinhId}
                  className={`${fieldClass('dotTuyenSinhId')} disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {formData.namTuyenSinhId ? '-- Chọn đợt --' : '-- Vui lòng chọn năm trước --'}
                  </option>
                  {dotTuyenSinhList
                    .filter((item) =>
                      formData.namTuyenSinhId
                        ? item.namTuyenSinhId === Number(formData.namTuyenSinhId)
                        : false
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>{item.tenDot}</option>
                    ))}
                </select>
                {errors.dotTuyenSinhId && <p className="mt-1 text-xs text-red-500">{errors.dotTuyenSinhId}</p>}
              </div>
              <div>
                <label htmlFor="nganhDangKyId" className={labelClass}>
                  Ngành đăng ký <span className="text-[#A51C30]">*</span>
                </label>
                <select
                  id="nganhDangKyId" name="nganhDangKyId"
                  value={formData.nganhDangKyId} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('nganhDangKyId')}
                >
                  <option value="">-- Chọn ngành --</option>
                  {nganhDangKyList.map((item) => (
                    <option key={item.id} value={item.id}>{item.tenNganh}</option>
                  ))}
                </select>
                {errors.nganhDangKyId && <p className="mt-1 text-xs text-red-500">{errors.nganhDangKyId}</p>}
              </div>
              <div>
                <label htmlFor="heDaoTaoId" className={labelClass}>
                  Hệ đào tạo <span className="text-[#A51C30]">*</span>
                </label>
                <select
                  id="heDaoTaoId" name="heDaoTaoId"
                  value={formData.heDaoTaoId} onChange={handleChange} onBlur={handleBlur}
                  className={fieldClass('heDaoTaoId')}
                >
                  <option value="">-- Chọn hệ --</option>
                  {heDaoTaoList.map((item) => (
                    <option key={item.id} value={item.id}>{item.tenHe}</option>
                  ))}
                </select>
                {errors.heDaoTaoId && <p className="mt-1 text-xs text-red-500">{errors.heDaoTaoId}</p>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="ghiChu" className={labelClass}>Ghi chú</label>
                <textarea
                  id="ghiChu" name="ghiChu"
                  value={formData.ghiChu} onChange={handleChange}
                  className={fieldClass('ghiChu')} rows={3}
                  placeholder="Ghi chú thêm (không bắt buộc)"
                />
              </div>
            </div>
          </section>
        )}

        {/* Server error */}
        {serverError && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {/* ============= Actions ============= */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-200">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setFormData({ ...INITIAL_FORM })}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              Xóa form
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#A51C30] px-5 py-2.5 text-sm font-medium text-[#A51C30] hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ChevronLeft className="w-4 h-4" />
              Quay lại
            </button>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A51C30] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#8b1827] focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2 transition-colors"
            >
              Tiếp tục
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#A51C30] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#8b1827] focus:outline-none focus:ring-2 focus:ring-[#A51C30] focus:ring-offset-2 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Đang xử lý...' : 'Tạo hồ sơ'}
            </button>
          )}
        </div>
      </form>
    </>
  );
}

/* =========================================================
   Horizontal stepper — visual indicator
   ========================================================= */
interface StepperProps {
  currentStep: number;
  sinhvienDone: boolean;
  hoSoDone: boolean;
}

function Stepper({ currentStep, sinhvienDone, hoSoDone }: StepperProps) {
  const steps = [
    { id: 1, label: 'Thông tin sinh viên', icon: User, done: sinhvienDone },
    { id: 2, label: 'Thông tin hồ sơ', icon: FileCheck, done: hoSoDone },
    { id: 3, label: 'Hoàn tất', icon: CircleCheck, done: false },
  ];

  return (
    <nav aria-label="Tiến độ nhập liệu" className="mb-8">
      <ol className="flex items-start justify-between gap-2 max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.done && step.id < currentStep;
          const Icon = step.icon;

          return (
            <li key={step.id} className="flex-1 flex flex-col items-center relative">
              {idx < steps.length - 1 && (
                <span
                  className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${
                    isCompleted ? 'bg-[#A51C30]' : 'bg-slate-200'
                  }`}
                  aria-hidden="true"
                />
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                  isCompleted
                    ? 'bg-[#A51C30] text-white'
                    : isCurrent
                      ? 'bg-white text-[#A51C30] ring-2 ring-[#A51C30]'
                      : 'bg-white text-slate-400 border border-slate-300'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              <span
                className={`mt-2 text-xs sm:text-sm font-medium text-center ${
                  isCurrent
                    ? 'text-[#A51C30]'
                    : isCompleted
                      ? 'text-slate-900'
                      : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
