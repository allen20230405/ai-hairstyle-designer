import type { AnalyzeFaceResponse, FaceType } from "../../src/types/api";

const SUPPORTED_FACE_TYPES: FaceType[] = ["oval", "round", "square", "long", "heart", "pear", "diamond"];

export const FACE_ANALYSIS_PROMPT = `
你是专业发型顾问。请根据用户头像判断脸型，只返回 JSON，不要输出 Markdown。
faceType 必须是以下英文枚举之一：oval, round, square, long, heart, pear, diamond。
confidence 是 0 到 1 之间的小数。
返回格式：
{"faceType":"oval","confidence":0.95}
`;

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

export function parseFaceAnalysis(text: string): AnalyzeFaceResponse {
  try {
    const parsed = JSON.parse(extractJson(text)) as Partial<AnalyzeFaceResponse>;

    if (!parsed.faceType || !SUPPORTED_FACE_TYPES.includes(parsed.faceType)) {
      throw new Error("Unsupported face type");
    }

    const confidence = Number(parsed.confidence);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
      throw new Error("Invalid confidence");
    }

    return {
      faceType: parsed.faceType,
      confidence
    };
  } catch {
    throw new Error("ARK_RESPONSE_PARSE_ERROR");
  }
}
