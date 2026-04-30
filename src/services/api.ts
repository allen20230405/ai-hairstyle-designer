import type { AnalyzeFaceRequest, GenerateHairstylesRequest } from "../types/api";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const rawBody = await response.text().catch(() => "");
  const body = (rawBody ? safeParseJson(rawBody) : {}) as { code?: string; message?: string };

  if (!response.ok) {
    const suffix = body.code ? `（${body.code}）` : "";
    const fallback = `接口请求失败：${response.url || "未知接口"}（HTTP ${response.status}）`;
    throw new Error(`${body.message || fallback}${suffix}`);
  }

  return body as T;
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function uploadImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch("/api/v1/upload-image", {
    method: "POST",
    body: formData
  });

  return parseJsonResponse<Awaited<ReturnType<typeof import("./mockApi").uploadImageMock>>>(response);
}

export async function analyzeFace(request: AnalyzeFaceRequest) {
  const response = await fetch("/api/v1/analyze-face", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  return parseJsonResponse<Awaited<ReturnType<typeof import("./mockApi").analyzeFaceMock>>>(response);
}

export async function generateHairstyles(request: GenerateHairstylesRequest) {
  const response = await fetch("/api/v1/generate-hairstyles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  return parseJsonResponse<Awaited<ReturnType<typeof import("./mockApi").generateHairstylesMock>>>(response);
}
