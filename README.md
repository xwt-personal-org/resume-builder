# Resume Builder — AI 驱动的校招简历构建器

AI-powered bilingual (Chinese/English) resume builder optimized for campus recruitment, built with Next.js 16, React 19, and Google Gemini AI.

## Features

- **AI Resume Assistant** — Generate, optimize, polish, and translate resume content using Google Gemini AI (`gemini-2.5-flash`)
- **4 Templates** — Classic, Modern, Minimal, Compact
- **Bilingual** — Full Chinese/English support
- **PDF Export** — One-click PDF via browser print
- **SVG/JSON Export** — Additional export formats
- **Privacy-Aware** — Resume data stored locally in browser; AI requests are processed server-side

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up AI (optional)

To use AI features, you need a Google AI Studio API key:

1. Go to [Google AI Studio](https://aistudio.google.com/apikey) and create an API key
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Edit `.env.local` and add your API key:
   ```env
   GOOGLE_AI_API_KEY=your_actual_api_key_here
   GOOGLE_AI_MODEL=gemini-2.5-flash
   ```

> ⚠️ **Security**: Never commit `.env.local` or share your API key. The `.gitignore` ignores local env files while keeping `.env.example` tracked. The API key is used server-side only and is never exposed to the browser.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

## AI Features

The AI assistant supports four modes:

| Mode | Description |
|------|-------------|
| **Generate** | Create a resume draft from personal materials and/or job description |
| **Optimize** | Tailor existing resume to a specific job description |
| **Polish** | Improve wording, grammar, and impact of bullet points |
| **Translate** | Translate resume content between Chinese and English |

### How it works

1. Switch to the **AI Assist** tab in the left panel
2. Select an AI mode and fill in the relevant inputs
3. Click **Generate** — your data is sent to Google Gemini API via the server
4. **Preview** the AI suggestions before applying
5. Click **Apply** to write changes to your resume, or **Discard** to cancel

### Privacy Notice

When using AI features, your resume content, job descriptions, and personal materials are sent to the Google Gemini API through our Next.js server route. The server does not store your data. Without AI features enabled, all data remains in your browser's local storage.

## Validation Commands

```bash
npm run lint           # ESLint
npm run build          # Production build
npm run test:visual    # Playwright visual snapshots
npm run test:export-parity  # PDF export parity checks
npm run test:ai        # AI assistant integration tests
```

CI runs these validation scripts on pushes to `master` (current default branch), `main`, and `develop`, and on pull requests targeting `master` or `main`.

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS 4
- **State**: Zustand 5 (persisted to localStorage)
- **AI**: Google Gemini API via `@google/genai` (server-side only)
- **PDF**: Browser print to PDF
- **Testing**: Playwright

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
