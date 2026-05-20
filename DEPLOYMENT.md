# Deployment Guide

This document outlines the deployment strategy, checklist, and smoke tests for releasing the Resume Builder as a public web application under a custom domain.

## Selected Deployment Mode

**Node.js Deployment (Default Next.js Server)**

We have chosen standard Node.js deployment (e.g., via Vercel, Railway, or a traditional VPS running `next start`) instead of Static Export (`output: "export"`). 

**Reasoning:**
The application currently includes an API route (`/api/runtime/shutdown`) which provides essential local-only runtime controls (e.g. for desktop-like batched environments). Next.js static export does not support API routes, and attempting an export will cause the build to fail. To preserve these local functionalities without breaking the build, the standard Node server approach is the safest and most reliable deployment method for this stage.

## Local Development Commands

- Start local development server: `npm run dev` (Runs on port 3001)
- Build for production: `npm run build`
- Start local production server: `npm run start`

## Validation Commands

Before deploying or merging changes, ensure the following commands pass:
- **Linting:** `npm run lint`
- **Build:** `npm run build`
- **Visual Tests:** `npm run test:visual`
- **Export Parity Tests:** `npm run test:export-parity` (Covered by playwright visual tests matrix in `visual.spec.ts`)

*Note: If intentional UI changes are made, update visual baselines using `npm run test:visual:update`.*

## Custom Domain Binding Checklist

When deploying to a public host with a custom domain, ensure you follow these provider-neutral steps:

1. **DNS Configuration:** Add the necessary `A` and/or `CNAME` or `ALIAS` records provided by your hosting platform to your domain registrar's DNS settings.
2. **TLS/SSL Certificate:** Ensure your hosting platform automatically provisions a TLS certificate (e.g., via Let's Encrypt), or manually upload your certificate.
3. **Environment Variables:** Set any required production variables. In this application, ensure `NODE_ENV=production` is set (usually default on modern hosting platforms).
4. **App URL:** If your CI or deployment platform requires it, ensure `APP_URL` is set to your new public domain (e.g., `APP_URL=https://resume.yourdomain.com`).

## Production Smoke Checklist

After every deployment, verify the public UI against these criteria:

- [ ] **Homepage Load:** The main page loads without errors or console warnings.
- [ ] **Template Switch:** Switching between Classic, Modern, Minimal, and Compact templates works seamlessly.
- [ ] **Language Switch:** Toggling between Chinese and English updates the UI strings.
- [ ] **JSON Export/Import:** You can export the resume data as JSON and successfully import it back.
- [ ] **SVG Export:** Clicking SVG export correctly downloads the resume as an SVG file.
- [ ] **PDF Print Flow:** Clicking the PDF export button successfully opens the `/export` page and triggers the browser print dialog.
- [ ] **Privacy Notice Visible:** Ensure the privacy text ("🔒 隐私说明：您的简历数据仅保存在浏览器本地...") is clearly visible in the sidebar, reinforcing that no user data is uploaded.

## Rollback Instructions

If a production deployment introduces critical regressions:
1. **Immediate Rollback:** Use your hosting provider's dashboard (e.g., Vercel, Netlify) to instantly revert to the previously successful deployment build.
2. **Git Revert:** If manual rollback is required on a VPS, checkout the previous stable commit tag, run `npm ci && npm run build && npm run start`, and restart the Node process.
3. **Analyze:** Do not attempt hotfixes in production. Diagnose the issue locally, write tests to catch the regression, and deploy a new version following the validation checklist.
