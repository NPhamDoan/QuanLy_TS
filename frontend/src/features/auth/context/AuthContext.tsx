import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axiosClient from '../../../api/axiosClient';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeTokens,
} from '../../../api/tokenStore';
import type { User, LoginResponse, AuthContextValue } from '../types';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!getAccessToken();

  const login = useCallback(async (tenDangNhap: string, matKhau: string) => {
    const { data } = await axiosClient.post<LoginResponse>('/auth/login', { tenDangNhap, matKhau });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await axiosClient.post('/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore logout errors — clear local state regardless
    }
    removeTokens();
    setUser(null);
    window.location.href = '/login';
  }, []);

  // On app startup: check refreshToken → refresh accessToken → get user info
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: refreshData } = await axiosClient.post<{ accessToken: string }>(
          '/auth/refresh',
          { refreshToken }
        );
        setAccessToken(refreshData.accessToken);

        const { data: userData } = await axiosClient.get<User>('/auth/me');
        setUser(userData);
      } catch {
        removeTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value: AuthContextValue = {
    user,
    accessToken: getAccessToken(),
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
