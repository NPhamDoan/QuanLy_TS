import { repos } from "../repositories/index.js";
import type {
  HoSoFilter,
  HoSoTuyenSinhView,
  LichSuCapNhatView,
  TrangThaiHoSo,
} from "../domain/entities.js";
import { NotFoundError, ValidationError } from "../domain/errors.js";
import type { CreateHoSoInput } from "../repositories/interfaces.js";

export const taoHoSo = (data: CreateHoSoInput) => repos.hoSo.create(data);

export const layDanhSachHoSo = (filters: HoSoFilter) =>
  repos.hoSo.findAll(filters);

export const layHoSoTheoId = (maHoSo: string) => repos.hoSo.findById(maHoSo);

export const capNhatTrangThai = async (
  maHoSo: string,
  trangThai: TrangThaiHoSo,
  ghiChu: string,
  nguoiThucHienId: number
): Promise<HoSoTuyenSinhView> => {
  // 1. Lấy trạng thái hiện tại
  const hoSo = await repos.hoSo.findRawById(maHoSo);
  if (!hoSo) throw new NotFoundError("hồ sơ");

  // 2. Reject nếu trạng thái không thay đổi
  if (hoSo.trangThai === trangThai) {
    throw new ValidationError("Trạng thái mới phải khác trạng thái hiện tại");
  }

  // 3. Atomic: cập nhật trạng thái + ghi lịch sử (trong 1 transaction)
  await repos.lichSu.capNhatTrangThaiVaGhiLichSu({
    maHoSo,
    trangThaiCu: hoSo.trangThai,
    trangThaiMoi: trangThai,
    ghiChu,
    nguoiThucHienId,
  });

  return (await repos.hoSo.findById(maHoSo))!;
};

export const layThongKe = () => repos.hoSo.thongKe();

export const layLichSu = async (maHoSo: string): Promise<LichSuCapNhatView[]> => {
  // Check hồ sơ tồn tại
  const hoSo = await repos.hoSo.findRawById(maHoSo);
  if (!hoSo) throw new NotFoundError("hồ sơ");

  // Trả về danh sách lịch sử
  return repos.lichSu.findByMaHoSo(maHoSo);
};
