import { repos } from "../repositories/index.js";
import type { CreateSinhVienInput } from "../repositories/interfaces.js";

export const taoSinhVien = (data: CreateSinhVienInput) =>
  repos.sinhVien.create(data);

export const laySinhVien = (maSinhVien: string) =>
  repos.sinhVien.findById(maSinhVien);

export const capNhatAvatar = (maSinhVien: string, anhDaiDien: string | null) =>
  repos.sinhVien.updateAvatar(maSinhVien, anhDaiDien);
