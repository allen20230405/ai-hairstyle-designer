import OpenAI from "openai";

import { readArkConfig } from "./env";

export function createArkClient(env: NodeJS.ProcessEnv = process.env): { client: OpenAI; visionModel: string; imageModel: string } {
  const config = readArkConfig(env);

  return {
    client: new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL
    }),
    visionModel: config.visionModel,
    imageModel: config.imageModel
  };
}
