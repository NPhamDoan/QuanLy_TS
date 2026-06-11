/**
 * Catalog repositories cho Supabase — 4 thực thể quản trị danh mục.
 * Pattern y hệt SQLite: thin wrapper delegate sang `makeSupabaseCatalogRepo`.
 */
import { makeSupabaseCatalogRepo } from "./catalog-repo.js";
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
export class SupabaseNamTuyenSinhRepository
  implements INamTuyenSinhRepository
{
  private impl = makeSupabaseCatalogRepo<
    NamTuyenSinh,
    { nam: string; trangThai?: TrangThaiDanhMuc },
    { nam?: string; trangThai?: TrangThaiDanhMuc }
  >({
    className: "SupabaseNamTuyenSinhRepository",
    notFoundEntity: "năm tuyển sinh",
    tableName: "NamTuyenSinh",
    selectClause: "*",
    orders: [{ column: "nam", ascending: false }],
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
// DotTuyenSinh — embed NamTuyenSinh.nam, flatten thành `namTuyenSinh`
// ============================================
const DOT_SELECT_WITH_NAM = "*, NamTuyenSinh:namTuyenSinhId (nam)";

interface RawDotTuyenSinhRow {
  id: number;
  tenDot: string;
  namTuyenSinhId: number;
  NamTuyenSinh?: { nam: string };
  trangThai: TrangThaiDanhMuc;
  ngayTao: string;
  ngayCapNhat: string;
}

function flattenDot(row: RawDotTuyenSinhRow): DotTuyenSinh {
  return {
    id: row.id,
    tenDot: row.tenDot,
    namTuyenSinhId: row.namTuyenSinhId,
    namTuyenSinh: row.NamTuyenSinh?.nam,
    trangThai: row.trangThai,
    ngayTao: row.ngayTao,
    ngayCapNhat: row.ngayCapNhat,
  };
}

export class SupabaseDotTuyenSinhRepository
  implements IDotTuyenSinhRepository
{
  private impl = makeSupabaseCatalogRepo<
    DotTuyenSinh,
    { tenDot: string; namTuyenSinhId: number; trangThai?: TrangThaiDanhMuc },
    {
      tenDot?: string;
      namTuyenSinhId?: number;
      trangThai?: TrangThaiDanhMuc;
    },
    RawDotTuyenSinhRow
  >({
    className: "SupabaseDotTuyenSinhRepository",
    notFoundEntity: "đợt tuyển sinh",
    tableName: "DotTuyenSinh",
    selectClause: DOT_SELECT_WITH_NAM,
    orders: [{ column: "tenDot" }],
    writableColumns: ["tenDot", "namTuyenSinhId", "trangThai"],
    flatten: flattenDot,
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
export class SupabaseNganhDangKyRepository implements INganhDangKyRepository {
  private impl = makeSupabaseCatalogRepo<
    NganhDangKy,
    { tenNganh: string; maNganh: string; trangThai?: TrangThaiDanhMuc },
    { tenNganh?: string; maNganh?: string; trangThai?: TrangThaiDanhMuc }
  >({
    className: "SupabaseNganhDangKyRepository",
    notFoundEntity: "ngành đăng ký",
    tableName: "NganhDangKy",
    selectClause: "*",
    orders: [{ column: "tenNganh" }],
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
export class SupabaseHeDaoTaoRepository implements IHeDaoTaoRepository {
  private impl = makeSupabaseCatalogRepo<
    HeDaoTao,
    { tenHe: string; trangThai?: TrangThaiDanhMuc },
    { tenHe?: string; trangThai?: TrangThaiDanhMuc }
  >({
    className: "SupabaseHeDaoTaoRepository",
    notFoundEntity: "hệ đào tạo",
    tableName: "HeDaoTao",
    selectClause: "*",
    orders: [{ column: "tenHe" }],
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
