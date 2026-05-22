# Gemini AI Feature Integration Brief — 2026-05-20

## 1. Decision

The next implementation route is:

- Integrate Google AI Studio Gemini API.
- Use model: `gemini-2.5-flash`.
- Store the API key in local environment configuration, not in source code.
- Redesign the page using the execution-side `front-design-pencil` skill after the AI feature boundaries are implemented.

## 2. Official Documentation Notes

The official Google AI documentation says the Gemini API requires an API key, and API keys can be created and managed from Google AI Studio. It also lists environment-variable based usage as the recommended connection path and warns that hard-coding API keys is only temporary because it is not secure.

Google recommends the Google GenAI SDK as the official production-ready library, with JavaScript / TypeScript installation via:

```bash
npm install @google/genai
```

The model catalog still lists `gemini-2.5-flash` under Gemini 2.5 Flash and describes it as a price-performance model for low-latency, high-volume tasks requiring reasoning. The model naming guidance gives `gemini-2.5-flash` as a stable model example.

## 3. Security Boundary

The API key must never be exposed to the browser.

Use:

```env
GOOGLE_AI_API_KEY=your_google_ai_studio_key_here
GOOGLE_AI_MODEL=gemini-2.5-flash
```

Implementation rule:

- Keep `.env.local` ignored by Git.
- Commit only `.env.example`.
- Read `process.env.GOOGLE_AI_API_KEY` only inside server-side files.
- Do not use `NEXT_PUBLIC_GOOGLE_AI_API_KEY`.
- Do not send the key to client components.
- Do not log the key or full AI request payloads containing personal resume details.

## 4. Recommended Architecture

### Server-side API route

Create a Next.js API route:

- `src/app/api/ai/resume/route.ts`

Responsibilities:

- Validate request body.
- Read `GOOGLE_AI_API_KEY` and `GOOGLE_AI_MODEL`.
- Call Gemini through `@google/genai`.
- Return structured JSON only.
- Normalize Gemini output before returning it to the UI.
- Return safe errors for missing key, invalid input, rate limit, and model/API failures.

### AI client wrapper

Create:

- `src/lib/ai/gemini.ts`
- `src/lib/ai/prompts.ts`
- `src/lib/ai/schema.ts`

Responsibilities:

- Keep provider-specific code outside React components.
- Centralize model configuration.
- Centralize prompt templates.
- Define request and response schema.
- Add robust JSON parsing and fallback error messages.

### UI integration

Create or update:

- `src/components/ai/AiAssistantPanel.tsx`
- `src/components/ai/AiResultPreview.tsx`
- `src/components/ai/AiApplyControls.tsx`
- `src/components/editor/SidebarEditor.tsx`
- `src/app/page.tsx`

Initial AI functions:

1. JD-targeted resume optimization.
2. Personal material to resume draft.
3. Bullet point polishing.
4. Chinese / English resume text generation.
5. Controlled apply: user previews AI output before mutating Zustand store.

Do not let the AI directly overwrite the resume without explicit user confirmation.

## 5. Data Contract

Request payload:

```ts
interface AiResumeRequest {
  mode: "generate" | "optimize" | "polish" | "translate";
  language: "zh" | "en";
  targetRole?: string;
  jobDescription?: string;
  personalMaterials?: string;
  currentResume: ResumeData;
}
```

Response payload:

```ts
interface AiResumeResponse {
  summary: string;
  proposedResumePatch: Partial<ResumeData>;
  sectionNotes: Partial<Record<SectionKey, string>>;
  warnings: string[];
}
```

The API route must reject responses that cannot be parsed into this shape.

## 6. UX Direction for front-design-pencil

The redesign should solve the layout pressure introduced by AI functions.

Recommended page model:

- Keep right-side live A4 preview visible.
- Convert the left side from a single editor rail into a structured workspace.
- Add top-level modes:
  - Edit
  - AI Assist
  - Layout
  - Export
- AI Assist should have:
  - JD input
  - personal material input
  - action cards
  - loading state
  - result preview
  - apply / discard controls
  - visible privacy/API notice
- Export and template controls should remain easy to access.
- The design must preserve export visual parity and not alter resume template output unless explicitly required.

## 7. Validation Focus

Minimum validation:

- `npm run lint`
- `npm run build`
- `npm run test:visual`
- `npm run test:export-parity`

Additional recommended tests:

- API route returns safe error when `GOOGLE_AI_API_KEY` is missing.
- API route rejects invalid payload.
- API route uses `gemini-2.5-flash` by default.
- Client AI panel handles loading, error, result preview, apply, and discard.
- Applying AI patch mutates only confirmed resume fields.
- Visual snapshots updated only after `front-design-pencil` redesign is reviewed.

## 8. Out of Scope

- User accounts.
- Cloud sync.
- Payment.
- WeChat mini program.
- Tauri / desktop packaging.
- Streaming chat unless explicitly added later.
- Storing user resume data server-side.
- Committing real `.env.local` or any API key.
