import { describe, expect, it } from "vitest";

import { buildHairstylePrompts } from "./hairstyles";

describe("buildHairstylePrompts", () => {
  it("returns exactly three hairstyle prompts with stable ids", () => {
    const prompts = buildHairstylePrompts({
      imageUrl: "https://example.com/face.jpg",
      gender: "female",
      scene: "date",
      variationSeed: "test-date-seed"
    });

    expect(prompts).toHaveLength(3);
    expect(prompts[0]).toMatchObject({
      styleId: "female-date-001"
    });
    expect(prompts.every((prompt) => prompt.prompt.includes("https://example.com/face.jpg"))).toBe(true);
    expect(prompts[0].prompt).toContain("保持原图人物100%的面部特征");
    expect(prompts[0].prompt).toContain(`只改变发型为${prompts[0].name}`);
    expect(prompts[0].prompt).toContain("场景风格：约会氛围");
    expect(prompts[0].prompt).toContain("本次随机种子：test-date-seed");
    expect(prompts[0].prompt).toContain("根据参考图中可见的脸型轮廓");
    expect(prompts[0].prompt).toContain("不要退回通用发型");
  });

  it("returns different hairstyle directions for different scenes", () => {
    const dailyPrompts = buildHairstylePrompts({
      imageUrl: "https://example.com/face.jpg",
      gender: "female",
      scene: "daily"
    });
    const workPrompts = buildHairstylePrompts({
      imageUrl: "https://example.com/face.jpg",
      gender: "female",
      scene: "work"
    });

    expect(dailyPrompts.map((prompt) => prompt.name)).not.toEqual(workPrompts.map((prompt) => prompt.name));
  });

  it("returns different hairstyle mixes for different variation seeds", () => {
    const firstPrompts = buildHairstylePrompts({
      imageUrl: "https://example.com/face.jpg",
      gender: "female",
      scene: "party",
      variationSeed: "seed-a"
    });
    const secondPrompts = buildHairstylePrompts({
      imageUrl: "https://example.com/face.jpg",
      gender: "female",
      scene: "party",
      variationSeed: "seed-b"
    });

    expect(firstPrompts.map((prompt) => prompt.name)).not.toEqual(secondPrompts.map((prompt) => prompt.name));
  });
});
