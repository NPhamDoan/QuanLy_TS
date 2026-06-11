import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Đường tương đối giữa các route API hiện có và backend dev server.
// Chỉ dùng cho dev mode (Vite proxy). Production deploy chung 1 service
// nên frontend gọi cùng origin, không cần proxy.
const API_PREFIXES = [
  '/auth',
  '/admin',
  '/danh-muc',
  '/sinhvien',
  '/ho-so',
  '/tep-dinh-kem',
  '/uploads',
]

const proxyTarget = process.env.VITE_DEV_API_TARGET || 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: Object.fromEntries(
      API_PREFIXES.map((prefix) => [
        prefix,
        { target: proxyTarget, changeOrigin: true },
      ])
    ),
  },
})
