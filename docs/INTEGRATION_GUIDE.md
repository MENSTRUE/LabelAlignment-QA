# Day 24 — Full-stack integration guide

**This is an overlay package, not a replacement repository.** Copy `backend/` and `frontend/` from this ZIP into `D:\porto\100 day\day 24\LabelAlignment QA`. Do not overwrite existing files without reviewing differences. Existing `notebooks/`, `models/`, `reports/`, `assets/`, `docs/`, README and LICENSE remain untouched.

## Important model requirement
Place the REAL trained checkpoint at `models/labelalignment_primary_best.pt` (already visible in user's screenshot). `models/labelalignment_primary_best.onnx` is preserved but backend uses the `.pt` checkpoint for exact Ultralytics postprocessing. Missing checkpoint -> HTTP 503. No retraining.

## Start backend (Terminal 1, PowerShell)
```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\backend'
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
Check http://localhost:8000/docs and http://localhost:8000/api/v1/model.

## Start frontend (Terminal 2, PowerShell)
```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\frontend'
Copy-Item .env.example .env
npm install
npm run dev
```
Open http://localhost:5173. Run `npm run build` after installation.

## Tests
From `backend/`: `.\.venv\Scripts\python.exe -m pytest -q`.
Upload an unseen JPG/PNG and confirm actual bounding boxes, label class and confidence; inspect API response and exported JSON.

## Honest model scope
Checkpoint was trained on 3 source-defined classes. It cannot determine calibrated physical angle/offset, no certified factory pass/fail, and uncertainty remains on 35-image held-out evaluation and near-duplicate candidate audit. Results are for research demonstration only.

## Commit message
`feat: integrate real YOLOv8 label inspection API and React workbench`

## Push
```powershell
git status
git add backend frontend
git commit -m 'feat: integrate real YOLOv8 label inspection API and React workbench'
git push origin main
```
Before pushing, verify there are no secrets or large models staged. `.env` and `.venv` should be ignored by existing root `.gitignore`.
