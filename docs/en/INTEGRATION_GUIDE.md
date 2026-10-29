# Local Integration Guide — Windows PowerShell

[English index](README.md) · [Bahasa Indonesia](../id/INTEGRATION_GUIDE.md) · [Backend](../../backend/README.md) · [Frontend](../../frontend/README.md)

## Prerequisites

Git, compatible Python 3.11, Node.js/npm, optional NVIDIA driver, and the **real** trained checkpoint `models/labelalignment_primary_best.pt`. The experiment notebook is `notebooks/labelalignment-qa.ipynb`; do not retrain merely to run the API.

## Terminal 1 — Start backend

```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\backend'
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If using NVIDIA CUDA, install a driver-compatible CUDA-enabled PyTorch build in the **same** `.venv`, and verify:

```powershell
.\.venv\Scripts\python.exe -c "import torch; print(torch.__version__, torch.version.cuda, torch.cuda.is_available()); print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')"
```

**Caution:** `torch.cuda.is_available() == True` is not proof of GPU execution by the API. The audited `detector.py` does not explicitly pass `device=0`; confirm request-level device and compare cold/warm model latency before making that claim.

## Terminal 2 — Start frontend

```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\frontend'
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm ci
npm run dev
```

Frontend at `http://127.0.0.1:5173/`, OpenAPI at `http://127.0.0.1:8000/docs`. Check `frontend/.env` against `.env.example` and point it at the running API.

## Repeatable smoke-test procedure

1. Open frontend and verify connectivity. Query `GET /api/v1/health` and `GET /api/v1/model` for readiness.
2. Upload a clean, unannotated image with known usage rights; record confidence, model version, inference time and detections.
3. The previously annotated sample may be used for an integration smoke test only, not a generalization benchmark.
4. Compare exported actual JSON with the API output, not only the visual rectangle.
5. Run tests and build:

```powershell
cd 'D:\porto\100 day\day 24\LabelAlignment QA\backend'
.\.venv\Scripts\python.exe -m pytest -q
cd ..\frontend
npm run build
```

## Troubleshooting

| Symptom | Diagnosis |
|---|---|
| `npm run dev` exits | Run `node -v`, `npm -v`, `npm ci` and capture actual stderr |
| API disconnected | Keep Uvicorn running and verify `frontend/.env` |
| HTTP `503` | Verify real `.pt` at configured model path; check exact ontology |
| Unexpected class label | Compare checkpoint `model.names` with source ID mapping |
| Zero detections | May be legitimate; inspect domain shift, input and confidence threshold |
| CUDA found, inference still slow | Separate first load, warm inference, network transfer and device execution |
| HTTP `413` | Default backend upload limit is 10 MB |
| HTTP `422` | Validate multipart field `file`, confidence 0.05–0.95, IoU 0.1–0.9 |

## Security and deployment

The above setup is a localhost research configuration. Before exposure to the internet, add reverse-proxy HTTPS, strict CORS, appropriate authentication/rate limits, image pixel and byte limits, safe logging/retention, and independent security testing. Confirm source image/model licenses before redistribution. See the root README for overall deployment roadmap.
