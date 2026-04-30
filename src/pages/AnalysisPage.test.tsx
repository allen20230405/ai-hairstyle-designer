import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearSession, getSession, setSession } from "../store/session";

import AnalysisPage from "./AnalysisPage";

vi.mock("../services/api", () => ({
  uploadImage: vi.fn(async () => ({ status: "success", imageUrl: "mock-upload://face.jpg" })),
  analyzeFace: vi.fn(async () => ({ faceType: "oval", confidence: 0.96 })),
  generateHairstyles: vi.fn(async () => ({
    results: [
      { styleId: "001", name: "空气感锁骨发", advice: "自然修饰脸型。", imageUrl: "data:image/svg+xml,1" },
      { styleId: "002", name: "法式层次卷", advice: "增加轻盈层次。", imageUrl: "data:image/svg+xml,2" },
      { styleId: "003", name: "柔雾短波波", advice: "提升轮廓精神感。", imageUrl: "data:image/svg+xml,3" }
    ]
  }))
}));

function renderAnalysis(initialPath = "/analysis") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<main>首页</main>} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/result" element={<main>结果页</main>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AnalysisPage", () => {
  beforeEach(() => {
    clearSession();
  });

  it("redirects home when required session data is missing", async () => {
    renderAnalysis();

    expect(await screen.findByText("首页")).toBeInTheDocument();
  });

  it("runs the analysis flow, stores three results, and navigates to result page", async () => {
    setSession({
      workingFile: new File(["face"], "face.jpg", { type: "image/jpeg" }),
      previewUrl: "blob:preview",
      gender: "female"
    });

    renderAnalysis();

    expect(screen.getByText("分析中，请稍候")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("结果页")).toBeInTheDocument());

    expect(getSession()).toMatchObject({
      uploadedImageUrl: "mock-upload://face.jpg",
      faceType: "oval",
      confidence: 0.96
    });
    expect(getSession().hairstyles).toHaveLength(3);
  });
});
