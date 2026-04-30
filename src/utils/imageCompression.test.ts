import { describe, expect, it } from "vitest";

import { formatFileSize, isSupportedImageType, shouldCompressImage } from "./imageCompression";

describe("imageCompression utilities", () => {
  it("accepts jpeg, png, and webp files", () => {
    expect(isSupportedImageType("image/jpeg")).toBe(true);
    expect(isSupportedImageType("image/png")).toBe(true);
    expect(isSupportedImageType("image/webp")).toBe(true);
  });

  it("rejects unsupported image types", () => {
    expect(isSupportedImageType("image/gif")).toBe(false);
    expect(isSupportedImageType("application/pdf")).toBe(false);
  });

  it("requires compression only when the image is larger than 2MB", () => {
    expect(shouldCompressImage({ size: 2 * 1024 * 1024 })).toBe(false);
    expect(shouldCompressImage({ size: 2 * 1024 * 1024 + 1 })).toBe(true);
  });

  it("formats file sizes for user-facing warnings", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });
});
