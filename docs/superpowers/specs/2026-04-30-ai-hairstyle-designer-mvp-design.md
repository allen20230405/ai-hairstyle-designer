# AI Hairstyle Designer MVP Design

Date: 2026-04-30

## Scope

Build a mobile-first single-page web app for "AI 发型设计师". The first version is a demonstrable MVP, not a production AI integration. It must deliver the complete user flow from photo upload to analysis progress to three generated hairstyle results, while keeping the API service boundary compatible with the future REST contract.

Remote Git hosting is out of scope for this phase. The project will be initialized and committed locally; a remote can be added later when a repository URL is available.

## Chosen Approach

Use Vite, React, and TypeScript for a static SPA with a mock API layer.

This approach is preferred because it delivers the mobile product experience quickly, avoids blocking on model credentials or image storage, and leaves a clean replacement point for Vercel API Routes or a real REST backend later.

Rejected alternatives:

- Next.js full-stack MVP: closer to production Vercel routing, but heavier for a mock-first demo.
- Pure HTML/CSS/JS prototype: fast visually, but weaker for typed API contracts, tests, and later backend replacement.

## Architecture

The app has three routes:

- `/`: upload photo, choose gender, preview image, start analysis.
- `/analysis`: show staged progress while mock upload, face analysis, and hairstyle generation run.
- `/result`: show face type, confidence, three hairstyle results, and save controls.

Key modules:

- `src/services/api.ts`: public API facade used by pages. Exposes `uploadImage`, `analyzeFace`, and `generateHairstyles`.
- `src/services/mockApi.ts`: mock implementation with realistic delays, progress-friendly behavior, and response structures matching the product contract.
- `src/types/api.ts`: shared types for `FaceType`, `Gender`, upload, analysis, and hairstyle generation responses.
- `src/utils/imageCompression.ts`: browser image compression helper for files over 2MB.
- `src/store/session.ts`: client-side session state for the active photo, selected gender, face analysis, and generated hairstyles.

Pages must depend on `services/api.ts`, not on mock internals. Replacing mock behavior with real Vercel/API calls should not require rewriting the UI flow.

## Data Flow

1. User opens `/`.
2. User selects or captures an image.
3. Frontend validates image MIME type.
4. If the file is larger than 2MB, frontend compresses it.
5. User selects gender and starts analysis.
6. App stores the local preview and selected gender in session state, then navigates to `/analysis`.
7. Analysis page calls the API facade in sequence:
   - `uploadImage(image)`
   - `analyzeFace(imageUrl)`
   - `generateHairstyles({ imageUrl, faceType, gender })`
8. Results are stored in session state.
9. App navigates to `/result`.
10. User swipes through three results and saves an image.

If `/analysis` or `/result` is opened without required session state, the app redirects to `/`.

## UI/UX

The visual direction is "美发沙龙感": warm neutral background, restrained typography, dark primary actions, and photo-led composition. The first screen is the usable tool, not a landing page.

Global layout:

- Mobile-first with a centered app shell and `max-width: 430px`.
- Desktop visits should still feel like a phone app preview.
- Bottom primary actions should respect mobile safe-area insets.
- Cards and image panels should use modest radii around 8px unless a specific component needs a little more softness.

Home page:

- Product name at top.
- Upload area in the main content.
- Image preview after selection.
- Gender segmented control.
- Primary button disabled until image and gender are available.

Analysis page:

- Circular or compact photo preview.
- Loading animation.
- Staged text such as "压缩照片", "分析脸型", "生成发型方案".
- Retry and return-home controls on failure.

Result page:

- Face type and confidence summary.
- Three swipeable result cards.
- Each card includes image, hairstyle name, short recommendation, and save button.
- Include a "重新上传" path back to `/`.

## Mock AI Behavior

The mock layer returns valid contract-shaped data:

- Upload returns a local object URL or mock image URL string.
- Analysis returns one of the seven supported face types and a confidence value.
- Generation returns exactly three hairstyle results.

The mock result images can be deterministic styled preview assets derived from the selected gender and face type. They do not need to alter the user's real face in the MVP, but the UI should make the future replacement path clear by treating them as generated images.

## Error Handling

Validation:

- Accept only `image/jpeg`, `image/png`, and `image/webp`.
- Show a clear error for unsupported file types.

Compression:

- Compress images larger than 2MB before upload.
- If compression fails, continue with the original file and show a non-blocking warning that the image is large.

Process failures:

- Upload, analysis, and generation errors should all show a retry option.
- Generation failure may also offer return to home.
- Mock APIs should include controllable failure paths in tests, but normal app behavior should succeed by default.

Saving:

- Prefer `<a download>` for saving generated images.
- On mobile browsers where download is limited, show guidance to long-press the image to save.

## Testing

Use automated tests for behavior that carries product risk:

- Image validation and compression decision logic.
- Mock API response shape.
- Session state read/write behavior.
- Home page disabled/enabled start button behavior.
- Gender selection.
- Redirect when required session state is missing.
- Successful analysis flow stores three results.

Final verification commands:

- `npm test`
- `npm run build`

If a development server is started, manually inspect the three routes and the upload-to-result happy path.

## Delivery

The implementation should include:

- Vite React TypeScript app.
- `.gitignore` covering dependencies, build output, env files, and `.superpowers`.
- Local git repository.
- One local commit for the approved design, followed by implementation commits or a final local commit after the MVP is complete.

Remote hosting and Vercel deployment are deferred until the user provides a Git remote URL and any required deployment credentials.
