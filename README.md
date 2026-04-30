# AI 发型设计师

手机端网页应用：用户上传头像照片，系统分析脸型，并生成 3 张发型效果图，方便在理发前预览不同造型方向。

## 功能

- 上传或拍摄头像照片
- 前端校验图片格式，并对大图执行压缩处理
- 选择性别，进入分析流程
- 调用火山方舟视觉模型分析脸型
- 调用火山方舟 Seedream 图片生成模型生成 3 张发型效果图
- 结果页支持左右滑动查看和保存图片

## 技术栈

- Vite
- React
- TypeScript
- React Router
- Vitest
- Vercel Serverless Functions
- Vercel Blob
- 火山方舟 OpenAI 兼容 API

## 项目结构

```text
api/
  _lib/                 服务端公共工具
  v1/                   Vercel API 路由
src/
  pages/                页面组件
  services/             前端 API service 和 mock service
  store/                客户端会话状态
  types/                前后端共享类型
  utils/                图片压缩等工具
docs/
  superpowers/          设计文档和实现计划
```

## 环境变量

复制 `.env.example` 为 `.env.local`，并填写真实密钥：

```env
ARK_API_KEY=你的火山方舟 API Key
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_VISION_MODEL=doubao-seed-2-0-lite-260215
ARK_IMAGE_MODEL=doubao-seedream-4-5-251128
BLOB_READ_WRITE_TOKEN=你的 Vercel Blob Token
```

注意：`.env.local` 不要提交到 Git 仓库。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173
```

如果要在本地完整测试 `/api/v1/*`，建议使用 Vercel CLI 启动：

```bash
npx vercel dev
```

## 测试与构建

运行测试：

```bash
npm test
```

生产构建：

```bash
npm run build
```

## API

### `POST /api/v1/upload-image`

接收 multipart 表单字段 `image`，上传到 Vercel Blob，返回 HTTPS 图片 URL。

返回示例：

```json
{
  "status": "success",
  "imageUrl": "https://..."
}
```

### `POST /api/v1/analyze-face`

请求：

```json
{
  "imageUrl": "https://..."
}
```

返回：

```json
{
  "faceType": "oval",
  "confidence": 0.95
}
```

### `POST /api/v1/generate-hairstyles`

请求：

```json
{
  "imageUrl": "https://...",
  "faceType": "oval",
  "gender": "female"
}
```

返回：

```json
{
  "results": [
    {
      "styleId": "female-oval-001",
      "name": "空气感锁骨发",
      "advice": "保留轻盈层次，修饰脸型比例。",
      "imageUrl": "https://..."
    }
  ]
}
```

## 部署到 Vercel

1. 将项目导入 Vercel。
2. 在 Vercel Project Settings 中配置环境变量。
3. 确认已开通 Vercel Blob，并配置 `BLOB_READ_WRITE_TOKEN`。
4. 部署后访问 Vercel 分配的 HTTPS 域名。

## 说明

当前版本已接入正式服务端 API 结构。`src/services/mockApi.ts` 保留为开发和测试参考，不会暴露任何第三方密钥。
