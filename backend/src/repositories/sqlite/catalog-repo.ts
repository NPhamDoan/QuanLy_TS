/**
 * Generic SQLite catalog repository builder.
 *
 * 4 catalog (NamTuyenSinh / DotTuyenSinh / NganhDangKy / HeDaoTao) chia
 * sẻ pattern findAll / findAllActive / findById / create / update / delete.
 * Helper này trừu tượng template SQL + log + error map; mỗi catalog chỉ
 * cần khai báo config khác (tên bảng, cột writable, ORDER BY, thông báo
 * lỗi).
 *
 * INVARIANTS giữ nguyên hành vi của các implementation cũ:
 * - INSERT auto-set ngayTao, ngayCapNhat = now ISO.
 * - UPDATE auto-set ngayCapNhat = now ISO; nếu input không có cột nào,
 *   không phát query UPDATE (giữ behavior cũ).
 * - trangThai default = 'hoat_dong' nếu input thiếu (chỉ khi create).
 * - delete kiểm tồn tại trước, throw NotFoundError nếu không có.
 * - Mọi method log qua pino: logQuery / logQueryError.
 */
import { getDb } from "./client.js";
import { runWithErrorMap } from "./error-map.js";
import { logQuery, logQueryError } from "../../logger.js";
import { NotFoundError } from "../../domain/errors.js";
import type { ICatalogRepository } from "../interfaces.js";

export interface SqliteCatalogConfig {
  /** Tên class log (vd "SqliteNamTuyenSinhRepository"). */
  className: string;
  /** Tên thực thể tiếng Việt cho NotFoundError (vd "năm tuyển sinh"). */
  notFoundEntity: string;
  /** Tên bảng cho INSERT/UPDATE/DELETE (DML chỉ trên 1 bảng). */
  tableName: string;

  /** SELECT columns clause (vd "*" hoặc "d.*, n.nam AS namTuyenSinh"). */
  selectColumns: string;
  /**
   * FROM clause (KHÔNG gồm từ khoá `FROM`).
   * Vd "NamTuyenSinh" hoặc "DotTuyenSinh d JOIN NamTuyenSinh n ON d.namTuyenSinhId = n.id".
   */
  selectFrom: string;
  /** Cột id cho SELECT (vd "id" hoặc "d.id"). */
  idColumn: string;
  /** Cột trangThai để filter active (vd "trangThai" hoặc "d.trangThai"). */
  trangThaiColumn: string;
  /** ORDER BY clause (KHÔNG gồm từ khoá `ORDER BY`). */
  orderBy: string;

  /** Cột cho INSERT/UPDATE — KHÔNG bao gồm id, ngayTao, ngayCapNhat. */
  writableColumns: string[];
  /** Cột nhận default 'hoat_dong' khi create thiếu input. Default "trangThai". */
  trangThaiDefaultColumn?: string;

  conflictMessage: string;
  foreignKeyMessage: string;
}

export function makeSqliteCatalogRepo<T, CreateInput, UpdateInput>(
  config: SqliteCatalogConfig
): ICatalogRepository<T, CreateInput, UpdateInput> {
  const cls = config.className;
  const trangThaiDefaultCol =
    config.trangThaiDefaultColumn ?? "trangThai";

  async function findAll(): Promise<T[]> {
    logQuery(cls, "findAll", {});
    try {
      const sql =
        `SELECT ${config.selectColumns} FROM ${config.selectFrom} ` +
        `ORDER BY ${config.orderBy}`;
      return getDb().prepare(sql).all() as T[];
    } catch (err) {
      logQueryError(cls, "findAll", err);
      throw err;
    }
  }

  async function findAllActive(): Promise<T[]> {
    logQuery(cls, "findAllActive", {});
    try {
      const sql =
        `SELECT ${config.selectColumns} FROM ${config.selectFrom} ` +
        `WHERE ${config.trangThaiColumn} = 'hoat_dong' ` +
        `ORDER BY ${config.orderBy}`;
      return getDb().prepare(sql).all() as T[];
    } catch (err) {
      logQueryError(cls, "findAllActive", err);
      throw err;
    }
  }

  async function findById(id: number): Promise<T | null> {
    logQuery(cls, "findById", { id });
    try {
      const sql =
        `SELECT ${config.selectColumns} FROM ${config.selectFrom} ` +
        `WHERE ${config.idColumn} = ?`;
      const row = getDb().prepare(sql).get(id) as T | undefined;
      return row ?? null;
    } catch (err) {
      logQueryError(cls, "findById", err);
      throw err;
    }
  }

  async function create(data: CreateInput): Promise<T> {
    logQuery(cls, "create", { data });
    try {
      const now = new Date().toISOString();
      const cols = [...config.writableColumns, "ngayTao", "ngayCapNhat"];
      const values: unknown[] = config.writableColumns.map((col) => {
        const v = (data as Record<string, unknown>)[col];
        if (v === undefined && col === trangThaiDefaultCol) return "hoat_dong";
        return v;
      });
      values.push(now, now);

      const placeholders = cols.map(() => "?").join(", ");
      const result = runWithErrorMap(
        () =>
          getDb()
            .prepare(
              `INSERT INTO ${config.tableName} (${cols.join(", ")}) VALUES (${placeholders})`
            )
            .run(...(values as unknown[] as never[])),
        { conflict: config.conflictMessage }
      );
      return (await findById(Number(result.lastInsertRowid)))!;
    } catch (err) {
      logQueryError(cls, "create", err);
      throw err;
    }
  }

  async function update(id: number, data: UpdateInput): Promise<T> {
    logQuery(cls, "update", { id, data });
    try {
      const existing = await findById(id);
      if (!existing) throw new NotFoundError(config.notFoundEntity);

      const fields: string[] = [];
      const values: unknown[] = [];
      for (const col of config.writableColumns) {
        const v = (data as Record<string, unknown>)[col];
        if (v !== undefined) {
          fields.push(`${col} = ?`);
          values.push(v);
        }
      }

      if (fields.length > 0) {
        fields.push("ngayCapNhat = ?");
        values.push(new Date().toISOString());
        values.push(id);
        runWithErrorMap(
          () =>
            getDb()
              .prepare(
                `UPDATE ${config.tableName} SET ${fields.join(", ")} WHERE id = ?`
              )
              .run(...(values as unknown[] as never[])),
          { conflict: config.conflictMessage }
        );
      }
      return (await findById(id))!;
    } catch (err) {
      logQueryError(cls, "update", err);
      throw err;
    }
  }

  async function deleteOne(id: number): Promise<void> {
    logQuery(cls, "delete", { id });
    try {
      const existing = await findById(id);
      if (!existing) throw new NotFoundError(config.notFoundEntity);
      runWithErrorMap(
        () =>
          getDb()
            .prepare(`DELETE FROM ${config.tableName} WHERE id = ?`)
            .run(id),
        { foreignKey: config.foreignKeyMessage }
      );
    } catch (err) {
      logQueryError(cls, "delete", err);
      throw err;
    }
  }

  return {
    findAll,
    findAllActive,
    findById,
    create,
    update,
    delete: deleteOne,
  };
}
