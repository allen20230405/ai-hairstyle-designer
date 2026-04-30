import type { AnalyzeFaceRequest, GenerateHairstylesRequest } from "../types/api";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as { code?: string; message?: string };

  if (!response.ok) {
    const suffix = body.code ? `（${body.code}）` : "";
    throw new Error(`${body.message || "服务暂时不可用，请稍后重试。"}${suffix}`);
  }

  return body as T;
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
