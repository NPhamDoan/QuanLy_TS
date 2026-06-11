import axiosClient from "./axiosClient";
import type { TrangThaiHoSo } from "../features/admissions/types";

// ===== Sinh viên =====

export interface SinhVienPayload {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: string;
  cccd: string;
  email: string;
  soDienThoai: string;
  diaChi: string;
}

export const taoSinhVien = (data: SinhVienPayload) =>
  axiosClient.post("/sinhvien", data);

export const laySinhVien = (maSinhVien: string) =>
  axiosClient.get(`/sinhvien/${maSinhVien}`);

// ===== Hồ sơ tuyển sinh =====

export interface HoSoPayload {
  maSinhVien: string;
  namTuyenSinhId: number;
  dotTuyenSinhId: number;
  nganhDangKyId: number;
  heDaoTaoId: number;
  ghiChu?: string;
}

export interface HoSoFilter {
  trangThai?: string;
  nganhDangKyId?: number;
  dotTuyenSinhId?: number;
  namTuyenSinhId?: number;
}

export const taoHoSo = (data: HoSoPayload) =>
  axiosClient.post("/ho-so", data);

export const layDanhSachHoSo = (filters?: HoSoFilter) =>
  axiosClient.get("/ho-so", { params: filters });

export const layHoSoTheoId = (maHoSo: string) =>
  axiosClient.get(`/ho-so/${maHoSo}`);

export const capNhatTrangThai = (
  maHoSo: string,
  trangThai: string,
  ghiChu?: string
) => axiosClient.patch(`/ho-so/${maHoSo}/trang-thai`, { trangThai, ghiChu });

export const layThongKeHoSo = () =>
  axiosClient.get("/ho-so/thong-ke");

// ===== Tệp đính kèm =====

export const uploadTepDinhKem = (maHoSo: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("maHoSo", maHoSo);
  return axiosClient.post("/tep-dinh-kem/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const layTepTheoHoSo = (maHoSo: string) =>
  axiosClient.get(`/tep-dinh-kem/ho-so/${maHoSo}`);

export const xoaTepDinhKem = (maTep: string) =>
  axiosClient.delete(`/tep-dinh-kem/${maTep}`);

// ===== Lịch sử cập nhật =====

export interface LichSuCapNhatItem {
  id: string;
  trangThaiCu: TrangThaiHoSo;
  trangThaiMoi: TrangThaiHoSo;
  ghiChu: string;
  nguoiThucHien: string;
  thoiGian: string;
}

export const getLichSuCapNhat = (maHoSo: string): Promise<LichSuCapNhatItem[]> =>
  axiosClient.get(`/ho-so/${maHoSo}/lich-su`).then(r => r.data);
