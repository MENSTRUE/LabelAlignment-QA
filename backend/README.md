# Backend — Real YOLOv8 Inference API

[Project](../README.md) · [Model contract](../models/README.md) · [Agent rules](AGENTS.md)

## Implemented scope

The backend is a FastAPI application that accepts an uploaded image, validates and decodes the file, loads the **actual project YOLOv8n `.pt` checkpoint**, verifies the checkpoint's three class names, runs inference, and returns structured detections plus an annotated JPEG preview encoded in Base64. It is a **research prototype**, not a certified alignment measurement service.

## Architecture and source of truth

| Path | Responsibility |
|---|---|
| `app/main.py` | App factory, CORS, health endpoint, router wiring |
| `app/core/config.py` | Pydantic settings; root model path and allowed origins |
| `app/api/routes/detection.py` | `GET /api/v1/model`, `POST /api/v1/detect` |
| `app/inference/detector.py` | Lazy checkpoint loading, ontology checks, inference, preview rendering |
| `app/schemas/detection.py` | Typed API response structures |
| `app/services/images.py` | File format / image decode safeguards |
| `tests/test_api.py` | Existing API test definitions |

The configured model path is `../models/labelalignment_primary_best.pt` relative to backend. The repository checkout may not contain the weight file; obtain the actual artifact from your Kaggle run.

## Local setup — Windows PowerShell

```powershell
cd "D:\porto\100 day\day 24\LabelAlignment QA\backend"
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If you want the NVIDIA GPU, install an appropriate CUDA-enabled PyTorch wheel for your supported hardware and driver; verify `torch.cuda.is_available()`. The locally observed RTX 3050 Ti CUDA availability does **not by itself guarantee** GPU execution through the API because the current detector doesn't specify `device=0`. Never silently assume GPU or claim exact benchmark timings without an API-specific trace.

## API endpoints

| Endpoint | Method | Contract |
|---|---|---|
| `/api/v1/health` | GET | App status and model availability status; **not proof model loaded** |
| `/api/v1/model` | GET | Model present/loaded status, configured checkpoint path, expected classes |
| `/api/v1/detect` | POST | Multipart `file`, query `confidence` [0.05,0.95], `iou` [0.1,0.9] |
| `/docs` | GET | Auto-generated Swagger specification UI |

Example request:

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/v1/detect?confidence=0.25&iou=0.45" -F "file=@..\assets\examples\test_01.jpg"
```

**Response:** source class IDs, names, confidence scores, `xyxy` pixel boxes, source image dimensions, `inference_ms` and `preview_jpeg_base64`; zero detections is a valid response. Note that `test_01.jpg` already has annotated boxes and should be used only for smoke testing.

## Validation and security

The route reads up to the configured `max_upload_mb` limit (default 10 MB) and rejects oversized content with HTTP 413. Confidence and IoU are constrained by FastAPI. Loading failures and wrong class ontology generate a service error instead of invented detections. The model is lazily loaded under a lock. A production design still needs explicit decoded pixel-count limits, authentication, HTTPS, rate limiting, audit strategy, safe file policy, dependency pinning and deployment tests.

## Tests and limitations

```powershell
.\.venv\Scripts\python.exe -m pytest -q
```

The source includes tests, but the complete automated suite has not been independently verified for this documentation release. The browser integration screenshot and direct GPU smoke test provide narrower evidence. A `GET /health` with `status=ok` does not prove checkpoint inference succeeded.

## Troubleshooting

- `503 Checkpoint missing`: place the genuine model in `../models/` or configure `model_path`.
- `503 ontology mismatch`: verify `model.names` and source dataset; do not override class IDs.
- `422`: inspect multipart field name, confidence/IoU bounds.
- `413`: image exceeds `max_upload_mb`; do not bypass the limit without justification.
- `0 detections`: lower confidence only for diagnosis; check domain shift, image resolution, and actual input content.
- High first-request time: separate cold start / image decode / model compute; don't equate wall time with GPU kernel inference.
- CORS error: align frontend URL and `cors_origins`, keep allowed origins restrictive.

## Deployment guidance

For controlled deployments use a pinned build, model checksum, limited CORS, HTTPS proxy, observed health and readiness checks, appropriate memory/GPU configuration, and monitoring. **Not production validated.**
