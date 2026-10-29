# Model Registry — LabelAlignment QA

[Project overview](../README.md) · [Experiment evidence](../reports/README.md)

## Intended artifacts

| Filename | Role | Recorded evidence | Runtime use |
|---|---|---|---|
| `labelalignment_primary_best.pt` | Ultralytics YOLOv8n PyTorch checkpoint | `../reports/training_run.json` and `../reports/final_summary.json` | **Backend consumes this** |
| `labelalignment_primary_best.onnx` | Portable inference export | `../reports/onnx_export.json` reports `status: ok` | Not wired into FastAPI in the audited source |

The GitHub tree audited for this documentation did not include either weight file. They were shown in the user's local project. **Do not assume git clone provides models.** Transfer the actual checkpoint from your Kaggle research artifacts or another authorized storage location and verify it before starting inference. Do not invent a Releases URL.

## Checkpoint contract

**Task:** object detection of source-defined bottle label condition classes.

| ID | Exact class name |
|---:|---|
| 0 | `class_imperfect label` |
| 1 | `class_no label` |
| 2 | `class_perfect label` |

The API checks `model.names` against this map and rejects a checkpoint with a different label ontology. Do not rename classes, remap indices, convert the task to segmentation, or substitute a generic pretrained model.

## Reproducible model loading

From the project root, after backend dependencies are installed:

```powershell
cd backend
.\.venv\Scripts\python.exe -c "from ultralytics import YOLO; m=YOLO('../models/labelalignment_primary_best.pt'); print(m.names)"
```

For CUDA verification:

```powershell
.\.venv\Scripts\python.exe -c "import torch; print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')"
```

**Important:** CUDA being available does not demonstrate API inference chose the GPU. The audited `backend/app/inference/detector.py` does not explicitly set `device=0`; observe runtime device in an API-linked test and document it. The separate direct Ultralytics test did explicitly use GPU. No retraining is necessary for the already working checkpoint.

## Inference parameters and responsibility

The backend currently uses `imgsz=640`, query-provided confidence and IoU, and `max_det=25`. The checkpoint predicts axis-aligned boxes; its output cannot independently establish label rotation angle or mechanical offset. `models/` stores only model artifacts and metadata, not raw training data or fabricated example images.

## ONNX caveat

`../reports/onnx_export.json` reports successful creation of an ONNX file in Kaggle, **not parity testing** against PyTorch output. Before supporting it in the app, verify runtime providers, output shape, preprocessing, class map, NMS, confidence behavior, and tolerance on fixed image samples.

## Licensing and provenance

The root MIT license governs the project software; it does not automatically license dataset images, pretrained weights, or imported model artifacts. Verify source terms before redistributing a checkpoint. Record model checksum, source archive, version, and provenance before any public release. See [`../docs/DATASETS.md`](../docs/DATASETS.md).
