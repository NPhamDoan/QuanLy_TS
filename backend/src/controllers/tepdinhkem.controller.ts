import type { Request, Response } from "express";
import fs from "fs";
import {
  layDanhSachTepTheoHoSo,
  themTepDinhKem,
  xoaTepDinhKem,
  layTepTheoId,
} from "../services/tepdinhkem.service.js";
import { toHttpStatus } from "../domain/errors.js";
import { privateDir } from "../utils/storage.js";
import { safeJoin } from "../utils/path-safe.js";

function sendError(res: Response, err: unknown, fallback: string) {
  const { status, message } = toHttpStatus(err);
  res.status(status).json({ error: message || fallback });
}

export const uploadTepHandler = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Không có tệp nào được tải lên" });
    }
    const { maHoSo } = req.body;
    if (!maHoSo) {
      return res.status(400).json({ error: "Thiếu mã hồ sơ" });
    }
    const tep = await themTepDinhKem({
      maHoSo,
      tenTep: file.originalname,
      duongDan: `/private/${file.filename}`,
      loaiTep: file.mimetype,
    });
    res.status(201).json(tep);
  } catch (err) {
    sendError(res, err, "Không thể tải lên tệp đính kèm");
  }
};

export const layTepTheoHoSoHandler = async (req: Request, res: Response) => {
  try {
    const maHoSo = req.params.maHoSo;
    if (typeof maHoSo !== "string") {
      return res.status(400).json({ error: "Mã hồ sơ không hợp lệ" });
    }
    res.json(await layDanhSachTepTheoHoSo(maHoSo));
  } catch (err) {
    sendError(res, err, "Không thể lấy danh sách tệp");
  }
};

export const xoaTepHandler = async (req: Request, res: Response) => {
  try {
    const maTep = req.params.maTep;
    if (typeof maTep !== "string") {
      return res.status(400).json({ error: "Mã tệp không hợp lệ" });
    }
    res.json(await xoaTepDinhKem(maTep));
  } catch (err) {
    sendError(res, err, "Không thể xóa tệp");
  }
};

export const downloadTepHandler = async (req: Request, res: Response) => {
  try {
    const maTep = req.params.maTep;
    if (typeof maTep !== "string") {
      return res.status(400).json({ error: "Mã tệp không hợp lệ" });
    }

    const tep = await layTepTheoId(maTep);
    if (!tep) {
      return res.status(404).json({ error: "Không tìm thấy tệp đính kèm" });
    }

    // duongDan stored as "/private/filename.ext" — strip prefix then
    // validate boundary via safeJoin. Using path.basename alone neutralizes
    // traversal patterns (basename("/private/../../../etc/passwd") = "passwd")
    // and would mask the bug condition; we want safeJoin to actually reject
    // any duongDan that escapes privateDir.
    const PRIVATE_PREFIX = "/private/";
    if (!tep.duongDan.startsWith(PRIVATE_PREFIX)) {
      return res.status(404).json({ error: "Không tìm thấy tệp đính kèm" });
    }
    const filename = tep.duongDan.slice(PRIVATE_PREFIX.length);
    const absolutePath = safeJoin(privateDir, filename);
    if (!absolutePath) {
      return res.status(404).json({ error: "Không tìm thấy tệp đính kèm" });
    }

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "File không tồn tại trên server" });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(tep.tenTep)}"`);
    res.sendFile(absolutePath);
  } catch (err) {
    sendError(res, err, "Không thể tải tệp");
  }
};
