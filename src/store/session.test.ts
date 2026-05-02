import { beforeEach, describe, expect, it } from "vitest";

import { clearSession, getSession, setSession, updateSession } from "./session";

describe("session store", () => {
  beforeEach(() => {
    clearSession();
  });

  it("stores and reads the selected image preview and gender", () => {
    setSession({ previewUrl: "blob:preview", gender: "female" });

    expect(getSession()).toMatchObject({
      previewUrl: "blob:preview",
      gender: "female"
    });
  });

  it("updates existing hairstyle results without removing prior state", () => {
    setSession({ previewUrl: "blob:preview", gender: "male" });
    updateSession({
      hairstyles: [
        {
          styleId: "001",
          name: "自然纹理短发",
          advice: "拉长脸部线条。",
          imageUrl: "data:image/svg+xml,test"
        }
      ]
    });

    expect(getSession()).toMatchObject({
      previewUrl: "blob:preview",
      gender: "male"
    });
    expect(getSession().hairstyles).toHaveLength(1);
  });

  it("clears all session data", () => {
    setSession({ previewUrl: "blob:preview", gender: "female" });

    clearSession();

    expect(getSession()).toEqual({});
  });
});
