import type { VercelResponseLike } from "./vercelTypes.js";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "INVALID_IMAGE_TYPE"
  | "MISSING_ARK_API_KEY"
  | "MISSING_BLOB_TOKEN"
  | "BLOB_UPLOAD_ERROR"
  | "ARK_API_ERROR"
  | "ARK_RESPONSE_PARSE_ERROR"
  | "INTERNAL_ERROR";

export function json(response: VercelResponseLike, statusCode: number, body: unknown) {
  response.status(statusCode).json(body);
}

export function jsonError(
  response: VercelResponseLike,
  statusCode: number,
  code: ApiErrorCode,
  message: string,
  detail?: string
) {
  json(response, statusCode, {
    status: "error",
    code,
    message,
    ...(detail ? { detail } : {})
  });
}

export function safeErrorDetail(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error).slice(0, 500);
  }

  const maybeStatus = "status" in error ? `status=${String(error.status)} ` : "";
  const maybeCode = "code" in error ? `code=${String(error.code)} ` : "";
  const maybeType = "type" in error ? `type=${String(error.type)} ` : "";

  return `${maybeStatus}${maybeCode}${maybeType}${error.message}`.trim().slice(0, 500);
}

export function logApiError(scope: string, error: unknown) {
  console.error(
    JSON.stringify({
      scope,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
  );
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

  if (error.message === "BLOB_UPLOAD_ERROR") {
    return "BLOB_UPLOAD_ERROR";
  }

  if (error.message === "ARK_API_ERROR") {
    return "ARK_API_ERROR";
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
    BLOB_UPLOAD_ERROR: "图片上传到 Vercel Blob 失败，请检查 Blob Store 连接。",
    ARK_API_ERROR: "火山方舟 API 调用失败，请检查模型、Key 或额度。",
    ARK_RESPONSE_PARSE_ERROR: "AI 返回内容无法解析，请重试。",
    INTERNAL_ERROR: "服务暂时不可用，请稍后重试。"
  };

  return messages[code];
}
