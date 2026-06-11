import axiosClient from './axiosClient';
import type { TaoTaiKhoanPayload, CapNhatTaiKhoanPayload } from '../features/admin/types';

// ===== Quản lý người dùng =====

export const layDanhSachTaiKhoan = () =>
  axiosClient.get('/admin/tai-khoan').then(r => r.data);

export const taoTaiKhoan = (data: TaoTaiKhoanPayload) =>
  axiosClient.post('/admin/tai-khoan', data).then(r => r.data);

export const capNhatTaiKhoan = (id: number, data: CapNhatTaiKhoanPayload) =>
  axiosClient.put(`/admin/tai-khoan/${id}`, data).then(r => r.data);

export const capNhatTrangThaiTaiKhoan = (id: number, trangThai: string) =>
  axiosClient.patch(`/admin/tai-khoan/${id}/trang-thai`, { trangThai }).then(r => r.data);

export const datLaiMatKhauTaiKhoan = (id: number, matKhauMoi: string) =>
  axiosClient.patch(`/admin/tai-khoan/${id}/mat-khau`, { matKhauMoi }).then(r => r.data);

// ===== Admin CRUD danh mục (tất cả loại) =====

export const layDanhSachDanhMucAdmin = (loai: string) =>
  axiosClient.get(`/admin/${loai}`).then(r => r.data);

export const themDanhMuc = (loai: string, data: any) =>
  axiosClient.post(`/admin/${loai}`, data).then(r => r.data);

export const capNhatDanhMuc = (loai: string, id: number, data: any) =>
  axiosClient.put(`/admin/${loai}/${id}`, data).then(r => r.data);

export const xoaDanhMuc = (loai: string, id: number) =>
  axiosClient.delete(`/admin/${loai}/${id}`).then(r => r.data);

// ===== Public catalog (chỉ trả về hoạt động) =====

export const layDanhMuc = (loai: string) =>
  axiosClient.get(`/danh-muc/${loai}`).then(r => r.data);
