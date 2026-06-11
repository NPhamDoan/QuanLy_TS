export interface TaiKhoanRow {
  id: number;
  tenDangNhap: string;
  hoTen: string;
  vaiTro: 'admin' | 'staff';
  trangThai: 'hoat_dong' | 'vo_hieu_hoa';
  ngayTao: string;
}

export interface CatalogItem {
  id: number;
  trangThai: 'hoat_dong' | 'khong_hoat_dong';
  [key: string]: unknown;
}

export interface TaoTaiKhoanPayload {
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  vaiTro: 'admin' | 'staff';
}

export interface CapNhatTaiKhoanPayload {
  hoTen?: string;
  vaiTro?: 'admin' | 'staff';
}

export interface NamTuyenSinhItem extends CatalogItem {
  nam: string;
}

export interface DotTuyenSinhItem extends CatalogItem {
  tenDot: string;
  namTuyenSinhId: number;
  namTuyenSinh?: string;
}

export interface NganhDangKyItem extends CatalogItem {
  tenNganh: string;
  maNganh: string;
}

export interface HeDaoTaoItem extends CatalogItem {
  tenHe: string;
}
