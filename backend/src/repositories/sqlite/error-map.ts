import { ConflictError, ForeignKeyError } from "../../domain/errors.js";

interface ErrorMessages {
  conflict?: string;
  foreignKey?: string;
}

/**
 * Map lỗi từ better-sqlite3 → DomainError.
 *
 * better-sqlite3 throw Error với message format:
 *   "UNIQUE constraint failed: Table.column"
 *   "FOREIGN KEY constraint failed"
 */
export function mapSqliteError(err: unknown, messages: ErrorMessages): Error {
  const msg = (err as any)?.message;
  if (typeof msg !== "string") return err as Error;

  if (msg.includes("UNIQUE constraint failed")) {
    return new ConflictError(messages.conflict || "Dữ liệu đã tồn tại");
  }
  if (msg.includes("FOREIGN KEY constraint failed")) {
    return new ForeignKeyError(
      messages.foreignKey || "Không thể thực hiện do ràng buộc khóa ngoại"
    );
  }
  return err as Error;
}

/**
 * Chạy một SQLite operation và re-throw lỗi đã được map sang DomainError.
 */
export function runWithErrorMap<T>(
  operation: () => T,
  messages: ErrorMessages
): T {
  try {
    return operation();
  } catch (err) {
    throw mapSqliteError(err, messages);
  }
}
