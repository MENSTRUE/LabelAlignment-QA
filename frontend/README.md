# Frontend — Inspection Workbench

[Project](../README.md) · [Backend](../backend/README.md) · [Agent rules](AGENTS.md)

## Implemented application

React 18, TypeScript and Vite power a responsive local research workbench. The UI uploads images to the real backend, shows bounding-box previews, three source-defined class counts, adjustable detection confidence, API connection indicators, and a JSON export option. This is **not** a static mocked detection dashboard.

![Actual browser workbench](../assets/screenshots/Screenshot%202026-10-29%20212808.png)

The screenshot records one local integration smoke test with an already-annotated sample image; it does not demonstrate independent test accuracy or factory-grade QA.

## Source map

| Path | Responsibility |
|---|---|
| `src/pages/Workbench.tsx` | User workflow and display states |
| `src/services/api.ts` | API requests and endpoint configuration |
| `src/types/api.ts` | Shared frontend response types |
| `src/styles/global.css` | Layout, visual tokens and responsive design |
| `src/main.tsx` | React application entry point |
| `package.json` | Vite, TypeScript, React scripts |
| `.env.example` | Public API base URL example |

The current front end is a single-page workbench, despite a sidebar entry referencing research baseline. Do not claim a completed independent research-dashboard page without inspecting the implementation.

## Setup and run — PowerShell

```powershell
cd "D:\porto\100 day\day 24\LabelAlignment QA\frontend"
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://127.0.0.1:5173/` and keep the terminal running. Start FastAPI separately at `http://127.0.0.1:8000`. Check that the variable named in `.env.example` points to your backend. `.env` is local configuration and should stay ignored by Git.

## User testing procedure

1. Verify the UI reports API connected, then explicitly test backend model loading.
2. Upload a **raw** image without existing boxes if making a qualitative detection assessment.
3. Set confidence (default 25%) and run inspection. Both positive detections and a valid zero-detection outcome must display without errors.
4. Verify result boxes, class names, dimensions, and count against the JSON API response.
5. Export JSON, inspect its actual content, and confirm loading, error and empty states behave correctly.

The known local test using `assets/examples/test_01.jpg` returned one `class_perfect label` box in the application. That image already contains earlier bounding-box graphics, and is valid only as a transport/integration smoke test.

## Build and quality checks

```powershell
npm run build
npm run dev
```

`npm run build` runs TypeScript and the Vite production compilation; it is not an end-to-end visual test. Tests and CI coverage are not evidenced as complete. Add actual browser/API integration and accessibility checks before release.

## Safety and deployment

Do not leak tokens into `VITE_` variables, which are embedded in the browser bundle. Keep image uploads local or disclose any remote processing. Deploy backend and frontend with HTTPS, restricted origins and request limits. The current UI's condition classes are **research categories**, not certified conformity decisions.

## Troubleshooting

- `npm run dev` exits: check Node/npm versions, package install output and `npm run build` errors.
- API disconnected: start Uvicorn on port 8000, verify frontend environment base URL and CORS.
- `0 detections`: read API JSON before treating it as frontend failure; domain shift is possible.
- Output has duplicate boxes: uploaded sample may already have annotations baked into image pixels.
- Export button disabled: perform a successful analysis first; browser download restrictions may apply.
