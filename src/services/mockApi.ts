import type {
  AnalyzeFaceRequest,
  AnalyzeFaceResponse,
  FaceType,
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

const FACE_TYPES: FaceType[] = ["oval", "round", "square", "long", "heart", "pear", "diamond"];

const FACE_TYPE_LABELS: Record<FaceType, string> = {
  oval: "椭圆形脸",
  round: "圆形脸",
  square: "方形脸",
  long: "长形脸",
  heart: "心形脸",
  pear: "梨形脸",
  diamond: "菱形脸"
};

const STYLE_NAMES: Record<Gender, string[]> = {
  female: ["空气感锁骨发", "法式层次卷", "柔雾短波波"],
  male: ["自然纹理短发", "轻商务侧分", "蓬松前刺"]
};

const STYLE_ADVICE: Record<FaceType, string[]> = {
  oval: ["保留脸部均衡比例，突出自然轮廓。", "层次落点靠近颧骨，显得轻盈。", "适合露出部分额头，整体更精神。"],
  round: ["增加顶部蓬松度，拉长脸部线条。", "两侧收窄可以削弱圆润感。", "避免厚重齐刘海，保留空气感。"],
  square: ["用柔和弧度弱化下颌角。", "侧分和层次能平衡硬朗轮廓。", "发尾保留轻盈纹理更自然。"],
  long: ["增加横向蓬松度，缩短视觉脸长。", "刘海或侧区层次能改善比例。", "避免顶部过高的造型。"],
  heart: ["下半区增加发量，平衡额头宽度。", "轻薄刘海能柔化上庭。", "发尾外翻会让下巴更协调。"],
  pear: ["顶部增加体积，平衡下颌宽度。", "侧区线条向上收，轮廓更清爽。", "避免发尾堆在下颌附近。"],
  diamond: ["柔化颧骨两侧线条。", "额前和下巴附近增加轻盈层次。", "中低层次能让脸型更协调。"]
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function hashText(text: string): number {
  return Array.from(text).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function createResultSvg(gender: Gender, faceType: FaceType, index: number, styleName: string): string {
  const palettes = [
    ["#f7f1eb", "#9c6f5a", "#252525", "#d7b8a6"],
    ["#f2eee9", "#3f332e", "#b88d76", "#efe0d6"],
    ["#faf7f4", "#756052", "#1f1f1f", "#cfa58f"]
  ];
  const [bg, hair, ink, accent] = palettes[index];
  const label = `${FACE_TYPE_LABELS[faceType]} · ${styleName}`;
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

export async function analyzeFaceMock(
  request: AnalyzeFaceRequest,
  options?: MockOptions
): Promise<AnalyzeFaceResponse> {
  const hash = hashText(request.imageUrl);
  const faceType = FACE_TYPES[hash % FACE_TYPES.length];
  const confidence = Number((0.82 + (hash % 17) / 100).toFixed(2));

  return runMockStep({ faceType, confidence }, options);
}

export async function generateHairstylesMock(
  request: GenerateHairstylesRequest,
  options?: MockOptions
): Promise<GenerateHairstylesResponse> {
  const names = STYLE_NAMES[request.gender];
  const advice = STYLE_ADVICE[request.faceType];
  const results: HairstyleResult[] = names.map((name, index) => ({
    styleId: `${request.gender}-${request.faceType}-00${index + 1}`,
    name,
    advice: advice[index],
    imageUrl: createResultSvg(request.gender, request.faceType, index, name)
  }));

  return runMockStep({ results }, options);
}

export { FACE_TYPE_LABELS };
