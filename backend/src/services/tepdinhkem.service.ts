import fs from "fs";
import { repos } from "../repositories/index.js";
import { logger } from "../logger.js";
import { privateDir } from "../utils/storage.js";
import { safeJoin } from "../utils/path-safe.js";
import type { CreateTepDinhKemInput } from "../repositories/interfaces.js";

export const themTepDinhKem = (data: CreateTepDinhKemInput) =>
  repos.tepDinhKem.create(data);

export const layDanhSachTepTheoHoSo = (maHoSo: string) =>
  repos.tepDinhKem.findByHoSo(maHoSo);

export const layTepTheoId = (maTep: string) =>
  repos.tepDinhKem.findById(maTep);

/**
 * Xóa tệp đính kèm: xóa DB row và xóa file vật lý trên disk.
 *
 * Quy trình:
 *  1. Lấy `duongDan` TRƯỚC khi xóa DB row.
 *  2. Xóa DB row (luôn ưu tiên consistency của DB).
 *  3. Best-effort xóa file vật lý — nếu fail (ENOENT / permission), log
 *     warning nhưng không throw vì DB đã update xong.
 *
 * Idempotent: nếu maTep không tồn tại trong DB, hàm return success
 * (không throw NotFoundError) — match hành vi cũ.
 */
export const xoaTepDinhKem = async (maTep: string) => {
  const tep = await repos.tepDinhKem.findById(maTep);

  await repos.tepDinhKem.delete(maTep);

  if (tep) {
    // duongDan stored as "/private/<filename>" — strip prefix then validate
    // boundary via safeJoin. Using path.basename alone neutralizes traversal
    // payloads (basename("/private/../../../etc/passwd") = "passwd") and
    // would let an unsafe duongDan escape the bug condition; we want
    // safeJoin to actually reject any duongDan that doesn't live inside
    // privateDir. If the prefix is missing, treat as unsafe (skip unlink
    // + warn).
    const PRIVATE_PREFIX = "/private/";
    const filename = tep.duongDan.startsWith(PRIVATE_PREFIX)
      ? tep.duongDan.slice(PRIVATE_PREFIX.length)
      : tep.duongDan;
    const absolutePath = tep.duongDan.startsWith(PRIVATE_PREFIX)
      ? safeJoin(privateDir, filename)
      : null;

    if (!absolutePath) {
      logger.warn(
        { maTep, filename },
        "tepdinhkem.unlink_skipped_unsafe_path"
      );
    } else {
      try {
        await fs.promises.unlink(absolutePath);
      } catch (err) {
        const e = err as NodeJS.ErrnoException;
        // ENOENT = file đã không tồn tại — coi như đã xóa, im lặng.
        if (e.code !== "ENOENT") {
          logger.warn(
            { maTep, filename, errMessage: e.message },
            "tepdinhkem.unlink_failed"
          );
        }
      }
    }
  }

  return { success: true, maTep };
};
