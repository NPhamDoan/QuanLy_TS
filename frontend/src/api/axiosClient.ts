import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  removeTokens,
} from './tokenStore';

const axiosClient = axios.create({
  // baseURL trống = dùng cùng origin với trang. Hợp lý cho deploy production
  // (FE+BE chung 1 service Render). Khi dev, Vite proxy đẩy các path API sang
  // backend port 3000 (xem `vite.config.ts`). Nếu cần override (ví dụ FE/BE
  // tách 2 service), set `VITE_API_URL` lúc build.
  baseURL: import.meta.env.VITE_API_URL || "",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach access token
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto refresh on 401 "Token đã hết hạn"
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401
      && error.response?.data?.error === 'Token đã hết hạn'
      && !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const { data } = await axiosClient.post('/auth/refresh', { refreshToken });
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(originalRequest);
      } catch {
        removeTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
