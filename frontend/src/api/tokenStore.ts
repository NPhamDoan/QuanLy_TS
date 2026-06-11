/**
 * Token store — được chia sẻ giữa AuthContext và axiosClient.
 * Access token giữ trong memory (biến module-level).
 * Refresh token giữ trong localStorage để survive reload.
 * Tách module này tránh circular import giữa AuthContext và axiosClient.
 */

let _accessToken: string | null = null;

export const getAccessToken = (): string | null => _accessToken;

export const setAccessToken = (token: string | null): void => {
  _accessToken = token;
};

export const getRefreshToken = (): string | null =>
  localStorage.getItem('refreshToken');

export const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token);
};

export const removeTokens = (): void => {
  _accessToken = null;
  localStorage.removeItem('refreshToken');
};
