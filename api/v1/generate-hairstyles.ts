import { createArkClient } from "../_lib/ark";
import { buildHairstylePrompts } from "../_lib/hairstyles";
import { json, jsonError, logApiError, mapErrorCode, messageForErrorCode } from "../_lib/http";
import type { FaceType, Gender, GenerateHairstylesRequest, HairstyleResult } from "../../src/types/api";
import type { VercelRequestLike, VercelResponseLike } from "../_lib/vercelTypes";

const FACE_TYPES: FaceType[] = ["oval", "round", "square", "long", "heart", "pear", "diamond"];
const GENDERS: Gender[] = ["male", "female"];

function parseRequest(body: unknown): GenerateHairstylesRequest | undefined {
  const maybeBody = body as Partial<GenerateHairstylesRequest> | undefined;
  if (!maybeBody?.imageUrl || !maybeBody.faceType || !maybeBody.gender) {
    return undefined;
  }

  if (!FACE_TYPES.includes(maybeBody.faceType) || !GENDERS.includes(maybeBody.gender)) {
    return undefined;
  }

  return {
    imageUrl: maybeBody.imageUrl,
    faceType: maybeBody.faceType,
    gender: maybeBody.gender
  };
}

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    jsonError(response, 405, "BAD_REQUEST", "只支持 POST 请求。");
    return;
  }

  const body = parseRequest(request.body);
  if (!body) {
    jsonError(response, 400, "BAD_REQUEST", "请求参数不正确。");
    return;
  }

  try {
    const { client, imageModel } = createArkClient();
    const prompts = buildHairstylePrompts(body);
    const results: HairstyleResult[] = [];

    for (const prompt of prompts) {
      const imageResponse = await client.images.generate({
        model: imageModel,
        prompt: prompt.prompt,
        size: "2K" as unknown as "1024x1024",
        response_format: "url"
      }).catch((error) => {
        logApiError("generate-hairstyles.ark-images", error);
        throw new Error("ARK_API_ERROR");
      });
      const imageUrl = imageResponse.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("ARK_RESPONSE_PARSE_ERROR");
      }

      results.push({
        styleId: prompt.styleId,
        name: prompt.name,
        advice: prompt.advice,
        imageUrl
      });
    }

    json(response, 200, { results });
  } catch (error) {
    logApiError("generate-hairstyles", error);
    const code = mapErrorCode(error);
    jsonError(response, 500, code, messageForErrorCode(code));
  }
}
