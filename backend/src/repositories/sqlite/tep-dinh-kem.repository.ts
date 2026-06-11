import { randomUUID } from "crypto";
import { getDb } from "./client.js";
import { logQuery, logQueryError } from "../../logger.js";
import type { TepDinhKem } from "../../domain/entities.js";
import type {
  ITepDinhKemRepository,
  CreateTepDinhKemInput,
} from "../interfaces.js";

export class SqliteTepDinhKemRepository implements ITepDinhKemRepository {
  async findById(maTep: string): Promise<TepDinhKem | null> {
    logQuery("SqliteTepDinhKemRepository", "findById", { maTep });
    try {
      return (
        (getDb()
          .prepare("SELECT * FROM TepDinhKem WHERE maTep = ?")
          .get(maTep) as TepDinhKem) || null
      );
    } catch (err) {
      logQueryError("SqliteTepDinhKemRepository", "findById", err);
      throw err;
    }
  }

  async findByHoSo(maHoSo: string): Promise<TepDinhKem[]> {
    logQuery("SqliteTepDinhKemRepository", "findByHoSo", { maHoSo });
    try {
      return getDb()
        .prepare("SELECT * FROM TepDinhKem WHERE maHoSo = ?")
        .all(maHoSo) as TepDinhKem[];
    } catch (err) {
      logQueryError("SqliteTepDinhKemRepository", "findByHoSo", err);
      throw err;
    }
  }

  async create(data: CreateTepDinhKemInput): Promise<TepDinhKem> {
    logQuery("SqliteTepDinhKemRepository", "create", { data });
    try {
      const maTep = randomUUID();
      getDb()
        .prepare(
          "INSERT INTO TepDinhKem (maTep, maHoSo, tenTep, duongDan, loaiTep) VALUES (?, ?, ?, ?, ?)"
        )
        .run(maTep, data.maHoSo, data.tenTep, data.duongDan, data.loaiTep);
      return { maTep, ...data };
    } catch (err) {
      logQueryError("SqliteTepDinhKemRepository", "create", err);
      throw err;
    }
  }

  async delete(maTep: string): Promise<void> {
    logQuery("SqliteTepDinhKemRepository", "delete", { maTep });
    try {
      getDb().prepare("DELETE FROM TepDinhKem WHERE maTep = ?").run(maTep);
    } catch (err) {
      logQueryError("SqliteTepDinhKemRepository", "delete", err);
      throw err;
    }
  }
}
