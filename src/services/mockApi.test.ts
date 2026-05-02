import { describe, expect, it } from "vitest";

import { generateHairstylesMock, uploadImageMock } from "./mockApi";

describe("mock API", () => {
  it("uploads an image and returns a success response with an image URL", async () => {
    const file = new File(["image"], "face.jpg", { type: "image/jpeg" });

    const response = await uploadImageMock(file, { delayMs: 0 });

    expect(response.status).toBe("success");
    expect(response.imageUrl).toContain("mock-upload://");
  });

  it("generates exactly three salon-themed hairstyle results", async () => {
    const response = await generateHairstylesMock(
      { imageUrl: "mock-upload://face.jpg", gender: "female", scene: "date" },
      { delayMs: 0 }
    );

    expect(response.results).toHaveLength(3);
    expect(response.results[0]).toMatchObject({
      styleId: "female-date-001"
    });
    expect(response.results.every((result) => result.imageUrl.startsWith("data:image/svg+xml"))).toBe(true);
  });
});
