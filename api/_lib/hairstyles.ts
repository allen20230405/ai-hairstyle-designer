import type { FaceType, Gender, GenerateHairstylesRequest, HairstyleResult } from "../../src/types/api.js";

type HairstylePrompt = Omit<HairstyleResult, "imageUrl"> & {
  prompt: string;
};

const FACE_TYPE_LABELS: Record<FaceType, string> = {
  oval: "椭圆形脸",
  round: "圆形脸",
  square: "方形脸",
  long: "长形脸",
  heart: "心形脸",
  pear: "梨形脸",
  diamond: "菱形脸"
};

const STYLE_LIBRARY: Record<Gender, Array<{ name: string; advice: string; visual: string }>> = {
  female: [
    { name: "空气感锁骨发", advice: "保留轻盈层次，修饰脸型比例。", visual: "空气感锁骨发，发尾微卷，柔和层次" },
    { name: "法式层次卷", advice: "增加自然弧度，让轮廓更柔和。", visual: "法式层次卷发，自然蓬松，轻薄刘海" },
    { name: "柔雾短波波", advice: "提升精神感，适合换造型前预览。", visual: "柔雾短波波头，干净轮廓，微内扣" }
  ],
  male: [
    { name: "自然纹理短发", advice: "顶部保留纹理，整体清爽自然。", visual: "自然纹理短发，顶部蓬松，两侧清爽" },
    { name: "轻商务侧分", advice: "适合通勤场景，弱化脸型短板。", visual: "轻商务侧分，低调成熟，发流自然" },
    { name: "蓬松前刺", advice: "拉高头顶比例，让脸部更立体。", visual: "蓬松前刺短发，动感纹理，干净发际线" }
  ]
};

export function buildHairstylePrompts(request: GenerateHairstylesRequest): HairstylePrompt[] {
  const faceLabel = FACE_TYPE_LABELS[request.faceType];

  return STYLE_LIBRARY[request.gender].map((style, index) => ({
    styleId: `${request.gender}-${request.faceType}-00${index + 1}`,
    name: style.name,
    advice: style.advice,
    prompt: [
      `参考用户头像图片：${request.imageUrl}`,
      `为${faceLabel}${request.gender === "female" ? "女性" : "男性"}设计发型效果图。`,
      `目标发型：${style.visual}。`,
      "保持用户五官、脸型、肤色和身份一致，只替换/调整发型。",
      "真实手机人像摄影质感，美发沙龙光线，干净背景，自然发丝细节。",
      "避免夸张变脸、避免卡通风、避免文字水印覆盖人脸。"
    ].join("\n")
  }));
}
