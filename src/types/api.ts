export type Gender = "male" | "female";

export type SceneType = "daily" | "work" | "date" | "party";

export type UploadResponse = {
  status: "success";
  imageUrl: string;
};

export type GenerateHairstylesRequest = {
  imageUrl: string;
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
  hairstyles?: HairstyleResult[];
  warning?: string;
};
