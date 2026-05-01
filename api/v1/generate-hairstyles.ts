import { createArkClient } from "../_lib/ark.js";
import { buildHairstylePrompts } from "../_lib/hairstyles.js";
import { json, jsonError, logApiError, mapErrorCode, messageForErrorCode } from "../_lib/http.js";
import type OpenAI from "openai";
import type { FaceType, Gender, GenerateHairstylesRequest, HairstyleResult, SceneType } from "../../src/types/api.js";
import type { VercelRequestLike, VercelResponseLike } from "../_lib/vercelTypes.js";

export const config = {
  maxDuration: 60
};

const FACE_TYPES: FaceType[] = ["oval", "round", "square", "long", "heart", "pear", "diamond"];
const GENDERS: Gender[] = ["male", "female"];
const SCENES: SceneType[] = ["daily", "work", "date", "party"];

type SeedreamImageRequest = {
  image: string;
  model: string;
  prompt: string;
  response_format: "url";
  size: "2K";
  watermark: boolean;
};

function parseRequest(body: unknown): GenerateHairstylesRequest | undefined {
  const maybeBody = body as Partial<GenerateHairstylesRequest> | undefined;
  if (!maybeBody?.imageUrl || !maybeBody.faceType || !maybeBody.gender) {
    return undefined;
  }

  if (!FACE_TYPES.includes(maybeBody.faceType) || !GENDERS.includes(maybeBody.gender)) {
    return undefined;
  }

  const scene = maybeBody.scene && SCENES.includes(maybeBody.scene) ? maybeBody.scene : "daily";

  return {
    imageUrl: maybeBody.imageUrl,
    faceType: maybeBody.faceType,
    gender: maybeBody.gender,
    scene
  };
}

function generateImageFromReference(client: OpenAI, params: SeedreamImageRequest) {
  return client.images.generate(
    {
      model: params.model,
      prompt: params.prompt,
      size: params.size as unknown as "1024x1024",
      response_format: params.response_format
    },
    {
      body: params
    }
  );
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

    const results = await Promise.all(prompts.map(async (prompt): Promise<HairstyleResult> => {
      const imageResponse = await generateImageFromReference(client, {
        image: body.imageUrl,
        model: imageModel,
        prompt: prompt.prompt,
        size: "2K",
        response_format: "url",
        watermark: false
      }).catch((error) => {
        logApiError("generate-hairstyles.ark-images", error);
        throw new Error("ARK_API_ERROR");
      });
      const imageUrl = imageResponse.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error("ARK_RESPONSE_PARSE_ERROR");
      }

      return {
        styleId: prompt.styleId,
        name: prompt.name,
        advice: prompt.advice,
        imageUrl
      };
    }));

    json(response, 200, { results });
  } catch (error) {
    logApiError("generate-hairstyles", error);
    const code = mapErrorCode(error);
    jsonError(response, 500, code, messageForErrorCode(code));
  }
}
