export type ArkConfig = {
  apiKey: string;
  baseURL: string;
  visionModel: string;
  imageModel: string;
};

export function readArkConfig(env: NodeJS.ProcessEnv = process.env): ArkConfig {
  const apiKey = env.ARK_API_KEY;
  const configuredVisionModel = env.ARK_VISION_MODEL || "doubao-seed-2-0-lite-260215";
  const configuredImageModel = env.ARK_IMAGE_MODEL || "doubao-seedream-5-0-260128";

  if (!apiKey) {
    throw new Error("MISSING_ARK_API_KEY");
  }

  return {
    apiKey,
    baseURL: env.ARK_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3",
    visionModel:
      configuredVisionModel === "doubao-1.5-vision-pro-250328"
        ? "doubao-seed-2-0-lite-260215"
        : configuredVisionModel,
    imageModel:
      configuredImageModel === "doubao-seedream-4-5-251128"
        ? "doubao-seedream-5-0-260128"
        : configuredImageModel
  };
}

export function requireBlobToken(env: NodeJS.ProcessEnv = process.env): string {
  const token = env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    throw new Error("MISSING_BLOB_TOKEN");
  }

  return token;
}
