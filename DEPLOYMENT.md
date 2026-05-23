# Deployment Guide

This document outlines the deployment strategy, checklist, and smoke tests for releasing the Resume Builder as a public web application under a custom domain.

## Selected Deployment Mode

**Node.js Deployment (Default Next.js Server)**

We have chosen standard Node.js deployment (e.g., via Vercel, Railway, or a traditional VPS running `next start`) instead of Static Export (`output: "export"`). 

**Reasoning:**
The application includes API routes (`/api/ai/resume`, `/api/runtime/shutdown`) which require a Node.js server. Next.js static export does not support API routes, and the AI integration requires server-side processing to protect the Google AI API key.

## Environment Variables

### Required for AI features

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_AI_API_KEY` | Google AI Studio API key for Gemini | Yes (for AI) |
| `GOOGLE_AI_MODEL` | Gemini model name (default: `gemini-2.5-flash`) | No |

### Other variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to `production` for production builds | Auto |
| `APP_URL` | Public URL of the application (for CI) | No |

> ⚠️ **Security**: The `GOOGLE_AI_API_KEY` must never use the `NEXT_PUBLIC_` prefix. It is read only on the server side. Never commit real API keys to the repository.

### Setting up locally

```bash
cp .env.example .env.local
# Edit .env.local with your actual API key
```

### Setting up on hosting providers

- **Vercel**: Add `GOOGLE_AI_API_KEY` in Project Settings → Environment Variables
- **Railway**: Add in Variables tab
- **VPS**: Set in your process manager (pm2, systemd) or shell environment

## Local Development Commands

- Start local development server: `npm run dev` (Runs on port 3001)
- Build for production: `npm run build`
- Start local production server: `npm run start`

## Validation Commands

Before deploying or merging changes, ensure the following commands pass:
- **Linting:** `npm run lint`
- **Build:** `npm run build`
- **Visual Tests:** `npm run test:visual`
- **Export Parity Tests:** `npm run test:export-parity`
- **AI Tests:** `npm run test:ai`

*Note: If intentional UI changes are made, update visual baselines using `npm run test:visual:update`.*

## Custom Domain Binding Checklist

When deploying to a public host with a custom domain, ensure you follow these provider-neutral steps:

1. **DNS Configuration:** Add the necessary `A` and/or `CNAME` or `ALIAS` records provided by your hosting platform to your domain registrar's DNS settings.
2. **TLS/SSL Certificate:** Ensure your hosting platform automatically provisions a TLS certificate (e.g., via Let's Encrypt), or manually upload your certificate.
3. **Environment Variables:** Set `GOOGLE_AI_API_KEY` for AI features. Set `NODE_ENV=production` (usually default on modern hosting platforms).
4. **App URL:** If your CI or deployment platform requires it, ensure `APP_URL` is set to your new public domain (e.g., `APP_URL=https://resume.yourdomain.com`).

## Production Smoke Checklist

After every deployment, verify the public UI against these criteria:

- [ ] **Homepage Load:** The main page loads without errors or console warnings.
- [ ] **Template Switch:** Switching between Classic, Modern, Minimal, and Compact templates works seamlessly.
- [ ] **Language Switch:** Toggling between Chinese and English updates the UI strings.
- [ ] **Workspace Tabs:** Edit, AI Assist, Layout, and Export tabs switch correctly.
- [ ] **AI Assistant (if API key configured):** AI modes generate results, preview works, apply/discard works.
- [ ] **AI Error Handling (if no API key):** AI panel shows a clear error message about missing configuration.
- [ ] **JSON Export/Import:** You can export the resume data as JSON and successfully import it back.
- [ ] **SVG Export:** Clicking SVG export correctly downloads the resume as an SVG file.
- [ ] **PDF Print Flow:** Clicking the PDF export button successfully opens the `/export` page and triggers the browser print dialog.
- [ ] **Privacy Notice Visible:** The privacy notice about AI data processing via Google Gemini API is clearly visible.

## Privacy & Data Flow

- **Without AI**: All resume data is stored in the browser's localStorage. No data is uploaded to any server.
- **With AI features**: When the user explicitly clicks "Generate" in the AI assistant, the following data is sent to the Google Gemini API through our server:
  - Current resume content
  - Job description (if provided)
  - Personal materials (if provided)
  - Target role (if provided)
- The server does **not** persist, log, or store any of this data.
- The API key is read from `process.env.GOOGLE_AI_API_KEY` on the server and is never sent to the browser.

## Rollback Instructions

If a production deployment introduces critical regressions:
1. **Immediate Rollback:** Use your hosting provider's dashboard (e.g., Vercel, Netlify) to instantly revert to the previously successful deployment build.
2. **Git Revert:** If manual rollback is required on a VPS, checkout the previous stable commit tag, run `npm ci && npm run build && npm run start`, and restart the Node process.
3. **Analyze:** Do not attempt hotfixes in production. Diagnose the issue locally, write tests to catch the regression, and deploy a new version following the validation checklist.
