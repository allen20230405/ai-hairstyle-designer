import { describe, expect, it } from "vitest";

import { parseFaceAnalysis } from "./face";

describe("parseFaceAnalysis", () => {
  it("parses a clean JSON response", () => {
    expect(parseFaceAnalysis('{"faceType":"oval","confidence":0.95}')).toEqual({
      faceType: "oval",
      confidence: 0.95
    });
  });

  it("extracts JSON from markdown fenced output", () => {
    expect(parseFaceAnalysis('```json\n{"faceType":"round","confidence":0.88}\n```')).toEqual({
      faceType: "round",
      confidence: 0.88
    });
  });

  it("throws when the face type is unsupported", () => {
    expect(() => parseFaceAnalysis('{"faceType":"triangle","confidence":0.9}')).toThrow("ARK_RESPONSE_PARSE_ERROR");
  });
});
