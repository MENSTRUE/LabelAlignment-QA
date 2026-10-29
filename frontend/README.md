# Frontend — LabelAlignment QA

## Implemented UI
React + Vite + TypeScript studio with responsive upload, drag/drop, confidence slider, API health state, real inference results returned by FastAPI, bounding-box image preview, model class counts, and JSON export. There are **no dummy predictions**.

## Run (PowerShell)
```powershell
cd frontend
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm install
npm run dev
```
Open `http://localhost:5173` and separately start backend on port 8000. Ensure the real checkpoint is present in root `models/`. `npm run build` checks TS/Vite production build.

## Data flow
Image submitted as `multipart/form-data` to `POST /api/v1/detect`. Response gives annotated preview as base64 and object detections. Image and response are kept in browser memory; JSON export excludes the base64 image. Offline backend and missing checkpoint are displayed as errors rather than fake success.

## Status
Files are implementation-ready, but a real end-to-end run is unverified until run on the user's machine using the trained checkpoint. CORS local development only.
