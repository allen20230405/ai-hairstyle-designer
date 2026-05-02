import type { Gender, GenerateHairstylesRequest, HairstyleResult, SceneType } from "../../src/types/api.js";

type HairstylePrompt = Omit<HairstyleResult, "imageUrl"> & {
  prompt: string;
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

const SCENE_PROMPTS: Record<SceneType, string> = {
  daily: "场景风格：日常自然，发型要适合平时出门和日常通勤，轻松、耐看、好打理，不要过度造型。",
  work: "场景风格：工作职场，发型要显得干练、精神、专业，适合办公室、通勤、会议和面试。",
  date: "场景风格：约会氛围，发型要温柔、有亲和力、显脸小，有自然精致的氛围感。",
  party: "场景风格：聚会拍照，发型要更上镜、更精致，有轻微造型感，但仍保持真实自然。"
};

export function buildHairstylePrompts(request: GenerateHairstylesRequest): HairstylePrompt[] {
  return STYLE_LIBRARY[request.gender].map((style, index) => ({
    styleId: `${request.gender}-${request.scene}-00${index + 1}`,
    name: style.name,
    advice: style.advice,
    prompt: [
      `参考用户头像图片：${request.imageUrl}`,
      `参考图人物，保持原图人物100%的面部特征：五官、脸型、眼耳鼻嘴、下巴轮廓、肤色完全不变。只改变发型为${style.name}。正面人像照，正脸直视镜头，高清质感，自然真实。`,
      `发型细节：${style.visual}。`,
      `性别参考：${request.gender === "female" ? "女性" : "男性"}。`,
      SCENE_PROMPTS[request.scene],
      "不要改变人物身份、年龄、表情、妆容、脸部比例和身体姿态。",
      "避免夸张变脸、避免卡通风、避免文字水印覆盖人脸。"
    ].join("\n")
  }));
}
