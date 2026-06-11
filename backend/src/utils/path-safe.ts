import path from "path";

/**
 * Helper tập trung kiểm tra ranh giới filesystem cho các luồng upload /
 * download / unlink dựa trên dữ liệu do người dùng kiểm soát.
 *
 * Spec: `.kiro/specs/path-traversal-fix/design.md`
 *   - Bug condition: null byte, absolute path, hoặc resolved escape ra ngoài
 *     baseDir (so sánh prefix có separator để tránh false-positive như
 *     "/uploads-evil" match "/uploads").
 *   - safeJoin là dạng "constructive" của predicate isBugCondition: trả về
 *     `null` khi vi phạm, hoặc trả về `path.resolve(baseDir, userPath)` khi
 *     hợp lệ.
 *
 * Single source of truth — các handler / service KHÔNG được tự ghép path
 * bằng `path.join` rồi kiểm tra adhoc; phải dùng helper này.
 */

/**
 * Ghép `baseDir` với `userPath` an toàn theo bug condition đã định nghĩa
 * trong design.
 *
 * @returns absolute path đã resolve nếu `userPath` nằm trong `baseDir`;
 *          `null` nếu vi phạm (null byte, absolute, hoặc escape baseDir).
 */
export function safeJoin(baseDir: string, userPath: string): string | null {
  // 1. Null byte → luôn reject (CWE-158: bypass extension check, hành vi
  //    không xác định khi truyền vào fs API).
  if (userPath.includes("\0")) {
    return null;
  }

  // 2. Absolute path → luôn reject. `path.resolve(baseDir, userPath)`
  //    không neo về `baseDir` khi `userPath` là absolute, nó sẽ trả về
  //    chính `userPath` (sau resolve) → bypass baseDir hoàn toàn.
  //
  //    Trên Windows process, `path.isAbsolute("/etc/passwd")` trả `true`
  //    nhưng `path.posix.isAbsolute` mới thực sự bắt POSIX-style absolute
  //    nếu môi trường là POSIX. Kiểm tra cả ba để cross-platform an toàn:
  //    bắt drive letter ("C:\..."), UNC ("\\\\server\\..."), root POSIX ("/...").
  if (
    path.isAbsolute(userPath) ||
    path.win32.isAbsolute(userPath) ||
    path.posix.isAbsolute(userPath)
  ) {
    return null;
  }

  // 3. Resolve và kiểm tra prefix có separator. So sánh `===` cho case
  //    `userPath = ""` hoặc `"."` (resolve về chính baseDir → coi như
  //    nằm trong); còn lại yêu cầu prefix `baseDir + path.sep` để tránh
  //    false-positive như `/uploads-evil` match `/uploads`.
  const resolvedBase = path.resolve(baseDir);
  const resolved = path.resolve(baseDir, userPath);

  if (resolved === resolvedBase) {
    return resolved;
  }
  if (resolved.startsWith(resolvedBase + path.sep)) {
    return resolved;
  }
  return null;
}

/**
 * Whitelist extension hợp lệ cho upload private (`POST /tep-dinh-kem/upload`).
 *
 * Lưu trữ ở dạng lowercase có dấu chấm để khớp với output của
 * `path.extname(originalname).toLowerCase()`.
 *
 * Cố ý loại bỏ các extension nguy hiểm: `.exe`, `.bat`, `.cmd`, `.sh`,
 * `.ps1`, `.html`, `.htm`, `.js`, `.mjs`, `.cjs`, `.php`, `.jsp`, `.asp`,
 * `.aspx`, `.svg` (chứa script), và file không có extension.
 */
export const ALLOWED_PRIVATE_UPLOAD_EXTENSIONS: ReadonlySet<string> = new Set([
  // Documents
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
  ".odt",
  ".ods",
  // Images
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  // Archives
  ".zip",
  ".rar",
  ".7z",
]);

/**
 * Kiểm tra `originalname` (multer file.originalname) có extension nằm trong
 * whitelist hay không.
 *
 * - Reject ngay nếu chứa null byte (cùng quy tắc với `safeJoin`).
 * - So sánh case-insensitive (lowercase trước khi tra Set).
 * - File không có extension → false (không cho upload "note", "image"...).
 */
export function isExtensionAllowed(originalname: string): boolean {
  if (originalname.includes("\0")) {
    return false;
  }
  const ext = path.extname(originalname).toLowerCase();
  return ext !== "" && ALLOWED_PRIVATE_UPLOAD_EXTENSIONS.has(ext);
}
