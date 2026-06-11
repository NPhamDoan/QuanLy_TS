// Trạng thái hồ sơ — dùng xuyên suốt ứng dụng
export type TrangThaiHoSo = 'moi_nop' | 'dang_kiem_tra' | 'thieu_giay_to' | 'hoan_tat' | 'tu_choi';

// Response đầy đủ từ API (mở rộng payload)
export interface SinhVien {
  maSinhVien: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  cccd: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
  anhDaiDien: string | null;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface HoSoTuyenSinh {
  maHoSo: string;
  maSinhVien: string;
  namTuyenSinhId: number;
  dotTuyenSinhId: number;
  nganhDangKyId: number;
  heDaoTaoId: number;
  namTuyenSinh: string;      // JOIN display name
  dotTuyenSinh: string;      // JOIN display name
  nganhDangKy: string;       // JOIN display name
  heDaoTao: string;          // JOIN display name
  hoTen: string;             // JOIN from SinhVien
  trangThai: TrangThaiHoSo;
  ghiChu: string | null;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface TepDinhKem {
  maTep: string;
  maHoSo: string;
  tenTep: string;
  duongDan: string;
  loaiTep: string;
}

// Dashboard stats (tính từ client)
export interface DashboardStats {
  total: number;
  moiNop: number;
  dangKiemTra: number;
  hoanTat: number;
  tuChoi: number;
}

// Form validation errors
export interface FormErrors {
  [fieldName: string]: string | undefined;
}

// Validation rules cho form tạo hồ sơ
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  message: string;
}

// Mapping trạng thái → hiển thị
export const TRANG_THAI_MAP: Record<TrangThaiHoSo, { label: string; color: string; bgColor: string }> = {
  moi_nop:       { label: 'Mới nộp',       color: 'text-blue-700',    bgColor: 'bg-blue-100' },
  dang_kiem_tra: { label: 'Đang kiểm tra', color: 'text-amber-700',   bgColor: 'bg-amber-100' },
  thieu_giay_to: { label: 'Thiếu giấy tờ', color: 'text-orange-700',  bgColor: 'bg-orange-100' },
  hoan_tat:      { label: 'Hoàn tất',      color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  tu_choi:       { label: 'Từ chối',       color: 'text-red-700',     bgColor: 'bg-red-100' },
};
