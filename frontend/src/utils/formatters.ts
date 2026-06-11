import axios from 'axios';

/**
 * Phân loại lỗi và trả về thông báo lỗi phù hợp cho người dùng.
 * - Lỗi mạng (axios error, không có response): thông báo kiểm tra kết nối
 * - Lỗi server (axios error, có response): dùng message từ server hoặc thông báo mặc định
 * - Lỗi không xác định: thông báo chung
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    }
    const serverMessage = error.response.data?.error;
    if (serverMessage) return serverMessage;
    return 'Đã xảy ra lỗi từ máy chủ.';
  }
  return 'Đã xảy ra lỗi không xác định.';
}

/**
 * Format chuỗi ngày ISO (YYYY-MM-DD hoặc ISO 8601) sang dạng hiển thị DD/MM/YYYY.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
