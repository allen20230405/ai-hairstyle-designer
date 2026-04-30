# 火山方舟与 Vercel Blob 正式接入设计

日期：2026-04-30

## 范围

将当前 AI 发型设计师 MVP 从纯 mock 服务升级为正式服务端接入：

- 用户上传图片后写入 Vercel Blob，获得可被火山方舟访问的 HTTPS 图片 URL。
- 脸型分析调用火山方舟 OpenAI 兼容 Chat Completions。
- 发型生成调用火山方舟 OpenAI 兼容 Images API。
- 前端继续调用本应用自己的 `/api/v1/*`，不暴露任何第三方密钥。

Vercel 远程部署、Git 远程推送、真实线上域名配置不在本阶段内完成；本阶段只完成代码与本地配置模板。

## 架构

保留现有 Vite React SPA，新增 Vercel Serverless API：

- `api/v1/upload-image.ts`
  - 接收 multipart 表单字段 `image`。
  - 校验图片类型。
  - 使用 `@vercel/blob` 上传文件。
  - 返回 `{ status: "success", imageUrl }`。

- `api/v1/analyze-face.ts`
  - 接收 `{ imageUrl }`。
  - 使用 `openai` SDK，`baseURL` 指向火山方舟。
  - 调用 `chat.completions.create`，模型默认 `doubao-1.5-vision-pro-250328`。
  - 要求模型只返回 JSON，并解析为 `{ faceType, confidence }`。

- `api/v1/generate-hairstyles.ts`
  - 接收 `{ imageUrl, faceType, gender }`。
  - 根据脸型与性别生成 3 个中文 prompt。
  - 调用 `client.images.generate`，模型默认 `doubao-seedream-4-5-251128`，`size="2K"`，`response_format="url"`。
  - 返回 `{ results: [{ styleId, name, advice, imageUrl }] }`。

前端 `src/services/api.ts` 改为 HTTP 调用这些 API。mock 实现保留在 `src/services/mockApi.ts`，用于后续开发 fallback 或测试。

## 环境变量

`.env.local` 由用户本地创建，不提交 git：

```env
ARK_API_KEY=
ARK_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
ARK_VISION_MODEL=doubao-1.5-vision-pro-250328
ARK_IMAGE_MODEL=doubao-seedream-4-5-251128
BLOB_READ_WRITE_TOKEN=
```

新增 `.env.example`，只包含变量名和示例值，不包含真实密钥。

## 错误处理

- API Key 缺失：返回 `500` 和明确错误码 `MISSING_ARK_API_KEY`。
- Blob Token 缺失：返回 `500` 和 `MISSING_BLOB_TOKEN`。
- 文件类型不支持：返回 `400`。
- 火山方舟响应无法解析：返回 `500`。
- 前端 API service 将非 2xx 响应转为可展示错误信息，分析页继续使用已有重试入口。

## 安全

- 第三方密钥只在 Vercel Serverless API 中读取。
- 前端 bundle 不包含 `ARK_API_KEY` 或 `BLOB_READ_WRITE_TOKEN`。
- 上传接口只接受图片类型，避免任意文件上传。
- `.env.local` 已被 `.gitignore` 忽略。

## 测试与验证

- 单元测试覆盖 HTTP API service 请求格式和错误处理。
- 服务端 helper 覆盖脸型 JSON 解析、prompt 生成、环境变量校验。
- 最终运行：
  - `node_modules\.bin\tsc.cmd --noEmit`
  - `npm.cmd test`
  - `npm.cmd run build`

如果本机 dev server 正常运行，再手动检查上传到结果页主流程。真实火山方舟调用需要用户本地填入 `.env.local`。
