export interface User {
  id: number;
  tenDangNhap: string;
  hoTen: string;
  vaiTro: 'admin' | 'staff';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (tenDangNhap: string, matKhau: string) => Promise<void>;
  logout: () => Promise<void>;
}
