/**
 * Domain errors — ngôn ngữ trung lập, không phụ thuộc DB.
 * Repositories throw các errors này; services bắt và chuyển thành HTTP status.
 */

export class NotFoundError extends Error {
  readonly kind = "NotFound" as const;
  constructor(entity: string) {
    super(`Không tìm thấy ${entity}`);
  }
}

export class ConflictError extends Error {
  readonly kind = "Conflict" as const;
  constructor(message: string) {
    super(message);
  }
}

export class ForeignKeyError extends Error {
  readonly kind = "ForeignKey" as const;
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  readonly kind = "Validation" as const;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  readonly kind = "Forbidden" as const;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  readonly kind = "Unauthorized" as const;
  constructor(message: string) {
    super(message);
  }
}

export type DomainError =
  | NotFoundError
  | ConflictError
  | ForeignKeyError
  | ValidationError
  | ForbiddenError
  | UnauthorizedError;

/** Map domain error → HTTP status. Dùng ở controllers. */
export function toHttpStatus(err: unknown): { status: number; message: string } {
  if (err instanceof NotFoundError) return { status: 404, message: err.message };
  if (err instanceof ConflictError) return { status: 409, message: err.message };
  if (err instanceof ForeignKeyError) return { status: 409, message: err.message };
  if (err instanceof ValidationError) return { status: 400, message: err.message };
  if (err instanceof ForbiddenError) return { status: 403, message: err.message };
  if (err instanceof UnauthorizedError) return { status: 401, message: err.message };

  // Legacy { status, message } shape — giữ tương thích ngược
  if (err && typeof err === "object" && "status" in err && "message" in err) {
    return {
      status: (err as any).status || 500,
      message: (err as any).message || "Lỗi máy chủ",
    };
  }

  return { status: 500, message: "Lỗi máy chủ" };
}
