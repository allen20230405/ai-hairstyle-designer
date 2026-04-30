# AI 发型设计师 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Vite React TypeScript SPA that demonstrates the AI 发型设计师 upload, analysis, generated-results, and save flow with a mock API layer.

**Architecture:** The UI is a static SPA with three routes: `/`, `/analysis`, and `/result`. Pages use a typed API facade in `src/services/api.ts`; the facade delegates to deterministic mock implementations so the UI can later switch to real Vercel API routes without changing page logic.

**Tech Stack:** Vite, React, TypeScript, React Router, Vitest, Testing Library, CSS Modules/global CSS.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create package and config files**

Create `package.json` with:

```json
{
  "name": "ai-hairstyle-designer",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^3.0.0"
  }
}
```

Create Vite, TypeScript, and test setup files with standard React JSX config and `jsdom` test environment.

- [ ] **Step 2: Install dependencies**

Run: `npm.cmd install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Create minimal app shell**

Create `src/main.tsx` that renders `<App />` into `#root`. Create `src/App.tsx` with React Router routes for `/`, `/analysis`, and `/result`, initially pointing to simple placeholder components.

- [ ] **Step 4: Verify baseline**

Run: `npm.cmd test`

Expected: Vitest runs with no tests or one placeholder test, exit code 0.

Run: `npm.cmd run build`

Expected: TypeScript and Vite build pass.

### Task 2: Types, Session Store, and Image Utilities

**Files:**
- Create: `src/types/api.ts`
- Create: `src/store/session.ts`
- Create: `src/store/session.test.ts`
- Create: `src/utils/imageCompression.ts`
- Create: `src/utils/imageCompression.test.ts`

- [ ] **Step 1: Write failing session tests**

Test that the store can set, read, and clear image/gender/analysis/result state.

Run: `npm.cmd test -- src/store/session.test.ts`

Expected: fail because `session.ts` does not exist.

- [ ] **Step 2: Implement session store**

Implement a small module-level store with `getSession`, `setSession`, `updateSession`, and `clearSession`.

- [ ] **Step 3: Run session tests**

Run: `npm.cmd test -- src/store/session.test.ts`

Expected: pass.

- [ ] **Step 4: Write failing image utility tests**

Test `isSupportedImageType`, `shouldCompressImage`, and `formatFileSize`.

Run: `npm.cmd test -- src/utils/imageCompression.test.ts`

Expected: fail because utility functions do not exist.

- [ ] **Step 5: Implement image utilities**

Implement MIME validation, 2MB compression threshold decision, readable file-size formatting, and browser canvas compression helper.

- [ ] **Step 6: Run image utility tests**

Run: `npm.cmd test -- src/utils/imageCompression.test.ts`

Expected: pass.

### Task 3: Mock API Facade

**Files:**
- Create: `src/services/mockApi.ts`
- Create: `src/services/api.ts`
- Create: `src/services/mockApi.test.ts`

- [ ] **Step 1: Write failing mock API tests**

Test that upload returns `{ status: "success", imageUrl }`, face analysis returns a supported face type with confidence between 0 and 1, and generation returns exactly 3 results.

Run: `npm.cmd test -- src/services/mockApi.test.ts`

Expected: fail because service files do not exist.

- [ ] **Step 2: Implement mock API**

Implement deterministic mock upload, analysis, and generation functions. Generation should return salon-themed SVG data URLs so result images render without external assets.

- [ ] **Step 3: Implement API facade**

Export `uploadImage`, `analyzeFace`, and `generateHairstyles` from `src/services/api.ts`, delegating to mock functions.

- [ ] **Step 4: Run mock API tests**

Run: `npm.cmd test -- src/services/mockApi.test.ts`

Expected: pass.

### Task 4: Pages and Flow

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/AnalysisPage.tsx`
- Create: `src/pages/ResultPage.tsx`
- Create: `src/pages/HomePage.test.tsx`
- Create: `src/pages/AnalysisPage.test.tsx`
- Create: `src/pages/ResultPage.test.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Write failing home page tests**

Test that the start button is disabled initially, selecting gender and a valid image enables it, and unsupported image type shows an error.

Run: `npm.cmd test -- src/pages/HomePage.test.tsx`

Expected: fail because the page does not exist.

- [ ] **Step 2: Implement home page**

Build upload, preview, gender segmented control, validation, compression decision, and start navigation to `/analysis`.

- [ ] **Step 3: Run home page tests**

Run: `npm.cmd test -- src/pages/HomePage.test.tsx`

Expected: pass.

- [ ] **Step 4: Write failing analysis page tests**

Test that missing session data redirects to `/`, and valid session runs the API flow and reaches `/result` with three stored results.

Run: `npm.cmd test -- src/pages/AnalysisPage.test.tsx`

Expected: fail before implementation.

- [ ] **Step 5: Implement analysis page**

Build staged progress UI, call `uploadImage`, `analyzeFace`, and `generateHairstyles`, write results to session, and navigate to `/result`.

- [ ] **Step 6: Run analysis page tests**

Run: `npm.cmd test -- src/pages/AnalysisPage.test.tsx`

Expected: pass.

- [ ] **Step 7: Write failing result page tests**

Test that missing generated results redirects to `/`, valid results render three cards, and save controls use download links.

Run: `npm.cmd test -- src/pages/ResultPage.test.tsx`

Expected: fail before implementation.

- [ ] **Step 8: Implement result page**

Build summary, horizontally scrollable result cards, save links, and restart action.

- [ ] **Step 9: Run page tests**

Run: `npm.cmd test -- src/pages/HomePage.test.tsx src/pages/AnalysisPage.test.tsx src/pages/ResultPage.test.tsx`

Expected: pass.

### Task 5: Styling, App Polish, and Verification

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `.gitignore` if needed

- [ ] **Step 1: Add global mobile-first styling**

Create warm salon visual styling with centered `max-width: 430px`, safe-area bottom actions, stable image aspect ratios, restrained card radii, and accessible focus states.

- [ ] **Step 2: Run full tests**

Run: `npm.cmd test`

Expected: all tests pass.

- [ ] **Step 3: Run production build**

Run: `npm.cmd run build`

Expected: build succeeds and emits `dist/`.

- [ ] **Step 4: Start dev server for manual QA**

Run: `npm.cmd run dev -- --port 5173`

Expected: local app available at `http://127.0.0.1:5173`.

- [ ] **Step 5: Commit implementation**

Run:

```powershell
git add .
$env:GIT_AUTHOR_NAME='Codex'; $env:GIT_AUTHOR_EMAIL='codex@example.local'; $env:GIT_COMMITTER_NAME='Codex'; $env:GIT_COMMITTER_EMAIL='codex@example.local'; git commit -m "feat: build AI hairstyle designer MVP"
```

Expected: local implementation commit created.

## Self-Review

- Spec coverage: upload, compression decision, gender selection, analysis progress, mock face analysis, three generated results, save links, retry/error paths, local git delivery, and verification commands are covered.
- Placeholder scan: no unresolved TBD/TODO instructions.
- Type consistency: page flow uses the same `Gender`, `FaceType`, and API response names across types, services, store, and page tests.
