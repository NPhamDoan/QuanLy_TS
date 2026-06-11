import type { Request, Response } from "express";
import fs from "fs";
import { taoSinhVien, laySinhVien, capNhatAvatar } from "../services/sinhvien.service.js";
import { toHttpStatus } from "../domain/errors.js";
import { publicDir } from "../utils/storage.js";
import { safeJoin } from "../utils/path-safe.js";
import { logger } from "../logger.js";

function sendError(res: Response, err: unknown, fallback: string) {
  const { status, message } = toHttpStatus(err);
  res.status(status).json({ error: message || fallback });
}

export const taoSinhVienHandler = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await taoSinhVien(req.body));
  } catch (err) {
    sendError(res, err, "Không thể tạo sinh viên");
  }
};

export const laySinhVienHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }
    const sv = await laySinhVien(id);
    if (!sv) {
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }
    res.json(sv);
  } catch (err) {
    sendError(res, err, "Không thể lấy sinh viên");
  }
};

export const uploadAvatarHandler = async (req: Request, res: Response) => {
  try {
    const maSinhVien = req.params.maSinhVien as string;

    // Kiểm tra sinh viên tồn tại
    const sv = await laySinhVien(maSinhVien);
    if (!sv) {
      // Xóa file vừa upload nếu SV không tồn tại
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Không tìm thấy sinh viên" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Không có file ảnh được upload" });
    }

    // Xóa avatar cũ nếu có. Dùng safeJoin để chặn path traversal:
    // anhDaiDien lưu dưới dạng "avatars/<uuid>.<ext>" — nếu giá trị này bị
    // tampered (chứa "..", absolute path, null byte) thì safeJoin trả null,
    // ta bỏ qua bước unlink (best-effort) + ghi warn, KHÔNG được unlinkSync
    // path ngoài publicDir.
    if (sv.anhDaiDien) {
      const oldPath = safeJoin(publicDir, sv.anhDaiDien);
      if (oldPath && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      } else if (!oldPath) {
        logger.warn(
          { maSinhVien, anhDaiDien: sv.anhDaiDien },
          "sinhvien.avatar_old_skipped_unsafe_path"
        );
      }
    }

    // Lưu đường dẫn relative
    const relativePath = `avatars/${req.file.filename}`;
    await capNhatAvatar(maSinhVien, relativePath);

    res.json({ anhDaiDien: relativePath });
  } catch (err) {
    sendError(res, err, "Không thể upload avatar");
  }
};



