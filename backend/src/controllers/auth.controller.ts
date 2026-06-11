import type { Request, Response } from "express";
import {
  dangNhap,
  lamMoiToken,
  dangXuat,
  layThongTinUser,
} from "../services/auth.service.js";
import { toHttpStatus } from "../domain/errors.js";

function sendError(res: Response, err: unknown, fallback: string) {
  const { status, message } = toHttpStatus(err);
  res.status(status).json({ error: message || fallback });
}

export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { tenDangNhap, matKhau } = req.body;
    res.json(
      await dangNhap(tenDangNhap, matKhau, { requestId: req.id as string })
    );
  } catch (err) {
    sendError(res, err, "Lỗi đăng nhập");
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    res.json(
      await lamMoiToken(refreshToken, { requestId: req.id as string })
    );
  } catch (err) {
    sendError(res, err, "Lỗi làm mới token");
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    await dangXuat(refreshToken, {
      requestId: req.id as string,
      taiKhoanId: req.user?.id,
    });
    res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    sendError(res, err, "Lỗi đăng xuất");
  }
};

export const meHandler = async (req: Request, res: Response) => {
  try {
    res.json(await layThongTinUser(req.user!.id));
  } catch (err) {
    sendError(res, err, "Lỗi lấy thông tin người dùng");
  }
};

