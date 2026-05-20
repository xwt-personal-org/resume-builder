# PDF Export Parity Audit - 2026-05-10

## Scope
- Templates: `classic`, `modern`, `minimal`, `compact`
- Languages: `zh`, `en`
- States: main preview, `/export` screen preview, `/export` print media

## Parallel Subagent Findings
- `subagent:export-route-readiness`: `/export` used a fixed 500 ms print timer, mutated the persisted Zustand store, and used merge-only emphasis restore. Fix: render from an explicit snapshot and wait for preview, fonts, images, and RAF stability before `window.print()`.
- `subagent:print-css-page-size`: print CSS lacked explicit print color preservation and only resized the outer preview frame. Fix: add `print-color-adjust`, reset print margins/overflow, and force direct template roots to inherit the print frame.
- `subagent:template-classic-parity`: Classic mostly shared the render path, but depended on parent print sizing. Fix: centralize template root sizing and use a common A4 frame.
- `subagent:template-modern-parity`: Modern root used fixed px width and sidebar columns depended on inherited box sizing. Fix: make the root `width: 100%`, add explicit `boxSizing`, fixed flex basis, and shared CJK font tokens.
- `subagent:template-minimal-parity`: Minimal reproduced the reported risk through print media switching the frame from `794px` to `210mm` plus timer-based printing. Fix: stabilize print readiness, inherit template root sizing, and tokenise section header rule/spacing.
- `subagent:template-compact-parity`: Compact shared the timing issue and lacked the documented compact highlight cap. Fix: use the shared frame/readiness path and cap compact highlights at three items.

## Fix Summary
- Removed dynamic template imports from `PreviewPanel`.
- Added explicit preview snapshot props for `/export`, so export no longer writes into the persisted app store.
- Added `data-template`, `data-language`, `data-export-mode`, and `data-export-ready` markers.
- Replaced fixed print delay with DOM/font/image/two-RAF readiness.
- Normalized template roots through `RESUME_TEMPLATE_ROOT_STYLE`.
- Added print media resets and exact color printing.
- Added `tests/export-parity.spec.ts` covering 8 template-language combinations with a mocked `window.print`.

## Residual Notes
- `@chrome` was requested but is not an available plugin in this session. The in-app Browser plugin was attempted for a local smoke pass but timed out during connection; final front-end acceptance was completed with Playwright Chromium automation in `tests/export-parity.spec.ts`.
- Legacy SVG and react-pdf export renderers still have policy differences from the React preview path. They are outside the one-click `/export` print path fixed here.
