declare namespace Express {
  interface Request {
    user?: {
      id: number;
      tenDangNhap: string;
      hoTen: string;
      vaiTro: 'admin' | 'staff';
    };
  }
}
