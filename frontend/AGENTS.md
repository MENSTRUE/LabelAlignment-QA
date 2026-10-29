# Frontend Agent Instructions

Read [`../AGENTS.md`](../AGENTS.md), [`README.md`](README.md), and the backend response schema before making changes.

## UI/API integrity

- Maintain working React/Vite/TypeScript application under `frontend/`, not a second root-level `app/`.
- Do not generate pretend predictions, canned percentages, fake inspection counts or manufactured latency values. Visible outputs must be derived from actual API responses.
- Preserve exact backend class names and IDs; do not silently convert `class_perfect label` into manufacturing “pass”.
- Keep upload, waiting, loading, empty, success and error states clear; explicit user action should trigger inference.
- Preserve responsive behavior and keyboard semantics. Ensure selection, threshold control, preview and export have accessible labels.

## Engineering workflow

1. Inspect `src/pages/Workbench.tsx`, `src/services/api.ts`, `src/types/api.ts`, and `src/styles/global.css` before editing.
2. Keep API URL configuration externalized to the environment example. Never put secrets in `VITE_` settings.
3. When backend contracts change, update typed frontend interfaces and an integration test together.
4. Run `npm run build` and report output faithfully. Check empty/error/loading/zero-detection cases, invalid file, offline API and image preview.
5. Update `frontend/README.md`, root README and screenshots only for features actually working.

## Evidence boundaries

A nice UI screenshot proves layout only. The existing smoke-test screenshot demonstrates one completed local request and is not an accuracy benchmark. Label angle, offset, real-world calibration, and automatic compliance decisions are unsupported.
