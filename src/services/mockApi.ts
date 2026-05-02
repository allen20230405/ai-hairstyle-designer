import type {
  Gender,
  GenerateHairstylesRequest,
  GenerateHairstylesResponse,
  HairstyleResult,
  SceneType,
  UploadResponse
} from "../types/api";

type MockOptions = {
  delayMs?: number;
  fail?: boolean;
};

const STYLE_NAMES: Record<Gender, Record<SceneType, string[]>> = {
  female: {
    daily: ["空气感锁骨发", "自然内扣中长发", "轻薄八字刘海长发"],
    work: ["低层次职场锁骨发", "侧分柔顺中长发", "知性低马尾造型"],
    date: ["法式层次卷", "慵懒空气卷长发", "温柔半扎发"],
    party: ["柔雾短波波", "复古大波浪", "精致高颅顶卷发"]
  },
  male: {
    daily: ["自然纹理短发", "低维护碎盖短发", "清爽圆寸渐变"],
    work: ["轻商务侧分", "干净背头短发", "短侧分纹理发"],
    date: ["蓬松前刺", "韩式纹理中短发", "微卷松弛短发"],
    party: ["立体油头渐变", "凌感湿发纹理", "高颅顶飞机头"]
  }
};

const STYLE_ADVICE: Record<Gender, Record<SceneType, string[]>> = {
  female: {
    daily: ["轻盈自然，适合日常出门和通勤。", "干净耐看，日常打理成本低。", "修饰额头和颧骨，整体温柔不夸张。"],
    work: ["利落专业，适合办公室和会议。", "显得稳重清爽，适合通勤和面试。", "简洁干练，保留女性柔和感。"],
    date: ["温柔有氛围，适合约会和近距离拍照。", "增加亲和力，画面更柔软。", "甜美但不过度，适合晚餐和出游。"],
    party: ["更上镜，适合聚会拍照和轻造型。", "造型感更强，适合晚宴和派对。", "提升头包脸比例，拍照更有存在感。"]
  },
  male: {
    daily: ["清爽自然，适合日常出门。", "不需要强造型，日常更随性。", "简单利落，适合想减少打理的人。"],
    work: ["低调成熟，适合通勤和商务场合。", "更专业正式，适合会议和面试。", "保持精神感，不显得过度造型。"],
    date: ["更年轻有精神，适合约会氛围。", "柔和亲近，适合自然风格。", "降低距离感，看起来更轻松。"],
    party: ["造型感更强，适合聚会拍照。", "更时髦醒目，适合夜间聚会。", "提升轮廓存在感，上镜更精神。"]
  }
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
  const names = STYLE_NAMES[request.gender][request.scene];
  const advice = STYLE_ADVICE[request.gender][request.scene];
  const results: HairstyleResult[] = names.map((name, index) => ({
    styleId: `${request.gender}-${request.scene}-00${index + 1}`,
    name,
    advice: advice[index],
    imageUrl: createResultSvg(request.gender, index, name)
  }));

  return runMockStep({ results }, options);
}
