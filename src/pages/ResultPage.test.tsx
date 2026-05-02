import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { clearSession, setSession } from "../store/session";

import ResultPage from "./ResultPage";

function renderResult() {
  return render(
    <MemoryRouter initialEntries={["/result"]}>
      <Routes>
        <Route path="/" element={<main>首页</main>} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ResultPage", () => {
  beforeEach(() => {
    clearSession();
  });

  it("redirects home when generated results are missing", async () => {
    renderResult();

    expect(await screen.findByText("首页")).toBeInTheDocument();
  });

  it("renders three hairstyle cards and download links", () => {
    setSession({
      previewUrl: "blob:preview",
      gender: "female",
      hairstyles: [
        { styleId: "001", name: "空气感锁骨发", advice: "自然修饰脸型。", imageUrl: "data:image/svg+xml,1" },
        { styleId: "002", name: "法式层次卷", advice: "增加轻盈层次。", imageUrl: "data:image/svg+xml,2" },
        { styleId: "003", name: "柔雾短波波", advice: "提升轮廓精神感。", imageUrl: "data:image/svg+xml,3" }
      ]
    });

    renderResult();

    expect(screen.getAllByRole("img", { name: /发型效果图/ })).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: "保存图片" })).toHaveLength(3);
  });
});
