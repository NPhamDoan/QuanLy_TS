/**
 * Domain entities — types thuần TypeScript, không phụ thuộc DB implementation.
 * Services và repositories đều dùng các types này.
 */

export type VaiTro = "admin" | "staff";
export type TrangThaiTaiKhoan = "hoat_dong" | "vo_hieu_hoa";
export type TrangThaiDanhMuc = "hoat_dong" | "khong_hoat_dong";
export type TrangThaiHoSo =
  | "moi_nop"
  | "dang_kiem_tra"
  | "thieu_giay_to"
  | "hoan_tat"
  | "tu_choi";

// ---- TaiKhoan ----
export interface TaiKhoan {
  id: number;
  tenDangNhap: string;
  matKhauHash: string;
  hoTen: string;
  vaiTro: VaiTro;
  trangThai: TrangThaiTaiKhoan;
  ngayTao: string;
  ngayCapNhat: string;
}

export type TaiKhoanPublic = Omit<TaiKhoan, "matKhauHash">;

// ---- RefreshToken ----
export interface RefreshToken {
  id: number;
  taiKhoanId: number;
  tokenHash: string;
  hetHan: string;
  ngayTao: string;
}

export interface RefreshTokenWithUser extends RefreshToken {
  tenDangNhap: string;
  hoTen: string;
  vaiTro: VaiTro;
  trangThaiTaiKhoan: TrangThaiTaiKhoan;
}

// ---- Catalogs ----
export interface NamTuyenSinh {
  id: number;
  nam: string;
  trangThai: TrangThaiDanhMuc;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface DotTuyenSinh {
  id: number;
  tenDot: string;
  namTuyenSinhId: number;
  namTuyenSinh?: string; // joined
  trangThai: TrangThaiDanhMuc;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface NganhDangKy {
  id: number;
  tenNganh: string;
  maNganh: string;
  trangThai: TrangThaiDanhMuc;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface HeDaoTao {
  id: number;
  tenHe: string;
  trangThai: TrangThaiDanhMuc;
  ngayTao: string;
  ngayCapNhat: string;
}

// ---- SinhVien ----
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

// ---- HoSoTuyenSinh ----
export interface HoSoTuyenSinh {
  maHoSo: string;
  maSinhVien: string;
  namTuyenSinhId: number;
  dotTuyenSinhId: number;
  nganhDangKyId: number;
  heDaoTaoId: number;
  trangThai: TrangThaiHoSo;
  ghiChu: string | null;
  ngayTao: string;
  ngayCapNhat: string;
}

/** HoSo với tên hiển thị từ JOIN các bảng danh mục + SinhVien. */
export interface HoSoTuyenSinhView extends HoSoTuyenSinh {
  namTuyenSinh: string;
  dotTuyenSinh: string;
  nganhDangKy: string;
  heDaoTao: string;
  hoTen: string;
}

export interface HoSoFilter {
  trangThai?: string;
  namTuyenSinhId?: number;
  dotTuyenSinhId?: number;
  nganhDangKyId?: number;
}

export interface HoSoThongKe {
  total: number;
  moiNop: number;
  dangKiemTra: number;
  thieuGiayTo: number;
  hoanTat: number;
  tuChoi: number;
}

// ---- TepDinhKem ----
export interface TepDinhKem {
  maTep: string;
  maHoSo: string;
  tenTep: string;
  duongDan: string;
  loaiTep: string;
}

// ---- LichSuCapNhat ----
export interface LichSuCapNhat {
  id: string;
  maHoSo: string;
  trangThaiCu: TrangThaiHoSo;
  trangThaiMoi: TrangThaiHoSo;
  ghiChu: string;
  nguoiThucHienId: number;
  thoiGian: string;
}

export interface LichSuCapNhatView {
  id: string;
  maHoSo: string;
  trangThaiCu: TrangThaiHoSo;
  trangThaiMoi: TrangThaiHoSo;
  ghiChu: string;
  nguoiThucHien: string;
  thoiGian: string;
}
