import { getSupabase } from "./client.js";
import { throwIfError } from "./error-map.js";
import { logQuery, logQueryError } from "../../logger.js";
import type { RefreshTokenWithUser } from "../../domain/entities.js";
import type { IRefreshTokenRepository } from "../interfaces.js";

export class SupabaseRefreshTokenRepository
  implements IRefreshTokenRepository
{
  async create(
    taiKhoanId: number,
    tokenHash: string,
    hetHan: string
  ): Promise<void> {
    logQuery("SupabaseRefreshTokenRepository", "create", {
      taiKhoanId,
      tokenHash,
      hetHan,
    });
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("RefreshToken").insert({
        taiKhoanId,
        tokenHash,
        hetHan,
        ngayTao: new Date().toISOString(),
      });
      if (error) throwIfError(error);
    } catch (err) {
      logQueryError("SupabaseRefreshTokenRepository", "create", err);
      throw err;
    }
  }

  async findByHash(tokenHash: string): Promise<RefreshTokenWithUser | null> {
    logQuery("SupabaseRefreshTokenRepository", "findByHash", { tokenHash });
    try {
      const supabase = getSupabase();
      // JOIN với TaiKhoan qua FK relationship (Supabase tự detect nếu có FK
      // trong schema). Kết quả trả về object lồng `TaiKhoan`.
      const { data, error } = await supabase
        .from("RefreshToken")
        .select(
          `id, taiKhoanId, tokenHash, hetHan, ngayTao,
         TaiKhoan:taiKhoanId (tenDangNhap, hoTen, vaiTro, trangThai)`
        )
        .eq("tokenHash", tokenHash)
        .maybeSingle();
      if (error) throwIfError(error);
      if (!data) return null;

      const user = (data as any).TaiKhoan;
      if (!user) return null;

      return {
        id: (data as any).id,
        taiKhoanId: (data as any).taiKhoanId,
        tokenHash: (data as any).tokenHash,
        hetHan: (data as any).hetHan,
        ngayTao: (data as any).ngayTao,
        tenDangNhap: user.tenDangNhap,
        hoTen: user.hoTen,
        vaiTro: user.vaiTro,
        trangThaiTaiKhoan: user.trangThai,
      };
    } catch (err) {
      logQueryError("SupabaseRefreshTokenRepository", "findByHash", err);
      throw err;
    }
  }

  async deleteById(id: number): Promise<void> {
    logQuery("SupabaseRefreshTokenRepository", "deleteById", { id });
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("RefreshToken")
        .delete()
        .eq("id", id);
      if (error) throwIfError(error);
    } catch (err) {
      logQueryError("SupabaseRefreshTokenRepository", "deleteById", err);
      throw err;
    }
  }

  async deleteByHash(tokenHash: string): Promise<void> {
    logQuery("SupabaseRefreshTokenRepository", "deleteByHash", { tokenHash });
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("RefreshToken")
        .delete()
        .eq("tokenHash", tokenHash);
      if (error) throwIfError(error);
    } catch (err) {
      logQueryError("SupabaseRefreshTokenRepository", "deleteByHash", err);
      throw err;
    }
  }

  async deleteAllByTaiKhoanId(taiKhoanId: number): Promise<void> {
    logQuery("SupabaseRefreshTokenRepository", "deleteAllByTaiKhoanId", {
      taiKhoanId,
    });
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("RefreshToken")
        .delete()
        .eq("taiKhoanId", taiKhoanId);
      if (error) throwIfError(error);
    } catch (err) {
      logQueryError(
        "SupabaseRefreshTokenRepository",
        "deleteAllByTaiKhoanId",
        err
      );
      throw err;
    }
  }
}
