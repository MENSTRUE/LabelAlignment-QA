# Backend — LabelAlignment QA

## Current implementation
FastAPI API with lazy loading of a **real** YOLOv8 checkpoint at `../models/labelalignment_primary_best.pt`, source-class ontology validation, upload limits, EXIF-aware image decoding, true inference boxes and returned annotated JPEG preview. No synthetic fallback predictions.

## Setup (PowerShell)
```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

## API
- `GET /api/v1/health` — server and checkpoint status
- `GET /api/v1/model` — model loading state / class mapping
- `POST /api/v1/detect?confidence=0.25&iou=0.45` — `multipart/form-data`, `file`; outputs detections (`xyxy` in pixels), image dimensions, measured time, annotated JPEG base64 and research disclaimer
- `/docs` — interactive Swagger UI

If the model is missing, `POST /detect` responds HTTP 503 rather than inventing a result. Supported images: JPG/PNG/WebP/BMP, 10 MB max, 25 megapixels max.

## Tests
` .\.venv\Scripts\python.exe -m pytest -q ` from backend folder. Tests cover API health and validation; real model smoke test must be performed locally with checkpoint. Load/memory/accuracy not validated here.

## Constraints
Source classes: imperfect label / no label / perfect label. Detection output is **not** geometric angle/offset measurement or manufacturing certification. Default CORS is local development only; configure before deployment. Do not expose publicly without rate limiting/authentication if production deployment is contemplated.
