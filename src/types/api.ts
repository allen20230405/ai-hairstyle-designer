export type Gender = "male" | "female";

export type SceneType = "daily" | "work" | "date" | "party";

export type FaceType =
  | "oval"
  | "round"
  | "square"
  | "long"
  | "heart"
  | "pear"
  | "diamond";

export type UploadResponse = {
  status: "success";
  imageUrl: string;
};

export type AnalyzeFaceRequest = {
  imageUrl: string;
};

export type AnalyzeFaceResponse = {
  faceType: FaceType;
  confidence: number;
};

export type GenerateHairstylesRequest = {
  imageUrl: string;
  faceType: FaceType;
  gender: Gender;
  scene: SceneType;
};

export type HairstyleResult = {
  styleId: string;
  name: string;
  advice: string;
  imageUrl: string;
};

export type GenerateHairstylesResponse = {
  results: HairstyleResult[];
};

export type SessionState = {
  originalFile?: File;
  workingFile?: File;
  previewUrl?: string;
  uploadedImageUrl?: string;
  gender?: Gender;
  scene?: SceneType;
  faceType?: FaceType;
  confidence?: number;
  hairstyles?: HairstyleResult[];
  warning?: string;
};
