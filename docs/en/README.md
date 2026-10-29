# English Documentation — LabelAlignment QA

> **Day 24 / 100 Days of Projects** · A YOLOv8n bottle-label condition research prototype with FastAPI and React, **not** a certified manufacturing inspection system.

[Project README](../../README.md) · [Bahasa Indonesia](../id/README.md) · [Documentation index](../README.md)

## Project overview and status

**Problem:** human visual review of bottle labels can be inconsistent. An object detector can help review source-defined label categories, but calibrated angle or displacement measurements require a different geometry and validation protocol. **Current scope:** learn three dataset classes, expose real-image inference through an API and browser, and report results honestly.

| Before | Now (29 October 2026) | Next |
|---|---|---|
| Annotated public source images, no combined application | Trained YOLOv8n baseline, saved held-out reports, local FastAPI + React integration | Manual duplicate review, raw-image and external-domain tests, production hardening and deployment |

A user-observed local browser test returned a detection on an image **already containing rendered annotations**; this is an integration smoke test, not an independent accuracy test. PyTorch identified the RTX 3050 Ti in a terminal test, but use of GPU for HTTP inference has not been confirmed.

## Documentation map

| Document | Purpose |
|---|---|
| [DATASETS.md](DATASETS.md) | Source provenance, licensing, classes, split, leakage |
| [METHODOLOGY.md](METHODOLOGY.md) | Training, model selection, metrics and API contract |
| [LIMITATIONS.md](LIMITATIONS.md) | Scientific claims and deployment readiness |
| [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) | Windows setup, testing and troubleshooting |

**Source-of-truth hierarchy:** `notebooks/labelalignment-qa.ipynb` records the experiment; `reports/*.json` and `reports/*.csv` provide measured evidence; `backend/` and `frontend/` provide implementation; `assets/` holds actual project images. Do not combine metrics from incompatible splits or datasets.

## Key research findings

- **210** primary source images, split **136 train / 39 validation / 35 test**, seed 42.
- **Precision 0.7827; recall 0.9258; mAP50 0.9870; mAP50–95 0.7395** on the 35-image held-out test, per `reports/primary_heldout_metrics.json`.
- **26 visually similar cross-split candidates** detected by dHash; human adjudication is pending.
- **No computed label angle or offset, and no calibrated manufacturing pass/fail decision.**

## Real project figures and screenshots

![Annotated ground-truth examples](../../assets/plots/ground_truth_examples.png)

![Held-out model predictions](../../assets/plots/heldout_predictions.png)

![Data split distribution](../../assets/plots/split_counts.png)

![Visual near-duplicate review](../../assets/plots/near_duplicate_review.png)

![Local inference on previously annotated sample](../../assets/examples/gpu_test_result.jpg)

![Local inspection application](../../assets/screenshots/Screenshot%202026-10-29%20212808.png)

The sample `assets/examples/test_01.jpg` already includes a bounding-box visualization and must not be presented as an independent raw-image accuracy example. The figures are research artifacts, not factory certification evidence.

## Repository and reproducibility

The standard root directories are `notebooks/`, `models/`, `reports/`, `assets/`, `backend/`, `frontend/`, `docs/`, and `scripts/`. A legacy `app/` folder containing placeholders is also present in the audited GitHub tree and must not be mistaken for the actual implementation. Consult the [root README](../../README.md) and [agent policies](../../AGENTS.md) before changing paths.

Use the actual primary Kaggle mount, preserve the source class ordering, run the original notebook, record dependencies and split fingerprints, and check dataset redistribution permissions. Software is licensed under [MIT](../../LICENSE); third-party datasets and derived weight redistribution require independent clearance. Public deployment requires API tests, input controls, private image handling, and security review.

## FAQ

**Does mAP50 98.7% mean 98.7% of factory bottles pass?** No: mAP is object-detection performance on this test set. **Is ONNX used by the browser?** No; the current API loads `.pt`. **Why did an external bottle image yield zero detections?** The model may not generalize; investigate threshold and domain shift before diagnosing a bug. **Where is the checkpoint?** The application expects a local `models/labelalignment_primary_best.pt`; it is not guaranteed to be downloadable from GitHub.
