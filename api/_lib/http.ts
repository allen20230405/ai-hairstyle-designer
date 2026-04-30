import type { VercelResponseLike } from "./vercelTypes";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "INVALID_IMAGE_TYPE"
  | "MISSING_ARK_API_KEY"
  | "MISSING_BLOB_TOKEN"
  | "ARK_RESPONSE_PARSE_ERROR"
  | "INTERNAL_ERROR";

export function json(response: VercelResponseLike, statusCode: number, body: unknown) {
  response.status(statusCode).json(body);
}

export function jsonError(response: VercelResponseLike, statusCode: number, code: ApiErrorCode, message: string) {
  json(response, statusCode, {
    status: "error",
    code,
    message
  });
}

export function mapErrorCode(error: unknown): ApiErrorCode {
  if (!(error instanceof Error)) {
    return "INTERNAL_ERROR";
  }

  if (error.message === "MISSING_ARK_API_KEY") {
    return "MISSING_ARK_API_KEY";
  }

  if (error.message === "MISSING_BLOB_TOKEN") {
    return "MISSING_BLOB_TOKEN";
  }

  if (error.message === "ARK_RESPONSE_PARSE_ERROR") {
    return "ARK_RESPONSE_PARSE_ERROR";
  }

  return "INTERNAL_ERROR";
}

export function messageForErrorCode(code: ApiErrorCode): string {
  const messages: Record<ApiErrorCode, string> = {
    BAD_REQUEST: "请求参数不正确。",
    INVALID_IMAGE_TYPE: "请上传 JPG、PNG 或 WebP 格式的照片。",
    MISSING_ARK_API_KEY: "服务端缺少 ARK_API_KEY 环境变量。",
    MISSING_BLOB_TOKEN: "服务端缺少 BLOB_READ_WRITE_TOKEN 环境变量。",
    ARK_RESPONSE_PARSE_ERROR: "AI 返回内容无法解析，请重试。",
    INTERNAL_ERROR: "服务暂时不可用，请稍后重试。"
  };

  return messages[code];
}
