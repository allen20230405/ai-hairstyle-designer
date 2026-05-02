import type { Gender, GenerateHairstylesRequest, HairstyleResult, SceneType } from "../../src/types/api.js";

type HairstylePrompt = Omit<HairstyleResult, "imageUrl"> & {
  prompt: string;
};

type HairstyleStyle = {
  name: string;
  advice: string;
  visual: string;
};

const STYLE_LIBRARY: Record<Gender, Record<SceneType, HairstyleStyle[]>> = {
  female: {
    daily: [
      { name: "空气感锁骨发", advice: "轻盈自然，适合日常出门和通勤。", visual: "空气感锁骨发，发尾微卷，层次柔和，低维护自然蓬松" },
      { name: "自然内扣中长发", advice: "干净耐看，日常打理成本低。", visual: "自然内扣中长发，发尾轻微内扣，发根自然蓬松" },
      { name: "轻薄八字刘海长发", advice: "修饰额头和颧骨，整体温柔不夸张。", visual: "轻薄八字刘海长发，脸侧碎发自然过渡，柔顺发丝" },
      { name: "松弛感中短发", advice: "自然随性，适合不想明显改变的人。", visual: "松弛感中短发，发尾轻盈外翻，脸侧层次自然" },
      { name: "低层次直发", advice: "清爽耐看，突出原本人像气质。", visual: "低层次直发，发丝顺滑，发尾轻薄，整体干净" },
      { name: "软空气刘海中长发", advice: "柔和额头比例，日常感更强。", visual: "软空气刘海中长发，刘海轻薄，发尾自然弧度" }
    ],
    work: [
      { name: "低层次职场锁骨发", advice: "利落专业，适合办公室和会议。", visual: "低层次职场锁骨发，线条干净，发尾轻收，质感顺滑" },
      { name: "侧分柔顺中长发", advice: "显得稳重清爽，适合通勤和面试。", visual: "侧分柔顺中长发，侧分发线，发面整洁，少量脸侧层次" },
      { name: "知性低马尾造型", advice: "简洁干练，保留女性柔和感。", visual: "知性低马尾造型，低位收束，额前少量碎发，轮廓整洁" },
      { name: "法式侧分锁骨发", advice: "专业但不刻板，适合职场形象照。", visual: "法式侧分锁骨发，侧分线自然，发尾轻弯，轮廓利落" },
      { name: "通勤低盘发", advice: "干净稳重，适合正式场合。", visual: "通勤低盘发，低位盘发，碎发克制，头顶自然蓬松" },
      { name: "齐肩顺直发", advice: "清爽高效，适合长期职场使用。", visual: "齐肩顺直发，发尾齐整，发面顺滑，脸侧少量修饰" }
    ],
    date: [
      { name: "法式层次卷", advice: "温柔有氛围，适合约会和近距离拍照。", visual: "法式层次卷发，自然蓬松，轻薄刘海，脸侧弧度柔和" },
      { name: "慵懒空气卷长发", advice: "增加亲和力，画面更柔软。", visual: "慵懒空气卷长发，大弧度自然卷，发丝轻盈，发尾松弛" },
      { name: "温柔半扎发", advice: "甜美但不过度，适合晚餐和出游。", visual: "温柔半扎发，顶部微蓬，脸侧留出自然卷碎发" },
      { name: "初恋感长直发", advice: "干净温柔，适合自然约会风格。", visual: "初恋感长直发，发丝顺滑，脸侧轻薄层次，发尾自然" },
      { name: "轻甜公主切", advice: "更有记忆点，但保持自然不过度。", visual: "轻甜公主切，脸侧短层次，长发主体顺滑，边缘柔和" },
      { name: "云朵感大卷发", advice: "氛围感更明显，适合拍照。", visual: "云朵感大卷发，卷度松软，头顶蓬松，发尾轻盈" }
    ],
    party: [
      { name: "柔雾短波波", advice: "更上镜，适合聚会拍照和轻造型。", visual: "柔雾短波波头，干净轮廓，微内扣，发面有光泽" },
      { name: "复古大波浪", advice: "造型感更强，适合晚宴和派对。", visual: "复古大波浪长发，大卷弧度，侧分轮廓，发丝光泽明显" },
      { name: "精致高颅顶卷发", advice: "提升头包脸比例，拍照更有存在感。", visual: "精致高颅顶卷发，发根蓬松，脸侧层次卷，整体精致" },
      { name: "轻奢侧分卷发", advice: "更成熟精致，适合晚间聚会。", visual: "轻奢侧分卷发，深侧分，大弧度卷，发面光泽" },
      { name: "甜酷高马尾", advice: "利落醒目，适合派对和拍照。", visual: "甜酷高马尾，高位收束，发尾卷曲，额前碎发精致" },
      { name: "港风蓬松卷发", advice: "复古感明显，整体更有存在感。", visual: "港风蓬松卷发，发量饱满，卷度明显，侧区层次丰富" }
    ]
  },
  male: {
    daily: [
      { name: "自然纹理短发", advice: "清爽自然，适合日常出门。", visual: "自然纹理短发，顶部蓬松，两侧清爽，纹理轻松" },
      { name: "低维护碎盖短发", advice: "不需要强造型，日常更随性。", visual: "低维护碎盖短发，额前自然碎发，整体干净柔和" },
      { name: "清爽圆寸渐变", advice: "简单利落，适合想减少打理的人。", visual: "清爽圆寸渐变，两侧渐变，顶部短而整洁" },
      { name: "自然短碎发", advice: "轻松随性，适合日常生活。", visual: "自然短碎发，顶部碎发自然，轮廓干净" },
      { name: "柔和前刘海短发", advice: "降低距离感，看起来更亲和。", visual: "柔和前刘海短发，额前自然垂落，两侧轻收" },
      { name: "轻蓬松短发", advice: "精神但不夸张，日常适配度高。", visual: "轻蓬松短发，发根自然蓬松，发束轻微纹理" }
    ],
    work: [
      { name: "轻商务侧分", advice: "低调成熟，适合通勤和商务场合。", visual: "轻商务侧分，发流自然，边缘整洁，整体成熟" },
      { name: "干净背头短发", advice: "更专业正式，适合会议和面试。", visual: "干净背头短发，发面顺滑，额头露出，两侧利落" },
      { name: "短侧分纹理发", advice: "保持精神感，不显得过度造型。", visual: "短侧分纹理发，顶部轻纹理，侧区收窄，发际线干净" },
      { name: "商务寸头渐变", advice: "利落可靠，适合正式工作环境。", visual: "商务寸头渐变，两侧渐变清晰，顶部整齐" },
      { name: "稳重三七分", advice: "成熟稳重，不显油腻。", visual: "稳重三七分，发线自然，顶部顺滑，侧边整洁" },
      { name: "低调露额短发", advice: "显精神，适合职业形象。", visual: "低调露额短发，额头露出，顶部轻蓬，两侧收窄" }
    ],
    date: [
      { name: "蓬松前刺", advice: "更年轻有精神，适合约会氛围。", visual: "蓬松前刺短发，动感纹理，顶部轻微立体" },
      { name: "韩式纹理中短发", advice: "柔和亲近，适合自然风格。", visual: "韩式纹理中短发，额前自然弧度，发丝柔软蓬松" },
      { name: "微卷松弛短发", advice: "降低距离感，看起来更轻松。", visual: "微卷松弛短发，顶部微卷，轮廓自然，发尾轻盈" },
      { name: "清爽逗号刘海", advice: "柔和五官，适合约会拍照。", visual: "清爽逗号刘海，额前弧度自然，顶部轻蓬" },
      { name: "少年感碎发", advice: "亲和自然，适合轻松约会。", visual: "少年感碎发，额前碎发柔和，发尾轻盈" },
      { name: "自然微分短发", advice: "干净温和，保持真实感。", visual: "自然微分短发，中间微分，发丝柔软，轮廓自然" }
    ],
    party: [
      { name: "立体油头渐变", advice: "造型感更强，适合聚会拍照。", visual: "立体油头渐变，发面有光泽，两侧渐变清晰" },
      { name: "凌感湿发纹理", advice: "更时髦醒目，适合夜间聚会。", visual: "凌感湿发纹理，发束清晰，顶部凌乱但有秩序" },
      { name: "高颅顶飞机头", advice: "提升轮廓存在感，上镜更精神。", visual: "高颅顶飞机头，前额上扬，顶部立体，两侧干净" },
      { name: "暗黑侧背发", advice: "更有个性，适合夜间聚会。", visual: "暗黑侧背发，侧背方向明显，发束有光泽" },
      { name: "潮流狼尾短发", advice: "更醒目，适合想尝试个性造型。", visual: "潮流狼尾短发，后颈轻长，顶部层次明显" },
      { name: "硬朗寸头雕刻", advice: "轮廓更强，上镜更利落。", visual: "硬朗寸头雕刻，两侧干净，边缘线条清晰" }
    ]
  }
};

const SCENE_PROMPTS: Record<SceneType, string> = {
  daily: "场景风格：日常自然，发型要适合平时出门和日常通勤，轻松、耐看、好打理，不要过度造型。",
  work: "场景风格：工作职场，发型要显得干练、精神、专业，适合办公室、通勤、会议和面试。",
  date: "场景风格：约会氛围，发型要温柔、有亲和力、显脸小，有自然精致的氛围感。",
  party: "场景风格：聚会拍照，发型要更上镜、更精致，有轻微造型感，但仍保持真实自然。"
};

function hashText(text: string): number {
  return Array.from(text).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function pickSeededStyles(styles: HairstyleStyle[], seed: string): HairstyleStyle[] {
  const remaining = [...styles];
  const selected: HairstyleStyle[] = [];
  let state = hashText(seed);

  while (selected.length < 3 && remaining.length > 0) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const index = state % remaining.length;
    selected.push(...remaining.splice(index, 1));
  }

  return selected;
}

export function buildHairstylePrompts(request: GenerateHairstylesRequest): HairstylePrompt[] {
  const seed = request.variationSeed || `${request.gender}-${request.scene}`;
  const styles = pickSeededStyles(STYLE_LIBRARY[request.gender][request.scene], seed);

  return styles.map((style, index) => ({
    styleId: `${request.gender}-${request.scene}-00${index + 1}`,
    name: style.name,
    advice: style.advice,
    prompt: [
      `参考用户头像图片：${request.imageUrl}`,
      `参考图人物，保持原图人物100%的面部特征：五官、脸型、眼耳鼻嘴、下巴轮廓、肤色完全不变。只改变发型为${style.name}。正面人像照，正脸直视镜头，高清质感，自然真实。`,
      `发型细节：${style.visual}。`,
      `性别参考：${request.gender === "female" ? "女性" : "男性"}。`,
      SCENE_PROMPTS[request.scene],
      `本次随机种子：${seed}。请根据参考图中可见的脸型轮廓、五官比例、发量、发际线和整体气质自由微调刘海、层次、卷度、发尾长度和蓬松度。`,
      `必须生成适合该场景的${style.name}，不要退回通用发型或其他场景发型。`,
      "不要改变人物身份、年龄、表情、妆容、脸部比例和身体姿态。",
      "避免夸张变脸、避免卡通风、避免文字水印覆盖人脸。"
    ].join("\n")
  }));
}
