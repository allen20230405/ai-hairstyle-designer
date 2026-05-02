import { beforeEach, describe, expect, it, vi } from "vitest";

import { generateHairstyles, uploadImage } from "./api";

describe("frontend API service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads a file as multipart form data", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ status: "success", imageUrl: "https://blob.test/a.jpg" })));
    vi.stubGlobal("fetch", fetchMock);

    const result = await uploadImage(new File(["face"], "face.jpg", { type: "image/jpeg" }));

    expect(result.imageUrl).toBe("https://blob.test/a.jpg");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/upload-image",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData)
      })
    );
  });

  it("throws readable errors for failed API responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ message: "服务端缺少 ARK_API_KEY 环境变量。" }), { status: 500 }))
    );

    await expect(
      generateHairstyles({ imageUrl: "https://blob.test/a.jpg", gender: "female", scene: "daily" })
    ).rejects.toThrow("服务端缺少 ARK_API_KEY 环境变量。");
  });
});
