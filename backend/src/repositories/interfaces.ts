/**
 * Repository interfaces — contracts cho tầng data access.
 * Tất cả methods async để support cả SQLite (sync) và Supabase (async).
 * Implementations throw DomainError (NotFoundError, ConflictError, v.v.).
 */

import type {
  TaiKhoan,
  TaiKhoanPublic,
  VaiTro,
  TrangThaiTaiKhoan,
  RefreshToken,
  RefreshTokenWithUser,
  NamTuyenSinh,
  DotTuyenSinh,
  NganhDangKy,
  HeDaoTao,
  TrangThaiDanhMuc,
  SinhVien,
  HoSoTuyenSinh,
  HoSoTuyenSinhView,
  HoSoFilter,
  HoSoThongKe,
  TrangThaiHoSo,
  TepDinhKem,
  LichSuCapNhat,
  LichSuCapNhatView,
} from "../domain/entities.js";

// ============================================
// TaiKhoan
// ============================================
export interface CreateTaiKhoanInput {
  tenDangNhap: string;
  matKhauHash: string;
  hoTen: string;
  vaiTro: VaiTro;
}

export interface UpdateTaiKhoanInput {
  hoTen?: string;
  vaiTro?: VaiTro;
}

export interface ITaiKhoanRepository {
  findAll(): Promise<TaiKhoanPublic[]>;
  findById(id: number): Promise<TaiKhoan | null>;
  findByTenDangNhap(tenDangNhap: string): Promise<TaiKhoan | null>;
  count(): Promise<number>;
  create(data: CreateTaiKhoanInput): Promise<TaiKhoanPublic>;
  update(id: number, data: UpdateTaiKhoanInput): Promise<TaiKhoanPublic>;
  updateMatKhau(id: number, matKhauHash: string): Promise<void>;
  updateTrangThai(id: number, trangThai: TrangThaiTaiKhoan): Promise<TaiKhoanPublic>;
}

// ============================================
// RefreshToken
// ============================================
export interface IRefreshTokenRepository {
  create(taiKhoanId: number, tokenHash: string, hetHan: string): Promise<void>;
  findByHash(tokenHash: string): Promise<RefreshTokenWithUser | null>;
  deleteById(id: number): Promise<void>;
  deleteByHash(tokenHash: string): Promise<void>;
  deleteAllByTaiKhoanId(taiKhoanId: number): Promise<void>;
}

// ============================================
// Catalog (shared shape cho 4 loại danh mục)
// ============================================
export interface ICatalogRepository<T, CreateT, UpdateT> {
  findAll(): Promise<T[]>;
  findAllActive(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: CreateT): Promise<T>;
  update(id: number, data: UpdateT): Promise<T>;
  delete(id: number): Promise<void>;
}

export type INamTuyenSinhRepository = ICatalogRepository<
  NamTuyenSinh,
  { nam: string; trangThai?: TrangThaiDanhMuc },
  { nam?: string; trangThai?: TrangThaiDanhMuc }
>;

export type IDotTuyenSinhRepository = ICatalogRepository<
  DotTuyenSinh,
  { tenDot: string; namTuyenSinhId: number; trangThai?: TrangThaiDanhMuc },
  { tenDot?: string; namTuyenSinhId?: number; trangThai?: TrangThaiDanhMuc }
>;

export type INganhDangKyRepository = ICatalogRepository<
  NganhDangKy,
  { tenNganh: string; maNganh: string; trangThai?: TrangThaiDanhMuc },
  { tenNganh?: string; maNganh?: string; trangThai?: TrangThaiDanhMuc }
>;

export type IHeDaoTaoRepository = ICatalogRepository<
  HeDaoTao,
  { tenHe: string; trangThai?: TrangThaiDanhMuc },
  { tenHe?: string; trangThai?: TrangThaiDanhMuc }
>;

// ============================================
// SinhVien
// ============================================
export interface CreateSinhVienInput {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  cccd: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
}

export interface ISinhVienRepository {
  findById(maSinhVien: string): Promise<SinhVien | null>;
  create(data: CreateSinhVienInput): Promise<SinhVien>;
  updateAvatar(maSinhVien: string, anhDaiDien: string | null): Promise<void>;
}

// ============================================
// HoSoTuyenSinh
// ============================================
export interface CreateHoSoInput {
  maSinhVien: string;
  namTuyenSinhId: number;
  dotTuyenSinhId: number;
  nganhDangKyId: number;
  heDaoTaoId: number;
  ghiChu?: string | null;
}

export interface IHoSoTuyenSinhRepository {
  findAll(filters: HoSoFilter): Promise<HoSoTuyenSinhView[]>;
  findById(maHoSo: string): Promise<HoSoTuyenSinhView | null>;
  findRawById(maHoSo: string): Promise<HoSoTuyenSinh | null>;
  create(data: CreateHoSoInput): Promise<HoSoTuyenSinhView>;
  updateTrangThai(
    maHoSo: string,
    trangThai: TrangThaiHoSo,
    ghiChu: string | null
  ): Promise<HoSoTuyenSinhView>;
  thongKe(): Promise<HoSoThongKe>;
}

// ============================================
// TepDinhKem
// ============================================
export interface CreateTepDinhKemInput {
  maHoSo: string;
  tenTep: string;
  duongDan: string;
  loaiTep: string;
}

export interface ITepDinhKemRepository {
  findById(maTep: string): Promise<TepDinhKem | null>;
  findByHoSo(maHoSo: string): Promise<TepDinhKem[]>;
  create(data: CreateTepDinhKemInput): Promise<TepDinhKem>;
  delete(maTep: string): Promise<void>;
}

// ============================================
// LichSuCapNhat
// ============================================
export interface CreateLichSuInput {
  maHoSo: string;
  trangThaiCu: TrangThaiHoSo;
  trangThaiMoi: TrangThaiHoSo;
  ghiChu: string;
  nguoiThucHienId: number;
}

export interface CapNhatTrangThaiInput {
  maHoSo: string;
  trangThaiCu: TrangThaiHoSo;
  trangThaiMoi: TrangThaiHoSo;
  ghiChu: string;
  nguoiThucHienId: number;
}

export interface ILichSuCapNhatRepository {
  findByMaHoSo(maHoSo: string): Promise<LichSuCapNhatView[]>;
  create(data: CreateLichSuInput): Promise<LichSuCapNhat>;
  /** Atomic: cập nhật trạng thái hồ sơ + ghi lịch sử trong 1 transaction */
  capNhatTrangThaiVaGhiLichSu(data: CapNhatTrangThaiInput): Promise<void>;
}
