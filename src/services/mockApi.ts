import type {
  Gender,
  GenerateHairstylesRequest,
  GenerateHairstylesResponse,
  HairstyleResult,
  UploadResponse
} from "../types/api";

type MockOptions = {
  delayMs?: number;
  fail?: boolean;
};

const STYLE_NAMES: Record<Gender, string[]> = {
  female: ["空气感锁骨发", "法式层次卷", "柔雾短波波"],
  male: ["自然纹理短发", "轻商务侧分", "蓬松前刺"]
};

const STYLE_ADVICE: Record<Gender, string[]> = {
  female: ["保留轻盈层次，整体自然耐看。", "增加自然弧度，让轮廓更柔和。", "提升精神感，适合换造型前预览。"],
  male: ["顶部保留纹理，整体清爽自然。", "适合通勤和日常场景，低调成熟。", "拉高头顶比例，让整体更精神。"]
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function createResultSvg(gender: Gender, index: number, styleName: string): string {
  const palettes = [
    ["#f7f1eb", "#9c6f5a", "#252525", "#d7b8a6"],
    ["#f2eee9", "#3f332e", "#b88d76", "#efe0d6"],
    ["#faf7f4", "#756052", "#1f1f1f", "#cfa58f"]
  ];
  const [bg, hair, ink, accent] = palettes[index];
  const label = styleName;
  const silhouette = gender === "female" ? "M130 112 C92 126 74 168 82 220 C92 282 250 282 260 220 C268 168 250 126 212 112" : "M108 120 C128 86 218 86 240 120 L230 210 C222 266 126 266 116 210 Z";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <rect width="900" height="1200" fill="${bg}"/>
      <rect x="70" y="80" width="760" height="1040" rx="44" fill="#fffaf6" stroke="#eaded4" stroke-width="3"/>
      <circle cx="450" cy="430" r="230" fill="${accent}" opacity="0.28"/>
      <g transform="translate(280 230) scale(1.05)">
        <path d="${silhouette}" fill="${hair}"/>
        <ellipse cx="170" cy="190" rx="96" ry="116" fill="#f1c6aa"/>
        <path d="M98 176 C128 104 220 104 246 174 C206 142 148 142 98 176 Z" fill="${hair}"/>
        <path d="M132 226 C154 248 188 248 210 226" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
        <circle cx="138" cy="188" r="8" fill="${ink}"/>
        <circle cx="206" cy="188" r="8" fill="${ink}"/>
      </g>
      <text x="450" y="820" text-anchor="middle" fill="${ink}" font-size="48" font-family="Arial, sans-serif" font-weight="700">${styleName}</text>
      <text x="450" y="884" text-anchor="middle" fill="#7b6f68" font-size="28" font-family="Arial, sans-serif">${label}</text>
      <rect x="250" y="950" width="400" height="74" rx="20" fill="${ink}"/>
      <text x="450" y="998" text-anchor="middle" fill="#ffffff" font-size="28" font-family="Arial, sans-serif">AI 预览效果图</text>
    </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

async function runMockStep<T>(result: T, options: MockOptions = {}): Promise<T> {
  await delay(options.delayMs ?? 650);

  if (options.fail) {
    throw new Error("AI 服务暂时不可用，请稍后重试");
  }

  return result;
}

export async function uploadImageMock(file: File, options?: MockOptions): Promise<UploadResponse> {
  return runMockStep(
    {
      status: "success",
      imageUrl: `mock-upload://${encodeURIComponent(file.name)}-${file.size}`
    },
    options
  );
}

export async function generateHairstylesMock(
  request: GenerateHairstylesRequest,
  options?: MockOptions
): Promise<GenerateHairstylesResponse> {
  const names = STYLE_NAMES[request.gender];
  const advice = STYLE_ADVICE[request.gender];
  const results: HairstyleResult[] = names.map((name, index) => ({
    styleId: `${request.gender}-${request.scene}-00${index + 1}`,
    name,
    advice: advice[index],
    imageUrl: createResultSvg(request.gender, index, name)
  }));

  return runMockStep({ results }, options);
}
