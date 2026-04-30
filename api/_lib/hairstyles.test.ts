import { describe, expect, it } from "vitest";

import { buildHairstylePrompts } from "./hairstyles";

describe("buildHairstylePrompts", () => {
  it("returns exactly three hairstyle prompts with stable ids", () => {
    const prompts = buildHairstylePrompts({
      imageUrl: "https://example.com/face.jpg",
      faceType: "oval",
      gender: "female"
    });

    expect(prompts).toHaveLength(3);
    expect(prompts[0]).toMatchObject({
      styleId: "female-oval-001"
    });
    expect(prompts.every((prompt) => prompt.prompt.includes("https://example.com/face.jpg"))).toBe(true);
  });
});
