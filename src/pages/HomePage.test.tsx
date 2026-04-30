import { fireEvent, render } from "@testing-library/react";
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

function getUploadInput(container: HTMLElement) {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) {
    throw new Error("Upload input not found");
  }

  return input;
}

function getStartButton(container: HTMLElement) {
  const button = container.querySelector<HTMLButtonElement>(".primary-button");
  if (!button) {
    throw new Error("Start button not found");
  }

  return button;
}

describe("HomePage", () => {
  beforeEach(() => {
    clearSession();
  });

  it("disables start until a supported image and gender are selected", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();
    const startButton = getStartButton(container);

    expect(startButton).toBeDisabled();

    await user.click(container.querySelectorAll<HTMLButtonElement>(".segment")[0]);
    expect(startButton).toBeDisabled();

    const file = new File(["face"], "face.jpg", { type: "image/jpeg" });
    await user.upload(getUploadInput(container), file);

    expect(startButton).toBeEnabled();
  });

  it("shows an error for unsupported image types", () => {
    const { container } = renderHome();
    const file = new File(["gif"], "face.gif", { type: "image/gif" });

    fireEvent.change(getUploadInput(container), {
      target: {
        files: [file]
      }
    });

    const error = container.querySelector(".message.error");
    expect(error).toHaveTextContent("JPG");
    expect(error).toHaveTextContent("WebP");
  });
});
