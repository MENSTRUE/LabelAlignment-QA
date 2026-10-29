# LabelAlignment QA

**Day 24 / 100 Days of Projects · Computer Vision · Bottle Label Condition Detection · Research Prototype**

[![Python](https://img.shields.io/badge/Python-3.11%20(local)-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI-009688?logo=fastapi&logoColor=white)](backend/README.md)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-149ECA?logo=react&logoColor=white)](frontend/README.md)
[![YOLOv8](https://img.shields.io/badge/Detection-YOLOv8n-334155)](notebooks/README.md)
[![Status](https://img.shields.io/badge/Status-Research%20Prototype-7A6A3D)](#project-status-and-before--now--next)
[![License](https://img.shields.io/badge/Code-MIT-blue)](LICENSE)

> **Scope:** an evidence-backed, reproducible object-detection research baseline and local inspection workbench for **source-defined bottle-label condition classes**. This is **not** a calibrated label alignment measurement system, manufacturing conformity test, or production quality-control certification.

**Repository:** https://github.com/MENSTRUE/LabelAlignment-QA  
**Research source of truth:** [`notebooks/labelalignment-qa.ipynb`](notebooks/labelalignment-qa.ipynb), [`reports/`](reports/), and the original dataset's annotations.  
**Runtime source of truth:** [`backend/app/`](backend/app/), [`frontend/src/`](frontend/src/), and the locally obtained checkpoint whose class ontology is verified on load.  
**Development rules:** [`AGENTS.md`](AGENTS.md).

---

## Table of contents

1. [Overview and real-world problem](#overview-and-real-world-problem)
2. [Objectives and scope](#objectives-and-scope)
3. [Project status and Before–Now–Next](#project-status-and-before--now--next)
4. [Research evidence and visual gallery](#research-evidence-and-visual-gallery)
5. [Data sources and provenance](#data-sources-and-provenance)
6. [Dataset audit, annotation contract and splits](#dataset-audit-annotation-contract-and-splits)
7. [Leakage and duplicate assessment](#leakage-and-duplicate-assessment)
8. [Methodology and model](#methodology-and-model)
9. [Experiment design and model selection](#experiment-design-and-model-selection)
10. [Held-out evaluation](#held-out-evaluation)
11. [Results interpretation and error analysis](#results-interpretation-and-error-analysis)
12. [Working application architecture](#working-application-architecture)
13. [Repository structure](#repository-structure)
14. [Requirements and setup](#requirements-and-setup)
15. [Running the system](#running-the-system)
16. [Reproducibility and model artifact contract](#reproducibility-and-model-artifact-contract)
17. [Testing and validation](#testing-and-validation)
18. [Deployment guidance](#deployment-guidance)
19. [Security and privacy](#security-and-privacy)
20. [Known limitations and claim boundaries](#known-limitations-and-claim-boundaries)
21. [Troubleshooting](#troubleshooting)
22. [FAQ](#faq)
23. [Roadmap](#roadmap)
24. [License, attribution and references](#license-attribution-and-references)

---

## Overview and real-world problem

Bottle labeling is a visible quality concern in packaging: absent, damaged, poorly applied, or visually inconsistent labels can affect identification and downstream inspection. Manual inspection is costly to scale consistently; machine vision may help prioritize review. A real industrial decision, however, requires more than classifying a picture. It requires a clear geometry specification, reference fixtures, calibrated tolerances, lighting controls, dataset coverage, and verified error rates at operating conditions.

**LabelAlignment QA** addresses the *research and application-integration* portion of this problem. It trains/evaluates a YOLOv8n detector on three labels defined by one dataset and exposes that checkpoint through a FastAPI service and a React/TypeScript inspection interface. The UI can upload an image, request inference, display detections and confidence, inspect per-class counts, and export a JSON result. The current detector uses **axis-aligned bounding boxes (AABB)**; it does **not** calculate label rotation, displacement in millimeters, or certified accept/reject decisions.

### System questions

- Can a source-defined, three-class bottle-label detector be trained and evaluated reproducibly on a held-out set?
- Can dataset provenance, class ordering, duplicate risk and uncertainty be documented openly?
- Can the same checkpoint serve an actual local web interface through a real API rather than simulated inference?
- Which additional evidence is required before describing the system as an *alignment measurement* or factory-grade QA system?

## Objectives and scope

| Goal | Supported scope | Excluded from present claims |
| --- | --- | --- |
| Detect source-defined label conditions | Three-class object detection with bounding boxes and confidence | Guaranteed detection for arbitrary brands/backgrounds |
| Quantify baseline performance | Held-out detection metrics from the primary dataset | External factory-level accuracy or safety-critical validity |
| Deliver a working local application | React UI → FastAPI → real `.pt` checkpoint | Hosted public deployment or certified throughput SLA |
| Preserve scientific traceability | Notebook, split policy, experiment reports, plots | Guarantee that all near-duplicates were eliminated |
| Evaluate geometric feasibility | Explicit geometry contract listing missing inputs | Physical angle, offset, millimeter deviations, or calibrated PASS/FAIL |

## Project status and Before–Now–Next

| Phase | Before | Now (evidence) | Next |
| --- | --- | --- | --- |
| Data | Raw multi-source candidates | Four inventories; one primary training source; original labels retained | Manual duplicate adjudication, external test source |
| Research | No audited baseline | YOLOv8n trained; 35-image held-out evaluation; exports recorded | Repeated/group-aware validation and per-class error review |
| Models | No deployable checkpoint | `.pt` loaded locally in successful direct test; ONNX export reported by Kaggle | Verify ONNX loading/inference parity and publish controlled artifact download |
| Backend | Not present | FastAPI endpoints and image validation implemented | Automated GPU selection, latency profiling and operational hardening |
| Frontend | Not present | React inspection workbench visibly connected to API and producing a detection | Raw-image end-to-end regression set, UI automation and accessibility review |
| Production | Not assessed | Research-only decision boundary documented | Geometric reference design, tolerances, external field testing |

**Implementation evidence:** the supplied local screenshots show a successful single-image frontend/API workflow with one `class_perfect label` detection. A separate direct Ultralytics inference on `test_01.jpg` reported one detection at approximately 0.8677 confidence and 5.4 ms model inference on a CUDA-enabled environment. This is an **integration smoke test**, not a new benchmark score. The source example already contains a drawn annotation/prediction; do not treat it as an untouched image or independent accuracy evidence. A different internet image returned **zero detections** at a 25% confidence threshold; this is an observed generalization challenge, not proof of API failure.

**Important repository-state distinction:** `reports/research_gate.json` still records `app_end_to_end_verified: false` from the original Kaggle research run. The later local smoke test is additional evidence; the old report must not be silently rewritten as if Kaggle itself tested the application.

## Research evidence and visual gallery

These images are **committed project assets**, not synthetic illustrations. Their captions describe their role rather than claiming additional performance.

### Data and annotation examples

![Ground-truth annotation examples from the research notebook](assets/plots/ground_truth_examples.png)

*Ground-truth visualization used during dataset inspection. Check source labels and box coverage before interpreting label geometry.*

### Split composition

![Counts of research train, validation, and test partitions](assets/plots/split_counts.png)

*Research partition counts. Split-policy and exact manifest files, rather than the chart alone, define partition membership.*

### Held-out qualitative predictions

![Predictions from the held-out evaluation](assets/plots/heldout_predictions.png)

*Examples of held-out predictions saved during the original research execution. They do not replace aggregate or per-class metrics.*

### Visual similarity and leakage review

![Near-duplicate candidates requiring human review](assets/plots/near_duplicate_review.png)

*Visual inspection aid for candidate near-duplicates; matching a perceptual hash does not prove the same source image or leakage.*

### Local integration demonstration

![Local frontend and backend integration screenshot](assets/screenshots/Screenshot%202026-10-29%20212808.png)

*Screenshot from local integration testing. Development UI/API connectivity is not production certification.*

### Example of direct model inference

![Direct GPU inference result on an existing example](assets/examples/gpu_test_result.jpg)

*The source example `test_01.jpg` already includes a bounding-box overlay. The overlaid result is useful for verifying that inference ran, **not** for independent visual accuracy assessment.*

Other committed examples: [`test_00.jpg`](assets/examples/test_00.jpg) through [`test_11.jpg`](assets/examples/test_11.jpg). Inspect before reuse; they may contain prior annotations/overlays and should not automatically be designated raw test images.

## Data sources and provenance

Dataset lineage is recorded in [`reports/dataset_provenance.csv`](reports/dataset_provenance.csv) and the source inventory in [`reports/source_inventory.json`](reports/source_inventory.json). **Only one source was selected for the baseline**, and the other sources were inventoried but **not merged or claimed as training data**.

| Source ID | Publisher dataset | Role | Source image count in inventory |
| --- | --- | --- | ---: |
| `label_v2` | [Bottle Label Detection V2 — loliwibu](https://www.kaggle.com/datasets/loliwibu/bottle-label-detection-v2) | **Primary** training/evaluation | **210** |
| `big_cola` | [Big Cola Bottles for YOLO Quality Control — youssefeldemerdashh](https://www.kaggle.com/datasets/youssefeldemerdashh/big-cola-bottles-dataset-for-yolo-quality-control) | Inventory only | 377 |
| `label_other` | [Dataset for Bottle Label Detection — yashvisave](https://www.kaggle.com/datasets/yashvisave/dataset-for-bottle-label-detection) | Inventory only | 396 |
| `water_defects` | [Water Bottle Defect Level Detection — jihadakbr](https://www.kaggle.com/datasets/jihadakbr/water-bottle-defect-level-detection-dataset) | Inventory only | 1,500 |

Primary Kaggle mount:

```text
/kaggle/input/datasets/loliwibu/bottle-label-detection-v2
```

These data sources describe **different tasks and label ontologies**. In particular, the water-defect inventory contains bottle/brand, fill, cap, debris, and label-damage categories; these are **not interchangeable** with the three primary labels. Do not concatenate datasets or remap classes without a documented independent ontology audit and separate experiment ID.

**Licensing:** the saved provenance explicitly says publisher licensing is **unverified** for all four datasets. The repository's MIT `LICENSE` applies to repository code as specified there, **not automatically to third-party datasets, example images, annotations, or trained weights**. Confirm publication, redistribution and derivative-model permissions at each publisher page before distributing these materials beyond what the source license permits. Attribution is necessary but may not be sufficient permission.

## Dataset audit, annotation contract and splits

### Primary label ontology

Class IDs are part of the model interface. **Do not reorder, rename, translate, or normalize them inside inference code.**

| Class ID | Exact checkpoint label | Interpretation boundary |
| ---: | --- | --- |
| 0 | `class_imperfect label` | Source annotation identifies an imperfect-label condition; its precise severity criteria are not independently calibrated. |
| 1 | `class_no label` | Source annotation identifies an absent-label condition; model output is probabilistic, not absolute proof of absence. |
| 2 | `class_perfect label` | Source annotation identifies a perfect-label condition; not a certified manufacturing PASS outcome. |

The primary audit reports **210 images** and **210 source boxes**: 62 imperfect, 26 no-label, and 122 perfect-label boxes; `error_count = 0` in [`reports/primary_audit.json`](reports/primary_audit.json). These are **source annotation counts**, not predictions or post-training class-specific test support.

### Research partition contract

| Partition | Images | How obtained |
| --- | ---: | --- |
| Train | **136** | Training allocation under the research group-holdout policy |
| Validation | **39** | Separate validation allocation |
| Held-out test | **35** | Held-out portion used for final evaluation |
| **Total** | **210** | Primary-source image inventory |

Split seed: **42**. Policy: `group_holdout_from_original_train`. The audit summary lists 171 in the original train pool plus 39 validation; the research split divides the 171 pool into 136 train and 35 held-out test. The authoritative record is [`reports/split_policy.json`](reports/split_policy.json), [`reports/research_split_manifest.csv`](reports/research_split_manifest.csv), and [`reports/dataset_split_fingerprint.json`](reports/dataset_split_fingerprint.json).

> **Caution:** “group holdout” is a recorded partition policy, not proof of independence across visually similar images. Preserve and audit manifest membership before any new experiment.

## Leakage and duplicate assessment

The audit recorded:

- Exact SHA-256 and filename-family cross-split collision inventories: empty in [`reports/cross_split_collisions.json`](reports/cross_split_collisions.json).
- **26 cross-split visual near-duplicate candidates** using an **8×8 dHash** with distance threshold **5**, in [`reports/visual_leakage_audit.json`](reports/visual_leakage_audit.json) and [`reports/near_duplicate_candidates.csv`](reports/near_duplicate_candidates.csv).
- Human adjudication of the 26 candidates: **pending**.

A candidate is **not automatically a confirmed duplicate**, and an empty exact-hash collision report is **not evidence of zero visual leakage**. If manual review confirms cross-split copies or strongly dependent captures, revise the split by source groups, regenerate manifests, and run a **new named experiment**. Do not silently overwrite the original numbers or reuse the existing held-out test for repeated model selection.

## Methodology and model

### Research pipeline

```text
Dataset provenance & source inventories
              ↓
Primary label ontology / annotation audit
              ↓
Duplicate + cross-split similarity assessment
              ↓
Research train / validation / held-out test
              ↓
YOLOv8n train → validation-based checkpoint selection
              ↓
Held-out detection evaluation + per-class AP + qualitative errors
              ↓
PT checkpoint / ONNX export report / artifact manifests
              ↓
FastAPI inference service → React inspection workbench
```

Architecture: **Ultralytics YOLOv8n**, an object detector generating source-defined class IDs, confidence scores and **axis-aligned bounding boxes**. Model load checks all three class names against the expected mapping. The backend currently calls `model.predict(..., imgsz=640, max_det=25, ...)`, with request-provided confidence and IoU thresholds. Image validation and upload size controls live in the backend, not the notebook.

**Geometry contract:** [`reports/geometry_contract.json`](reports/geometry_contract.json) lists extra requirements such as four ordered label corners, bottle axis, reference center and bottle width/height. An AABB cannot directly measure printed-label rotation, physical alignment offset, or tolerance-based pass/fail. Additional annotations/calibration and an independently evaluated geometry method would be required.

## Experiment design and model selection

The notebook is the executable record of the original baseline. The saved [`reports/training_run.json`](reports/training_run.json) reports `status: trained`, Ultralytics **8.4.192**, a recorded training duration of **90.18 seconds**, and an exported checkpoint named `labelalignment_primary_best.pt`. The experiment stores a split-manifest SHA-256 to help identify the partition used.

**Selection principle:** choose checkpoint/hyperparameters using **validation**, not the held-out test. The archived `best.pt` is the reported champion artifact of the original run; the currently published JSON summaries do not provide enough evidence to reconstruct a multi-model leaderboard or assert superiority over multiple independently tuned architectures. Do not invent baseline comparisons, confidence intervals, or unrecorded training settings. Inspect the notebook's actual cells and run logs for all training-specific parameters.

The correct revision procedure is **append-only experiment tracking**: retain the baseline; create a new `Experiment 02` section, a new artifact namespace, its own split manifest and validation decision; report its held-out metrics separately. A higher number on a different split must not be advertised as an apples-to-apples improvement.

## Held-out evaluation

**Primary YOLOv8n experiment, 35 held-out images.** Values below are read from [`reports/primary_heldout_metrics.json`](reports/primary_heldout_metrics.json); they are not regenerated from the web UI.

| Detection metric | Recorded result |
| --- | ---: |
| Precision | **0.7827** |
| Recall | **0.9258** |
| mAP@0.50 | **0.9870** |
| mAP@0.50:0.95 | **0.7395** |
| Held-out images | **35** |

### Per-class AP@0.50:0.95

| Exact class name | AP@0.50:0.95 |
| --- | ---: |
| `class_imperfect label` | **0.7930** |
| `class_no label` | **0.7465** |
| `class_perfect label` | **0.6791** |

Precision/recall and mAP are **object-detection metrics**, not image-level grading accuracy, millimeter displacement, pixel-IoU segmentation, or industrial false-reject/false-accept rates. The `35` count represents held-out **images**, not automatically 35 boxes or 35 independent product/production batches.

The source dataset is small; class counts are imbalanced and potential cross-split near-duplicates remain unresolved. The results are therefore a **research baseline**, not a reliable production generalization estimate.

## Results interpretation and error analysis

Primary error-analysis artifacts: [`reports/heldout_error_cases.csv`](reports/heldout_error_cases.csv), [`assets/plots/heldout_predictions.png`](assets/plots/heldout_predictions.png), and [`reports/primary_heldout_metrics.json`](reports/primary_heldout_metrics.json).

Interpreting the results responsibly:

1. mAP@0.50 is high **on this one small source-specific held-out partition**; it does not demonstrate cross-brand or cross-factory robustness.
2. The gap between mAP@0.50 and mAP@0.50:0.95 indicates that tighter localization criteria are materially harder than loose-overlap detection.
3. The perfect-label class's per-class AP@0.50:0.95 is lower than the two other classes **in this recorded evaluation**. Do not infer statistical significance from the small sample.
4. The external Bigi bottle image returned zero detections at a 0.25 confidence threshold in one local trial. This is a useful *out-of-domain failure example*; no systematic external evaluation has yet been carried out.
5. A `class_perfect label` prediction **does not establish that printed text is level or that the label is correctly centered**. It only reports the detector's source-defined class.

## Working application architecture

```text
Browser (React / TypeScript / Vite)
  ├─ image selection and preview
  ├─ confidence control
  ├─ detection overlay / class summary / JSON export
  │
  └── HTTP request → FastAPI (backend/app/main.py)
                         ├── /api/v1/health
                         ├── /api/v1/model
                         ├── /api/v1/detect
                         ├── file and image validation
                         ├── lazy checkpoint loading
                         ├── class ontology validation
                         └── Ultralytics YOLOv8n inference
                                     ↓
                             PT checkpoint in models/
```

API routes are defined in [`backend/app/api/routes/detection.py`](backend/app/api/routes/detection.py). The `POST /api/v1/detect` endpoint accepts multipart form-data `file`, query `confidence` (**0.05–0.95**) and `iou` (**0.1–0.9**). Backend settings default to confidence **0.25**, IoU **0.45**, maximum upload **10 MB**, and local CORS origins on ports 5173. The API response includes image dimensions, class IDs/names, confidences, bounding boxes, inference duration, and a JPEG preview encoded in base64.

**Important GPU distinction:** installing CUDA-enabled PyTorch and confirming `torch.cuda.is_available() == True` establishes CUDA capability. The current committed backend `Detector.predict` does **not explicitly pass `device=0`** to `model.predict`. GPU utilization on the running API must be checked in runtime; a separate direct test successfully ran with `device=0`. Do not label the production API “GPU verified” based solely on device discovery.

## Repository structure

The following is a **summarized snapshot of the checked-in repository**, not a hypothetical future layout. `app/` contains older `.gitkeep` placeholders and is **legacy scaffold only**; active code is under `backend/` and `frontend/`. Do not add new root folders for convenience.

```text
LabelAlignment-QA/
├── README.md                    # Main project documentation
├── AGENTS.md                    # Operational coding-agent rules
├── LICENSE                      # MIT license for repository code
├── .gitignore
├── .env.example                 # Root file currently empty; backend settings have defaults
├── notebooks/
│   ├── labelalignment-qa.ipynb   # Original Kaggle research notebook
│   └── README.md
├── models/
│   └── README.md                # Local .pt/.onnx expected; weights ignored by Git
├── reports/
│   ├── primary_audit.json
│   ├── primary_heldout_metrics.json
│   ├── final_summary.json
│   ├── dataset_provenance.csv
│   ├── split_policy.json
│   ├── research_split_manifest.csv
│   ├── near_duplicate_candidates.csv
│   ├── visual_leakage_audit.json
│   ├── geometry_contract.json
│   ├── research_gate.json
│   ├── onnx_export.json
│   ├── heldout_error_cases.csv
│   └── ... other archived research evidence
├── assets/
│   ├── README.md
│   ├── plots/                    # Four research figures
│   ├── examples/                 # Annotated examples and GPU smoke-test image
│   ├── screenshots/              # Local integration screenshot
│   └── diagrams/                 # Placeholder (no verified diagram asset yet)
├── backend/
│   ├── README.md
│   ├── AGENTS.md
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── api/routes/detection.py
│   │   ├── core/config.py
│   │   ├── inference/detector.py
│   │   ├── schemas/detection.py
│   │   └── services/images.py
│   └── tests/test_api.py
├── frontend/
│   ├── README.md
│   ├── AGENTS.md
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── pages/Workbench.tsx
│       ├── services/api.ts
│       ├── styles/global.css
│       └── types/api.ts
├── docs/
│   ├── INTEGRATION_GUIDE.md
│   ├── README.md
│   ├── DATASETS.md              # Currently empty in remote snapshot
│   ├── METHODOLOGY.md           # Currently empty in remote snapshot
│   ├── LIMITATIONS.md           # Currently empty in remote snapshot
│   ├── id/
│   └── en/
├── scripts/                     # Documentation + .gitkeep
├── app/                         # Legacy empty frontend/backend placeholders
├── requirements.txt             # Currently empty; use backend/requirements.txt
└── pyproject.toml               # Currently empty; not an installable package definition
```

The fact that files appear in a tree does not mean they are implemented. Placeholder files are identified above to prevent misleading “complete repository” claims.

## Requirements and setup

### Development prerequisites

- **Windows 11 / PowerShell**, or an environment that can run Python and Node.
- **Python 3.11** recommended for the local backend environment used in testing.
- Node.js and npm supported by the existing Vite/React package dependencies.
- An existing **compatible Ultralytics YOLOv8 checkpoint** copied from the actual Kaggle output; see [model artifact contract](#reproducibility-and-model-artifact-contract).
- Optional NVIDIA GPU + driver compatible with your installed CUDA PyTorch build. CPU operation may be slower.
- Kaggle account + original primary dataset mount if reproducing the research experiment.

### Clone

```powershell
git clone https://github.com/MENSTRUE/LabelAlignment-QA.git
cd LabelAlignment-QA
```

### Backend installation (PowerShell)

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
# Optional CUDA-enabled torch must be selected for your specific NVIDIA driver.
# Install the desired compatible torch/torchvision build FIRST if using CUDA.
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pip check
```

The prior local setup successfully installed CUDA-enabled `torch 2.11.0+cu128` and `torchvision 0.26.0+cu128`, and PyTorch detected an NVIDIA RTX 3050 Ti Laptop GPU. These are **environment-specific observations**, not dependency pins or proof every contributor will obtain the same build. For current installation options, consult the [official PyTorch selector](https://pytorch.org/get-started/locally/).

### Frontend installation

```powershell
cd ..\frontend
Copy-Item .env.example .env -ErrorAction Stop
npm ci
```

Inspect `.env.example` and ensure the base API URL points to the running backend. Do not commit `.env` files containing secrets or local private settings.

## Running the system

Open **two terminals**.

**Terminal A — backend:**

```powershell
cd "D:\porto\100 day\day 24\LabelAlignment QA\backend"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/api/v1/health
- Model status: http://127.0.0.1:8000/api/v1/model

**Terminal B — frontend:**

```powershell
cd "D:\porto\100 day\day 24\LabelAlignment QA\frontend"
npm run dev
```

- UI: http://127.0.0.1:5173

**Usage:** choose a **raw, non-overlaid** bottle image, select confidence, run inspection, inspect box/class/confidence and optionally export JSON. A request that yields **zero detections** is a valid response; do not convert it to “no label” or “passed QA.”

### API example (PowerShell)

```powershell
# Replace the path with a raw image you have permission to use.
$img = "C:\path\to\raw-bottle.jpg"
curl.exe -X POST "http://127.0.0.1:8000/api/v1/detect?confidence=0.25&iou=0.45" -F "file=@$img"
```

## Reproducibility and model artifact contract

The official computational record is `notebooks/labelalignment-qa.ipynb` together with report JSON/CSV files. To reproduce research, attach the primary Kaggle dataset at the recorded mount, run the notebook in a suitable Kaggle environment, preserve the seed and split manifest, and compare derived reports and checkpoint metadata against the archived evidence. Reproducing an identical numerical model can require identical package/hardware versions and deterministic settings; the repository does not promise bit-for-bit identity on arbitrary hardware.

### Required artifacts

| Artifact | Role | Distribution / verification status |
| --- | --- | --- |
| `models/labelalignment_primary_best.pt` | Active Ultralytics checkpoint expected by backend | Present in the prior local VS Code screenshot; **not checked into GitHub** in the reviewed tree |
| `models/labelalignment_primary_best.onnx` | Research export | Kaggle `onnx_export.json` reports `status: ok`; **ONNX parity/runtime validation is not evidenced** |
| `reports/primary_heldout_metrics.json` | Final source-specific test evidence | Committed |
| `reports/research_split_manifest.csv` | Research partition identity | Committed |
| `reports/near_duplicate_candidates.csv` | Perceptual similarity candidates | Committed |
| `assets/plots/*.png` | Saved visuals from research pipeline | Committed |

**Checkpoint acquisition:** obtain `.pt` from your own original Kaggle experiment output or a future appropriately licensed release. Place the file at `models/labelalignment_primary_best.pt`. Do not rename an unrelated model and assume compatibility. The server checks class-ID mapping before loading for inference. No model download URL is claimed until an actual verified release exists.

A successful ONNX **export** is not equivalent to validated ONNX **inference**, model parity or speed benefit. Before claiming ONNX readiness, load it in the chosen inference runtime, compare outputs on the same representative images and document tolerances and hardware-specific results.

## Testing and validation

### Existing evidence

- Research: source inventory, annotation audit, split manifest, held-out detection metrics, model/export manifest.
- Runtime: successful PyTorch CUDA device check on RTX 3050 Ti; successful direct YOLO call on a source example; screenshot of a successful local frontend/API detection.
- Code: `backend/tests/test_api.py` exists, but there is no supplied CI run or saved automated test report proving all tests pass.
- External generalization: one Bigi bottle image returned zero detections. External-domain benchmark not yet designed.

### Run checks

```powershell
# Backend, in backend/
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -c "import torch; print(torch.__version__, torch.cuda.is_available())"

# Frontend, in frontend/
npm ci
npm run build
```

Suggested evaluation matrix: valid JPG/PNG/WEBP/BMP, malformed files, over-limit uploads, missing checkpoint, mismatched class metadata, 0/1/multiple detections, confidence boundaries, large-resolution images, GPU/CPU device fallback and user-facing error states. Test **raw images**, not pictures already annotated with boxes. For metrics, use a locked evaluation split and always record image counts, class support, model SHA/manifest, thresholds, software versions and hardware.

## Deployment guidance

The checked-in configuration targets **local development**, not a public hosted service. Do not deploy with `uvicorn --reload`, unrestricted CORS, publicly writable inference endpoints, or debug logging of user uploads.

Before any hosted rollout: enforce authentication and rate limits as appropriate; restrict CORS origins; apply proxy/server upload and request limits; review image decoding/decompression safety; control resource-intensive inference concurrency; pin dependencies and model SHA; implement health and warmup readiness; supply explicit CPU/GPU device configuration; collect privacy-safe performance logs; add error monitoring, container builds and CI; benchmark on actual deployment hardware; and perform security review. Publicly hosted demos should prominently state **research prototype / not certified QA**.

## Security and privacy

Current backend: validates file content via image decoding, restricts upload size (default **10 MB**) and checks checkpoint ontology. CORS allows two default local frontend origins. Check [`backend/app/services/images.py`](backend/app/services/images.py) and [`backend/app/core/config.py`](backend/app/core/config.py) for implementation details and limitations.

- Treat every uploaded image and API request as untrusted. Do not trust file extensions or client-declared content length alone.
- Avoid retaining or distributing private user images. Do not add uploaded image files to Git or log full encoded image payloads.
- Protect model artifacts and dependency supply chain; do not load untrusted `.pt`/pickle files from third parties.
- Keep `.env` out of version control and do not expose runtime internals or filesystem paths unnecessarily in public API errors.
- Large requests, concurrency, rate limiting, deployment authentication, telemetry and threat modeling require additional work before internet exposure.

## Known limitations and claim boundaries

| Claim | May be stated | Must **not** be inferred |
| --- | --- | --- |
| “We trained a YOLOv8n model” | Supported by recorded training run and checkpoint metadata | Guaranteed model suitability for any packaging line |
| “mAP@0.50 = 0.987” | On recorded **35-image source-specific held-out test** | 98.7% correct bottles or 98.7% physical QA accuracy |
| “Three label-condition classes” | Exact source annotations and model ontology | Measured physical label angle or offset |
| “No cross-split exact collisions found” | Under recorded SHA/family checks | No visually similar samples or leakage |
| “26 near-duplicate candidates” | Flagged by dHash threshold 5 | 26 proven leaks |
| “ONNX exported” | Export report records `ok` | Production-ready ONNX inference/parity |
| “GPU detected” | PyTorch CUDA direct test | All FastAPI requests actually dispatched to GPU |
| “App works on one sample” | Local integration smoke test | External-domain generalization or factory uptime |
| “Perfect label” class predicted | Source-defined model label | A calibrated PASS decision |

Unresolved priorities: cross-split manual review, 35-image test size, class imbalance, absence of out-of-domain labeled test, annotation geometry insufficient for alignment measurement, missing factory tolerance/traceability, and lack of production deployment validation.

## Troubleshooting

| Symptom | Likely diagnosis | Action |
| --- | --- | --- |
| `Checkpoint missing` / HTTP 503 | `.pt` not at configured model path | Put original checkpoint at `models/labelalignment_primary_best.pt`; verify file path and class mapping |
| `Checkpoint class ontology mismatch` | Wrong weights or class order | Inspect `model.names`; use the correct Kaggle checkpoint; **do not simply relabel IDs** |
| UI shows API disconnected | Backend not running, wrong base URL, or CORS origin mismatch | Check `/api/v1/health`, `frontend/.env`, and backend `cors_origins` |
| `0 detections` | Threshold, unfamiliar image domain, poor input quality, or model behavior | Test a **raw** in-domain control; compare same file/confidence/IoU/imgsz in API and direct prediction |
| GPU available but API slow | Cold model load, CPU fallback, resizing, image transfer, or backend settings | Profile first request vs warm calls; verify actual CUDA dispatch, not just device availability |
| `torch...+cpu` | CPU wheel installed | Follow the official PyTorch CUDA build selector compatible with your driver |
| `npm run dev` exits immediately | Node/Vite issue or missing dependencies | Run `node -v`, `npm ci`, `npm run build`; capture actual error/output |
| Powershell string `"...Activate.ps1"` only prints path | String expression did not execute script | Use `& ".\.venv\Scripts\Activate.ps1"` or call `.venv\Scripts\python.exe` directly |
| Browser preview displays **two sets of boxes** | Uploaded source example already includes an overlay | Use untouched raw image; do not confuse historic annotation with new model output |
| ONNX model exists but fails | Export and runtime/ops compatibility are separate | Validate runtime provider, input/output names, preprocessing and numerical parity |
| `git add` skips `.pt`/`.onnx` | Deliberate `.gitignore` exclusions | Use documented external artifacts / Git LFS when licensing and repository policy permit |
| Test reports show different values from UI | Dataset evaluation vs individual inference | Never compare metrics and one-off confidence as if they are the same measure |

## FAQ

**Is LabelAlignment QA already measuring label alignment?**  
No. Its current output is three-class detection and bounding boxes. Alignment angle/offset measurement requires geometric landmarks, references and calibration.

**Why is the project named LabelAlignment QA?**  
It is the problem domain and development direction, not a claim that calibrated alignment inspection is complete.

**Can an image produce zero detections?**  
Yes. Zero objects above threshold does not mean the bottle has no label or passes inspection.

**Can I change class names to Indonesian in the UI?**  
Display translations are possible if the underlying exact ID-to-class mapping is preserved in the model/API/metrics and documented.

**Why not merge all four Kaggle sources immediately?**  
Their labels and tasks differ. A merged training task requires independent annotation and ontology verification; simple concatenation would distort meaning.

**Is the original test set representative of real factory images?**  
Not established. It is a small held-out partition of one dataset; no multi-site test is recorded.

**Do I need to retrain to run the web app?**  
No. Use the existing verified `.pt` checkpoint. Retrain only for a distinct research question, changed data/split, or justified model issue.

**Do the sample pictures prove precision or mAP?**  
No. Formal metrics come from the held-out evaluation files, not screenshots or confidence on one photo.

**Does an RTX 3050 Ti guarantee the backend uses CUDA?**  
No. CUDA availability was tested locally; API device selection and actual GPU utilization still require explicit verification.

**Can I redistribute the dataset and weights under MIT?**  
Not automatically. The repository MIT license does not override upstream dataset/image or derived artifact rights.

**Can I deploy this now?**  
It can run locally for research and demonstrations; public production deployment requires hardening, security review and stronger validation.

## Roadmap

| Priority | Work item | Evidence required to mark complete |
| --- | --- | --- |
| P0 | Finish human review of 26 dHash candidates | Reviewed table with dispositions and verified split impact |
| P0 | Lock research baseline and reproducibility manifests | Notebook + environment + split fingerprints + artifact SHA |
| P0 | Raw-image frontend/API regression tests | Tested inputs, expected outputs, API logs and CI results |
| P0 | Verify backend GPU selection and cold/warm timing | Explicit runtime device, wall time and model-only time |
| P1 | External-source annotated evaluation | New labeled and source-separated test set with per-class metrics |
| P1 | Experiment 02: robust condition diagnosis | New versioned protocol; validation-selected champion; untouched final test |
| P1 | ONNX runtime and numerical parity verification | Report with compared outputs, tolerance and execution provider |
| P1 | Public artifact distribution if licensing allows | Verified, versioned release + checksum + usage instructions |
| P2 | Geometry/reference annotations for actual alignment | Corner/axis/center labels; annotated measurement dataset |
| P2 | Calibrated QA tolerances and decision policy | Manufacturing specification, repeatability, false-reject/accept results |
| P2 | Deployment and security hardening | Auth/rate-limit/monitoring/CI/load tests on target hardware |

The roadmap represents **planned work**, not already shipped functionality.

## License, attribution and references

### Code

See [`LICENSE`](LICENSE): **MIT License**, copyright 2026 Wafa Bila Syaefurokhman. The software is provided *as is*, without warranties.

### Third-party assets and models

Datasets, images, annotation exports, third-party libraries and weights may have separate licenses or usage restrictions. Licensing is not verified in the provenance report. Recheck publishers' original terms before redistribution or public model release.

### Primary references

- [Primary dataset — loliwibu/bottle-label-detection-v2](https://www.kaggle.com/datasets/loliwibu/bottle-label-detection-v2)
- [Big Cola candidate dataset](https://www.kaggle.com/datasets/youssefeldemerdashh/big-cola-bottles-dataset-for-yolo-quality-control)
- [Other bottle label candidate dataset](https://www.kaggle.com/datasets/yashvisave/dataset-for-bottle-label-detection)
- [Water bottle defect candidate dataset](https://www.kaggle.com/datasets/jihadakbr/water-bottle-defect-level-detection-dataset)
- [Ultralytics YOLO documentation](https://docs.ultralytics.com/)
- [FastAPI documentation](https://fastapi.tiangolo.com/)
- [React documentation](https://react.dev/)
- [Vite documentation](https://vite.dev/)
- [PyTorch local installation guide](https://pytorch.org/get-started/locally/)
- [Research notebook](notebooks/labelalignment-qa.ipynb)
- [Saved primary experiment summary](reports/final_summary.json)
- [Dataset provenance ledger](reports/dataset_provenance.csv)

---

**100 Days of Projects · Day 24.**  
**Real Problem → Audited Data → Reproducible Experiment → Honest Evaluation → Working Application → Complete Documentation.**

> *Research measurements must not be presented as certified manufacturing decisions.*
