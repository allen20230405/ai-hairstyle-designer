import type { AnalyzeFaceRequest, GenerateHairstylesRequest } from "../types/api";

import { analyzeFaceMock, generateHairstylesMock, uploadImageMock } from "./mockApi";

export function uploadImage(image: File) {
  return uploadImageMock(image);
}

export function analyzeFace(request: AnalyzeFaceRequest) {
  return analyzeFaceMock(request);
}

export function generateHairstyles(request: GenerateHairstylesRequest) {
  return generateHairstylesMock(request);
}
