# Research Methodology and Inference Contract

[English index](README.md) · [Bahasa Indonesia](../id/METHODOLOGY.md) · [Original notebook](../../notebooks/README.md)

## Research question and scope

Can a detector predict three **source-defined bottle-label condition classes**, and can the saved model be integrated with a local browser inspection workbench? This is separate from physically measuring label rotation or displacement.

## Experiment 01 — Archived primary baseline

- **Source:** `label_v2`; 210 images; grouped holdout 136/39/35; random seed 42.
- **Model:** YOLOv8n, Ultralytics, preserved source ontology IDs 0/1/2.
- **Run metadata:** `reports/training_run.json` lists Ultralytics 8.4.192 and approximately 90.18 seconds in the recorded research environment. See the notebook for training hyperparameters; do not guess absent configurations.
- **Model selection:** select checkpoint on validation data; reserve held-out test for final evaluation.
- **Held-out metrics (35 images):** precision 0.782705, recall 0.925798, mAP50 0.9870, mAP50–95 0.739511.

| Class | Held-out AP50–95 |
|---|---:|
| `class_imperfect label` | 0.793010 |
| `class_no label` | 0.746450 |
| `class_perfect label` | 0.679071 |

These are detection metrics from `reports/primary_heldout_metrics.json`, not classification accuracy or application response success. A 35-image test set limits statistical certainty.

![Held-out predictions](../../assets/plots/heldout_predictions.png)

## End-to-end application architecture

`React/Vite Workbench.tsx` → `POST /api/v1/detect` → `backend/app/services/images.py` input validation and decode → `backend/app/inference/detector.py` load/validate YOLO `.pt`, run inference and draw boxes → response JSON with class, confidence, xyxy, elapsed time and JPEG preview → React results. `GET /api/v1/health` and `GET /api/v1/model` expose status; source code is the contract authority.

`backend/app/core/config.py` points to `models/labelalignment_primary_best.pt` by default. Model loading is lazy and verifies the exact class order. During source audit, `model.predict` uses `imgsz=640` and `max_det=25` and accepts query confidence/IoU, but does **not** explicitly set `device=0`; detecting CUDA from a separate command does not prove each API request uses GPU.

## ONNX and missing geometry

`reports/onnx_export.json` records ONNX export as `status: ok`. This does **not** establish numerical parity with the `.pt` model; the app currently uses PyTorch weights. `reports/geometry_contract.json` requires label corners, bottle axis, reference center and dimensions to measure angle/offset. Axis-aligned YOLO boxes cannot independently provide these geometries; manufacturing pass/fail is withheld.

## Reproducibility and revision policy

Mount the primary Kaggle source and run `notebooks/labelalignment-qa.ipynb` with frozen dependencies, random seed, split manifests and artifact hashes. Keep Experiment 01 intact. Add future **Experiment 02 / 03** as documented append-only revisions; never invent metrics, erase baselines or choose a champion using held-out test results.

## Interpretation warnings

- Successful inference demonstrates execution on one image, **not** prediction correctness on an external distribution.
- Zero detections can be a genuine model output for out-of-domain images; investigate domain, confidence and preprocessing.
- `assets/examples/test_01.jpg` contains previously rendered annotations and is only useful for technical smoke testing.
