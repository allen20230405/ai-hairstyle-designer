import { createArkClient } from "../_lib/ark.js";
import { FACE_ANALYSIS_PROMPT, parseFaceAnalysis } from "../_lib/face.js";
import { json, jsonError, logApiError, mapErrorCode, messageForErrorCode, safeErrorDetail } from "../_lib/http.js";
import type { VercelRequestLike, VercelResponseLike } from "../_lib/vercelTypes.js";

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    jsonError(response, 405, "BAD_REQUEST", "只支持 POST 请求。");
    return;
  }

  const body = request.body as { imageUrl?: unknown } | undefined;
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl : "";
  if (!imageUrl) {
    jsonError(response, 400, "BAD_REQUEST", "缺少 imageUrl。");
    return;
  }

  let arkErrorDetail = "";

  try {
    const { client, visionModel } = createArkClient();
    const completion = await client.responses.create({
      model: visionModel,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "auto"
            },
            {
              type: "input_text",
              text: FACE_ANALYSIS_PROMPT
            }
          ]
        }
      ]
    }).catch((error) => {
      arkErrorDetail = safeErrorDetail(error);
      logApiError("analyze-face.ark-chat", error);
      throw new Error("ARK_API_ERROR");
    });

    const text = completion.output_text || JSON.stringify(completion.output ?? "");

    json(response, 200, parseFaceAnalysis(text));
  } catch (error) {
    logApiError("analyze-face", error);
    const code = mapErrorCode(error);
    jsonError(response, 500, code, messageForErrorCode(code), code === "ARK_API_ERROR" ? arkErrorDetail : undefined);
  }
}
