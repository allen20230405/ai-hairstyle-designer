import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { clearSession } from "../store/session";

import HomePage from "./HomePage";

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    clearSession();
  });

  it("disables start until a supported image and gender are selected", async () => {
    const user = userEvent.setup();
    renderHome();

    const startButton = screen.getByRole("button", { name: "开始分析" });
    expect(startButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "女性" }));
    expect(startButton).toBeDisabled();

    const file = new File(["face"], "face.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByLabelText("上传头像照片"), file);

    expect(startButton).toBeEnabled();
  });

  it("shows an error for unsupported image types", async () => {
    const user = userEvent.setup();
    renderHome();

    const file = new File(["gif"], "face.gif", { type: "image/gif" });
    await user.upload(screen.getByLabelText("上传头像照片"), file);

    expect(screen.getByText("请上传 JPG、PNG 或 WebP 格式的照片。")).toBeInTheDocument();
  });
});
