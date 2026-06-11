/**
 * Catalog repositories cho SQLite — 4 thực thể quản trị danh mục.
 *
 * Mỗi class là một thin wrapper: ủy quyền toàn bộ method cho
 * `makeSqliteCatalogRepo` với config riêng (tên bảng, cột, ORDER BY,
 * thông báo lỗi). Pattern findAll/findAllActive/findById/create/update/
 * delete được dùng chung — xem `catalog-repo.ts`.
 */
import { makeSqliteCatalogRepo } from "./catalog-repo.js";
import type {
  NamTuyenSinh,
  DotTuyenSinh,
  NganhDangKy,
  HeDaoTao,
  TrangThaiDanhMuc,
} from "../../domain/entities.js";
import type {
  INamTuyenSinhRepository,
  IDotTuyenSinhRepository,
  INganhDangKyRepository,
  IHeDaoTaoRepository,
} from "../interfaces.js";

// ============================================
// NamTuyenSinh
// ============================================
export class SqliteNamTuyenSinhRepository implements INamTuyenSinhRepository {
  private impl = makeSqliteCatalogRepo<
    NamTuyenSinh,
    { nam: string; trangThai?: TrangThaiDanhMuc },
    { nam?: string; trangThai?: TrangThaiDanhMuc }
  >({
    className: "SqliteNamTuyenSinhRepository",
    notFoundEntity: "năm tuyển sinh",
    tableName: "NamTuyenSinh",
    selectColumns: "*",
    selectFrom: "NamTuyenSinh",
    idColumn: "id",
    trangThaiColumn: "trangThai",
    orderBy: "nam DESC",
    writableColumns: ["nam", "trangThai"],
    conflictMessage: "Năm tuyển sinh đã tồn tại",
    foreignKeyMessage: "Không thể xóa năm tuyển sinh đang được sử dụng",
  });

  findAll = () => this.impl.findAll();
  findAllActive = () => this.impl.findAllActive();
  findById = (id: number) => this.impl.findById(id);
  create = (data: { nam: string; trangThai?: TrangThaiDanhMuc }) =>
    this.impl.create(data);
  update = (
    id: number,
    data: { nam?: string; trangThai?: TrangThaiDanhMuc }
  ) => this.impl.update(id, data);
  delete = (id: number) => this.impl.delete(id);
}

// ============================================
// DotTuyenSinh — JOIN với NamTuyenSinh để lấy `namTuyenSinh` (tên năm)
// ============================================
export class SqliteDotTuyenSinhRepository implements IDotTuyenSinhRepository {
  private impl = makeSqliteCatalogRepo<
    DotTuyenSinh,
    { tenDot: string; namTuyenSinhId: number; trangThai?: TrangThaiDanhMuc },
    {
      tenDot?: string;
      namTuyenSinhId?: number;
      trangThai?: TrangThaiDanhMuc;
    }
  >({
    className: "SqliteDotTuyenSinhRepository",
    notFoundEntity: "đợt tuyển sinh",
    tableName: "DotTuyenSinh",
    // SELECT JOIN — alias bảng để khớp idColumn / trangThaiColumn ở dưới.
    selectColumns: "d.*, n.nam AS namTuyenSinh",
    selectFrom: "DotTuyenSinh d JOIN NamTuyenSinh n ON d.namTuyenSinhId = n.id",
    idColumn: "d.id",
    trangThaiColumn: "d.trangThai",
    orderBy: "n.nam DESC, d.tenDot ASC",
    writableColumns: ["tenDot", "namTuyenSinhId", "trangThai"],
    conflictMessage: "Đợt tuyển sinh đã tồn tại trong năm này",
    foreignKeyMessage: "Không thể xóa đợt tuyển sinh đang được sử dụng",
  });

  findAll = () => this.impl.findAll();
  findAllActive = () => this.impl.findAllActive();
  findById = (id: number) => this.impl.findById(id);
  create = (data: {
    tenDot: string;
    namTuyenSinhId: number;
    trangThai?: TrangThaiDanhMuc;
  }) => this.impl.create(data);
  update = (
    id: number,
    data: {
      tenDot?: string;
      namTuyenSinhId?: number;
      trangThai?: TrangThaiDanhMuc;
    }
  ) => this.impl.update(id, data);
  delete = (id: number) => this.impl.delete(id);
}

// ============================================
// NganhDangKy
// ============================================
export class SqliteNganhDangKyRepository implements INganhDangKyRepository {
  private impl = makeSqliteCatalogRepo<
    NganhDangKy,
    { tenNganh: string; maNganh: string; trangThai?: TrangThaiDanhMuc },
    { tenNganh?: string; maNganh?: string; trangThai?: TrangThaiDanhMuc }
  >({
    className: "SqliteNganhDangKyRepository",
    notFoundEntity: "ngành đăng ký",
    tableName: "NganhDangKy",
    selectColumns: "*",
    selectFrom: "NganhDangKy",
    idColumn: "id",
    trangThaiColumn: "trangThai",
    orderBy: "tenNganh ASC",
    writableColumns: ["tenNganh", "maNganh", "trangThai"],
    conflictMessage: "Mã ngành đã tồn tại",
    foreignKeyMessage: "Không thể xóa ngành đăng ký đang được sử dụng",
  });

  findAll = () => this.impl.findAll();
  findAllActive = () => this.impl.findAllActive();
  findById = (id: number) => this.impl.findById(id);
  create = (data: {
    tenNganh: string;
    maNganh: string;
    trangThai?: TrangThaiDanhMuc;
  }) => this.impl.create(data);
  update = (
    id: number,
    data: {
      tenNganh?: string;
      maNganh?: string;
      trangThai?: TrangThaiDanhMuc;
    }
  ) => this.impl.update(id, data);
  delete = (id: number) => this.impl.delete(id);
}

// ============================================
// HeDaoTao
// ============================================
export class SqliteHeDaoTaoRepository implements IHeDaoTaoRepository {
  private impl = makeSqliteCatalogRepo<
    HeDaoTao,
    { tenHe: string; trangThai?: TrangThaiDanhMuc },
    { tenHe?: string; trangThai?: TrangThaiDanhMuc }
  >({
    className: "SqliteHeDaoTaoRepository",
    notFoundEntity: "hệ đào tạo",
    tableName: "HeDaoTao",
    selectColumns: "*",
    selectFrom: "HeDaoTao",
    idColumn: "id",
    trangThaiColumn: "trangThai",
    orderBy: "tenHe ASC",
    writableColumns: ["tenHe", "trangThai"],
    conflictMessage: "Hệ đào tạo đã tồn tại",
    foreignKeyMessage: "Không thể xóa hệ đào tạo đang được sử dụng",
  });

  findAll = () => this.impl.findAll();
  findAllActive = () => this.impl.findAllActive();
  findById = (id: number) => this.impl.findById(id);
  create = (data: { tenHe: string; trangThai?: TrangThaiDanhMuc }) =>
    this.impl.create(data);
  update = (
    id: number,
    data: { tenHe?: string; trangThai?: TrangThaiDanhMuc }
  ) => this.impl.update(id, data);
  delete = (id: number) => this.impl.delete(id);
}
