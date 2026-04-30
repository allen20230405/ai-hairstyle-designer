import { createArkClient } from "../_lib/ark";
import { FACE_ANALYSIS_PROMPT, parseFaceAnalysis } from "../_lib/face";
import { json, jsonError, mapErrorCode, messageForErrorCode } from "../_lib/http";
import type { VercelRequestLike, VercelResponseLike } from "../_lib/vercelTypes";

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

  try {
    const { client, visionModel } = createArkClient();
    const completion = await client.chat.completions.create({
      model: visionModel,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            },
            {
              type: "text",
              text: FACE_ANALYSIS_PROMPT
            }
          ]
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    const text = typeof content === "string" ? content : JSON.stringify(content ?? "");

    json(response, 200, parseFaceAnalysis(text));
  } catch (error) {
    const code = mapErrorCode(error);
    jsonError(response, 500, code, messageForErrorCode(code));
  }
}
