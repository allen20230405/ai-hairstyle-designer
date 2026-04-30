import { put } from "@vercel/blob";
import formidable from "formidable";
import { readFile } from "node:fs/promises";

import { json, jsonError, mapErrorCode, messageForErrorCode } from "../_lib/http";
import { requireBlobToken } from "../_lib/env";
import type { VercelRequestLike, VercelResponseLike } from "../_lib/vercelTypes";

export const config = {
  api: {
    bodyParser: false
  }
};

const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function parseForm(request: VercelRequestLike): Promise<formidable.Files> {
  const form = formidable({
    multiples: false,
    maxFileSize: 10 * 1024 * 1024
  });

  return new Promise((resolve, reject) => {
    form.parse(request, (error, _fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
}

function getFirstFile(fileOrFiles: formidable.File | formidable.File[] | undefined): formidable.File | undefined {
  if (Array.isArray(fileOrFiles)) {
    return fileOrFiles[0];
  }

  return fileOrFiles;
}

export default async function handler(request: VercelRequestLike, response: VercelResponseLike) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    jsonError(response, 405, "BAD_REQUEST", "只支持 POST 请求。");
    return;
  }

  try {
    const token = requireBlobToken();
    const files = await parseForm(request);
    const image = getFirstFile(files.image);

    if (!image) {
      jsonError(response, 400, "BAD_REQUEST", "缺少 image 文件。");
      return;
    }

    if (!image.mimetype || !SUPPORTED_TYPES.has(image.mimetype)) {
      jsonError(response, 400, "INVALID_IMAGE_TYPE", messageForErrorCode("INVALID_IMAGE_TYPE"));
      return;
    }

    const buffer = await readFile(image.filepath);
    const extension = image.mimetype === "image/png" ? "png" : image.mimetype === "image/webp" ? "webp" : "jpg";
    const filename = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: image.mimetype,
      token
    });

    json(response, 200, {
      status: "success",
      imageUrl: blob.url
    });
  } catch (error) {
    const code = mapErrorCode(error);
    jsonError(response, 500, code, messageForErrorCode(code));
  }
}
