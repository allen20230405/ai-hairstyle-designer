# Ark Vercel Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the MVP mock-only API facade with Vercel Serverless API handlers that upload images to Vercel Blob and call 火山方舟 for face analysis and hairstyle generation.

**Architecture:** The React app calls local `/api/v1/*` endpoints. Vercel Node functions own all third-party credentials and use shared server helpers for Ark client creation, face-type parsing, prompt generation, and JSON responses.

**Tech Stack:** Vite, React, TypeScript, Vercel Serverless Functions, `openai`, `@vercel/blob`, `formidable`, Vitest.

---

### Task 1: Dependencies and Environment Template

**Files:**
- Modify: `package.json`
- Create: `.env.example`

- [ ] Add dependencies `openai`, `@vercel/blob`, `formidable`, `@types/formidable`, and `@vercel/node`.
- [ ] Add `.env.example` with `ARK_API_KEY`, `ARK_BASE_URL`, `ARK_VISION_MODEL`, `ARK_IMAGE_MODEL`, and `BLOB_READ_WRITE_TOKEN`.
- [ ] Run `npm.cmd install --cache .npm-cache --ignore-scripts` after user confirmation.

### Task 2: Shared Server Helpers

**Files:**
- Create: `api/_lib/http.ts`
- Create: `api/_lib/env.ts`
- Create: `api/_lib/ark.ts`
- Create: `api/_lib/face.ts`
- Create: `api/_lib/hairstyles.ts`
- Create: `api/_lib/face.test.ts`
- Create: `api/_lib/hairstyles.test.ts`

- [ ] Write tests for parsing model JSON into supported face types.
- [ ] Implement `parseFaceAnalysis`.
- [ ] Write tests for generating exactly three hairstyle prompts and metadata.
- [ ] Implement prompt generation.
- [ ] Add shared JSON response helpers and Ark OpenAI client factory.

### Task 3: Vercel API Routes

**Files:**
- Create: `api/v1/upload-image.ts`
- Create: `api/v1/analyze-face.ts`
- Create: `api/v1/generate-hairstyles.ts`

- [ ] Implement multipart upload parsing with `formidable`.
- [ ] Upload accepted image buffers to Vercel Blob using `put`.
- [ ] Implement Ark vision call and JSON parsing.
- [ ] Implement Seedream image generation loop for three hairstyle prompts.
- [ ] Return contract-compatible JSON from every endpoint.

### Task 4: Frontend API Service

**Files:**
- Modify: `src/services/api.ts`
- Create: `src/services/api.test.ts`

- [ ] Write tests for multipart upload request, JSON request bodies, and error mapping.
- [ ] Replace mock delegation with fetch calls to `/api/v1/upload-image`, `/api/v1/analyze-face`, and `/api/v1/generate-hairstyles`.
- [ ] Keep existing page flow unchanged.

### Task 5: Verification and Commit

**Files:**
- Modify as needed.

- [ ] Run `node_modules\.bin\tsc.cmd --noEmit`.
- [ ] Run `npm.cmd test`.
- [ ] Run `npm.cmd run build`.
- [ ] Commit with message `feat: integrate Ark and Vercel Blob APIs`.

## Self-Review

- Spec coverage: image upload, face analysis, image generation, environment variables, key safety, and frontend API replacement are covered.
- Placeholder scan: no unresolved implementation placeholders.
- Type consistency: endpoint request/response shapes match `src/types/api.ts`.
