import { describe, expect, it } from "vitest";

import { analyzeFaceMock, generateHairstylesMock, uploadImageMock } from "./mockApi";

describe("mock API", () => {
  it("uploads an image and returns a success response with an image URL", async () => {
    const file = new File(["image"], "face.jpg", { type: "image/jpeg" });

    const response = await uploadImageMock(file, { delayMs: 0 });

    expect(response.status).toBe("success");
    expect(response.imageUrl).toContain("mock-upload://");
  });

  it("analyzes a face into a supported face type and confidence", async () => {
    const response = await analyzeFaceMock({ imageUrl: "mock-upload://face.jpg" }, { delayMs: 0 });

    expect(["oval", "round", "square", "long", "heart", "pear", "diamond"]).toContain(response.faceType);
    expect(response.confidence).toBeGreaterThanOrEqual(0.82);
    expect(response.confidence).toBeLessThanOrEqual(0.98);
  });

  it("generates exactly three salon-themed hairstyle results", async () => {
    const response = await generateHairstylesMock(
      { imageUrl: "mock-upload://face.jpg", faceType: "oval", gender: "female", scene: "date" },
      { delayMs: 0 }
    );

    expect(response.results).toHaveLength(3);
    expect(response.results[0]).toMatchObject({
      styleId: "female-oval-001"
    });
    expect(response.results.every((result) => result.imageUrl.startsWith("data:image/svg+xml"))).toBe(true);
  });
});
