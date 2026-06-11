import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../services/auth.service.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Yêu cầu xác thực" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      tenDangNhap: string;
      hoTen: string;
      vaiTro: "admin" | "staff";
    };

    req.user = {
      id: decoded.id,
      tenDangNhap: decoded.tenDangNhap,
      hoTen: decoded.hoTen,
      vaiTro: decoded.vaiTro,
    };

    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token đã hết hạn" });
      return;
    }
    res.status(401).json({ error: "Token không hợp lệ" });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.vaiTro !== "admin") {
    res.status(403).json({ error: "Không có quyền truy cập" });
    return;
  }

  next();
};
