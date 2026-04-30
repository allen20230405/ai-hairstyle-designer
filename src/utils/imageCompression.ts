const SUPPORTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const COMPRESSION_THRESHOLD_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1600;
const JPEG_QUALITY = 0.82;

type SizedFile = {
  size: number;
};

export function isSupportedImageType(type: string): boolean {
  return SUPPORTED_IMAGE_TYPES.has(type);
}

export function shouldCompressImage(file: SizedFile): boolean {
  return file.size > COMPRESSION_THRESHOLD_BYTES;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Number((bytes / 1024).toFixed(1))} KB`;
  }

  return `${Number((bytes / 1024 / 1024).toFixed(1))} MB`;
}

export async function compressImageIfNeeded(file: File): Promise<File> {
  if (!shouldCompressImage(file)) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("无法创建图片压缩画布");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("图片压缩失败"));
          return;
        }

        resolve(result);
      },
      "image/jpeg",
      JPEG_QUALITY
    );
  });

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now()
  });
}
