import type { Request, Response } from "express";
import {
  namTuyenSinh,
  dotTuyenSinh,
  nganhDangKy,
  heDaoTao,
} from "../services/danh-muc.service.js";
import { toHttpStatus } from "../domain/errors.js";

function sendError(res: Response, err: unknown, fallback: string) {
  const { status, message } = toHttpStatus(err);
  res.status(status).json({ error: message || fallback });
}

// ============================================
// NamTuyenSinh
// ============================================
export const layDanhSachNamTuyenSinhHandler = async (_req: Request, res: Response) => {
  try {
    res.json(await namTuyenSinh.findAll());
  } catch (err) {
    sendError(res, err, "Lỗi lấy danh sách năm tuyển sinh");
  }
};

export const themNamTuyenSinhHandler = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await namTuyenSinh.create(req.body));
  } catch (err) {
    sendError(res, err, "Lỗi thêm năm tuyển sinh");
  }
};

export const capNhatNamTuyenSinhHandler = async (req: Request, res: Response) => {
  try {
    res.json(await namTuyenSinh.update(Number(req.params.id), req.body));
  } catch (err) {
    sendError(res, err, "Lỗi cập nhật năm tuyển sinh");
  }
};

export const xoaNamTuyenSinhHandler = async (req: Request, res: Response) => {
  try {
    await namTuyenSinh.delete(Number(req.params.id));
    res.json({ message: "Đã xóa năm tuyển sinh" });
  } catch (err) {
    sendError(res, err, "Lỗi xóa năm tuyển sinh");
  }
};

// ============================================
// DotTuyenSinh
// ============================================
export const layDanhSachDotTuyenSinhHandler = async (_req: Request, res: Response) => {
  try {
    res.json(await dotTuyenSinh.findAll());
  } catch (err) {
    sendError(res, err, "Lỗi lấy danh sách đợt tuyển sinh");
  }
};

export const themDotTuyenSinhHandler = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await dotTuyenSinh.create(req.body));
  } catch (err) {
    sendError(res, err, "Lỗi thêm đợt tuyển sinh");
  }
};

export const capNhatDotTuyenSinhHandler = async (req: Request, res: Response) => {
  try {
    res.json(await dotTuyenSinh.update(Number(req.params.id), req.body));
  } catch (err) {
    sendError(res, err, "Lỗi cập nhật đợt tuyển sinh");
  }
};

export const xoaDotTuyenSinhHandler = async (req: Request, res: Response) => {
  try {
    await dotTuyenSinh.delete(Number(req.params.id));
    res.json({ message: "Đã xóa đợt tuyển sinh" });
  } catch (err) {
    sendError(res, err, "Lỗi xóa đợt tuyển sinh");
  }
};

// ============================================
// NganhDangKy
// ============================================
export const layDanhSachNganhDangKyHandler = async (_req: Request, res: Response) => {
  try {
    res.json(await nganhDangKy.findAll());
  } catch (err) {
    sendError(res, err, "Lỗi lấy danh sách ngành đăng ký");
  }
};

export const themNganhDangKyHandler = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await nganhDangKy.create(req.body));
  } catch (err) {
    sendError(res, err, "Lỗi thêm ngành đăng ký");
  }
};

export const capNhatNganhDangKyHandler = async (req: Request, res: Response) => {
  try {
    res.json(await nganhDangKy.update(Number(req.params.id), req.body));
  } catch (err) {
    sendError(res, err, "Lỗi cập nhật ngành đăng ký");
  }
};

export const xoaNganhDangKyHandler = async (req: Request, res: Response) => {
  try {
    await nganhDangKy.delete(Number(req.params.id));
    res.json({ message: "Đã xóa ngành đăng ký" });
  } catch (err) {
    sendError(res, err, "Lỗi xóa ngành đăng ký");
  }
};

// ============================================
// HeDaoTao
// ============================================
export const layDanhSachHeDaoTaoHandler = async (_req: Request, res: Response) => {
  try {
    res.json(await heDaoTao.findAll());
  } catch (err) {
    sendError(res, err, "Lỗi lấy danh sách hệ đào tạo");
  }
};

export const themHeDaoTaoHandler = async (req: Request, res: Response) => {
  try {
    res.status(201).json(await heDaoTao.create(req.body));
  } catch (err) {
    sendError(res, err, "Lỗi thêm hệ đào tạo");
  }
};

export const capNhatHeDaoTaoHandler = async (req: Request, res: Response) => {
  try {
    res.json(await heDaoTao.update(Number(req.params.id), req.body));
  } catch (err) {
    sendError(res, err, "Lỗi cập nhật hệ đào tạo");
  }
};

export const xoaHeDaoTaoHandler = async (req: Request, res: Response) => {
  try {
    await heDaoTao.delete(Number(req.params.id));
    res.json({ message: "Đã xóa hệ đào tạo" });
  } catch (err) {
    sendError(res, err, "Lỗi xóa hệ đào tạo");
  }
};
