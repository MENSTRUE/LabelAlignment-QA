# AGENTS.md — LabelAlignment QA

**Scope:** all human contributors and coding agents modifying `MENSTRUE/LabelAlignment-QA`.  
**Project:** Day 24 / 100 Days of Projects.  
**Primary principle:** preserve research provenance, architecture consistency, reproducibility and honest claims over superficial completion.

This file is an **operational contract**. Read it before editing any repository file. A successful code edit is not permission to alter the research narrative or to claim tests that were not run.

## 1. Source-of-truth hierarchy

| Subject | Authoritative location | Agent rule |
| --- | --- | --- |
| Research pipeline and executed notebook | `notebooks/labelalignment-qa.ipynb` | Preserve baseline and its saved outputs; append versioned experiments for revisions. |
| Dataset inventory and URLs | `reports/dataset_provenance.csv`, `reports/source_inventory.json` | No invented sources, versions, rights or training data. |
| Class labels and IDs | Source annotation manifest, checkpoint `model.names`, `backend/app/inference/detector.py` | IDs `0,1,2` and exact names are immutable unless a distinct trained model requires a versioned contract. |
| Data audit | `reports/primary_audit.json` and split/near-duplicate manifests | Never imply candidate leakage audit is completed. |
| Metrics | `reports/primary_heldout_metrics.json`, `reports/final_summary.json` | No metrics from screenshots, confidence scores or assumptions. |
| ONNX state | `reports/onnx_export.json` + runtime parity tests if created | Export status is not parity or production readiness. |
| API behavior | `backend/app/` and generated `/docs` | Never document endpoints that do not exist. |
| Frontend behavior | `frontend/src/`, `frontend/package.json` | Never substitute mocked API success or fabricated detections. |
| Assets | `assets/plots/`, `assets/examples/`, `assets/screenshots/` | Only show files that exist and describe whether they are research plots, annotated samples or UI screenshots. |
| Structure / conventions | Root `README.md`, this file, component `AGENTS.md` | Respect fixed repository structure; scoped instructions refine but do not override integrity constraints. |
| Code licensing | `LICENSE` | Never extend MIT grant to third-party assets without verification. |

When code and documentation disagree, **investigate**. Do not automatically edit a JSON research result to match new prose or overwrite a historical experiment to match current runtime behavior. Document version/date/provenance and open a scoped correction.

## 2. Non-negotiable scientific rules

1. **Never fabricate** data, annotations, figures, evaluation results, model training, validation screenshots, test outcomes or release links.
2. Separate **implemented**, **tested**, **observed**, **planned**, **assumed** and **unsupported** states.
3. Never interpret a YOLO AABB as measured label rotation, offset, label-corner coordinates, calibration or factory PASS/FAIL.
4. Preserve **three exact class IDs and names**: `0: class_imperfect label`, `1: class_no label`, `2: class_perfect label`.
5. Preserve distinction between **precision, recall, mAP, AP, image counts, object counts, class confidence and manufacturing accuracy**.
6. The original held-out baseline is **35 images**, and its metrics must remain attributed to that exact primary-source experiment.
7. Do not describe 26 dHash **candidates** as confirmed copies or claim the leakage audit is closed.
8. Exact-hash collision checks and visual similarity checks are different tests; neither alone guarantees data independence.
9. Do not merge `big_cola`, `label_other` or `water_defects` into training without a separate ontology, license and annotation audit.
10. **Do not retrain** when the existing checkpoint suffices for the requested scope; changing the experiment requires an explicit research objective and versioned record.
11. No external generalization, manufacturing certification, physical measurement accuracy, GPU API utilization or ONNX runtime-parity claims without measurements.
12. Keep third-party licensing independent of the repository MIT license.

## 3. Fixed repository structure

The permitted root structure is:

```text
README.md
AGENTS.md
LICENSE
.gitignore
.env.example
notebooks/
models/
reports/
assets/
  plots/
  examples/
  screenshots/
  diagrams/
backend/
  README.md
  AGENTS.md
  requirements.txt
  app/
    main.py
    api/routes/
    core/
    inference/
    schemas/
    services/
  tests/
frontend/
  README.md
  AGENTS.md
  package.json
  public/
  src/
    components/
    pages/
    hooks/
    services/
    types/
    styles/
docs/
  README.md
  id/
  en/
scripts/
  README.md
```

**Actual checked-in state matters:** legacy root `app/` placeholders, empty root `requirements.txt` and `pyproject.toml`, and empty `docs/DATASETS.md`, `docs/METHODOLOGY.md`, `docs/LIMITATIONS.md` exist in the reviewed repository. **Do not present them as implemented code or silently delete them.** Plan cleanup separately with a dependency audit and user approval. Do not create a root `datasets/`, `src/`, `tests/` or `examples/`; use existing component areas. Only add root entries for demonstrated technical necessity, with change explanation.

Do not generate empty `.py`, `.tsx`, `.ipynb`, `.md`, or configuration files merely to fill the tree. Use `.gitkeep` only for directories requiring tracking. Do not overwrite substantive user edits without inspecting the existing file and diff.

## 4. Baseline research contract

The current primary model uses Kaggle source `loliwibu/bottle-label-detection-v2`; 210 source images; 136 train, 39 validation, 35 held-out test; seed 42; `group_holdout_from_original_train` policy. The source audit counts 62 imperfect, 26 no-label and 122 perfect-label boxes. Separate source inventories do not participate in the original training.

Recorded held-out metrics:

| Quantity | Original experiment |
| --- | ---: |
| Precision | 0.782705221914517 |
| Recall | 0.9257981606821096 |
| mAP50 | 0.987 |
| mAP50–95 | 0.7395106393606394 |
| Imperfect AP50–95 | 0.7930104895104896 |
| No-label AP50–95 | 0.7464500000000001 |
| Perfect AP50–95 | 0.6790714285714285 |

These are **not** general-purpose performance targets to overwrite or adjust. New runs must output new reports and indicate which split, hardware, library versions and model produced them.

Original training report identifies Ultralytics 8.4.192 and a training duration of 90.18 seconds. These numbers are historical notebook outputs and should not be repurposed as current application performance.

## 5. Notebook revision policy — preserve, improve, document

- **Never replace an already successful notebook wholesale** just because a section needs revision.
- Preserve original numbered stages and relevant result outputs for historical research context.
- Add a professional section such as `Experiment 02 — Evaluation Refinement` **below** the original baseline, with objective, changes, validation protocol, metrics, artifact paths, limitations and a comparison table.
- Do not title sections with informal or rhetorical “why why” phrasing.
- Use separate output names or versioned subpaths for additional experiments so previous model files, manifests and metrics survive.
- Make champion selection **only on validation**. Lock held-out test before choosing hyperparameters. Do not iterate against test performance.
- Separate primary test, alternate test and out-of-domain trial. Comparison across different splits must explain the non-equivalence.
- Export only actual generated plots, reports, models and manifests. Validate ZIP contents/CRC and report any failed export instead of claiming success.
- A notebook syntax check is not a Kaggle execution. Include explicit execution status.

## 6. Model and inference integrity

Expected model path: `<repo>/models/labelalignment_primary_best.pt`.

- The `.pt` file is not committed in the remote tree reviewed for this documentation. Never silently download arbitrary weights as a substitute.
- Load the exact checkpoint from the original Kaggle artifact, verify the `model.names` dictionary and fail closed on mismatch.
- Respect the exact input transformation and relevant original training/inference configuration. Backend currently requests `imgsz=640`, `max_det=25` and configurable confidence/IoU.
- Preserve detection coordinates, confidence and class IDs without translating them into geometry not present in the model.
- Keep upload decoding, resource limits, inference and response serialization in separate backend modules as established.
- A direct `device=0` test on CUDA hardware is distinct from proof that FastAPI's current predictor executes on GPU. If implementing GPU selection, measure warm and cold inference and confirm actual device use.
- ONNX `status: ok` in the export report proves only that the export stage recorded success; validate actual runtime and output parity before using it.
- Keep a documented model checksum/version when distributing weights. Do not commit giant weights using normal Git unless explicitly approved and licensed.

## 7. Backend implementation contract

**Location:** `backend/app/`.

- Use FastAPI/Pydantic request and response contracts in `api/routes/` and `schemas/`.
- Respect the existing endpoints: `GET /api/v1/health`, `GET /api/v1/model`, `POST /api/v1/detect`.
- Validate file bytes and image decoding server-side, not just MIME/extension/client length.
- Enforce configurable upload limit; default is 10 MB. Handle corrupted image, missing model, class mismatch and out-of-range confidence/IoU with appropriate HTTP statuses.
- Do not return `class_no label` as a fallback when there are no detections. Zero boxes means zero above threshold.
- Do not expose arbitrary filesystem files, sensitive paths or model-loading stack traces in public deployments.
- Avoid retaining uploaded content unless specified, consented to and documented.
- Keep CORS narrowly scoped. Default development origins are localhost/127.0.0.1:5173.
- Ultralytics predictor state can be mutable; preserve safe concurrency handling or justify and test a change.
- Add tests for any new route, validation rule or detector behavior. Report exact commands and observed results.
- Do not add heavy background queues, cloud services or persistent databases without a demonstrated requirement and corresponding security review.

## 8. Frontend implementation contract

**Location:** `frontend/`.

- Maintain React + TypeScript + Vite architecture and existing functional inspection experience.
- Keep network requests in `src/services/` and API types in `src/types/`; UI pages should not independently invent response contracts.
- Show loading, empty, failure and success states distinctly; explain zero detections without claiming “no label”.
- Draw bounding boxes using server-returned coordinates or server-generated preview; preserve image aspect ratio and coordinate scaling.
- Label confidence as **model confidence**, not correctness probability or quality certification.
- Preserve class ontology, render all three class counts correctly and avoid using placeholder data in runtime output.
- Use accessible controls, visible upload restrictions and responsive layout. Export only real returned JSON.
- If the backend is unavailable, show a real connection error instead of faking `API CONNECTED`.
- Never put secrets or private internal URLs into browser-exposed Vite variables.
- Confirm `npm run build` and manually test representative interaction paths after modifications.

## 9. Documentation and assets

- Root `README.md`: comprehensive overview, Before–Now–Next, dataset provenance, audit, metrics, methods, limitations, exact structure, setup, testing, deployment, privacy, troubleshooting, FAQ, roadmap and license.
- Component README documents must be **substantive** and truthful; maintain `backend/README.md`, `frontend/README.md`, `models/README.md`, `notebooks/README.md`, `reports/README.md`, `assets/README.md`, `docs/README.md`, `scripts/README.md` when component behavior changes.
- Use **relative GitHub paths** for committed images, including:
  - `assets/plots/ground_truth_examples.png`
  - `assets/plots/split_counts.png`
  - `assets/plots/heldout_predictions.png`
  - `assets/plots/near_duplicate_review.png`
  - `assets/examples/gpu_test_result.jpg`
  - `assets/screenshots/Screenshot 2026-10-29 212808.png` (URL-encode spaces in links)
- Never fabricate graphs, missing screenshots, model weights, prediction images or external image rights.
- Caption annotated examples honestly: many `assets/examples/test_*.jpg` files already have overlays. These are **not raw independent test data**.
- Prefer versioned factual claims with links to evidence JSON/CSV. Avoid generic badges suggesting production certification.
- Do not invent new metrics just to fill a README table.
- If a requested file exists but is empty, say so and implement it only in the requested documentation scope.

## 10. Tests and quality gates

### Minimal commands (PowerShell)

```powershell
# From backend/
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe -m pytest -q

# From frontend/
npm ci
npm run build

# From repository root
git status --short
git diff --check
```

### Requirement-specific gates

| Change | Required verification |
| --- | --- |
| Documentation or asset path | File exists; Markdown link resolves; numbers agree with archived reports; no unsupported claims |
| Detection schemas | OpenAPI and request/response compatibility check + backend test |
| Inference and model loading | Checkpoint mapping, representative raw image, 0/1/multiple boxes, invalid input, CPU/GPU behavior |
| UI | Build, connection/failed request, file handling, responsive screen and screenshot evidence |
| Notebook research | Environment/input, split identity, validation selection, held-out metrics, export and artifact integrity |
| Deployment | Security, CORS, auth/rate limits, upload resource bounds, observability and load testing |

Never report a check as **PASS** unless executed. Use `NOT RUN`, `PASS`, `FAIL`, and `BLOCKED` with exact commands, date/context and relevant environment. Existing screenshots count as observed manual evidence only, not automated suite results.

## 11. Security and privacy policy

- Assume all clients, URLs, filenames and images are untrusted. Test malformed payloads.
- Do not reveal internal exceptions, system paths, secrets or user information in public API responses.
- Do not commit `.env`, local uploaded content, raw downloaded dataset, huge trained checkpoints or run caches by default.
- A Python `.pt` file can involve deserialization and must come from a trusted source; do not auto-load unverified third-party artifacts.
- Protect the application against high-volume requests, decompression bombs and memory exhaustion before public deployment.
- Keep CORS restrictive and use HTTPS for public endpoints.
- No cloud or persistence claims without evidence and data-retention documentation.
- Respect third-party image, dataset and weight licensing; assume no redistribution right until verified.

## 12. Workflow for future changes

**Phase 0 — Audit:** inspect real tree, `git status`, existing code, previous run reports and source manifests. Avoid destructive directory moves; do not alter root architecture unilaterally.

**Phase 1 — Verify:** check source annotations, class IDs, checkpoint, split, metrics and environment. Define the precise change and expected acceptance criteria.

**Phase 2 — Implement:** use the existing module boundary. Integrate real inference; no dummy claims. Reuse verified checkpoint unless a new research experiment is justified.

**Phase 3 — Test:** run meaningful automated and manual checks. Keep test input and actual observations separate from expectations.

**Phase 4 — Document:** update affected README/AGENTS, cite exact assets and reports, distinguish open risks and pending work, preserve source-of-truth consistency.

**Phase 5 — Deliver:** provide complete changed files (or patch), setup commands, real test outputs, untested scope, and professional Git commit message.

## 13. Git and contribution policy

- Do not push straight to `main` from an automation unless the user explicitly requests a remote write. Prefer local changes or reviewable branches for broad edits.
- Never force-push as part of a “simple cleanup” or silently remove historical assets.
- Inspect `git diff --stat`, `git diff --check`, tracked large files and `.gitignore` before committing.
- Do not use `git add .` without reviewing whether new datasets, exports, annotated images or credentials will be committed.
- Use scoped messages, for example:
  - `docs: publish evidence-backed README and agent operating contract`
  - `test: cover image validation and zero-detection responses`
  - `feat: verify explicit CUDA inference configuration`
  - `research: append experiment 02 with validation-selected baseline`
- If upstream repo changed, fetch/merge/rebase appropriately; never overwrite concurrent edits without inspecting them.

## 14. Current research limits and priorities

**Known facts:** trained source-specific YOLOv8n checkpoint, archived 35-image held-out metrics, 26 unadjudicated dHash candidates, an export record for ONNX, a working local FastAPI/React smoke test, and a direct CUDA test on RTX 3050 Ti.

**Not demonstrated:** true angle or displacement measurement, manufacturing-pass criteria, formal independent dataset performance, all API requests using GPU, ONNX parity, public production readiness, comprehensive CI passing, and unambiguous redistribution licensing.

Focus in order: preserve baseline → audit visual candidates → test raw in-domain and out-of-domain inputs → verify backend inference device/latency → strengthen test automation → perform separate additional experiments → validate geometry calibration if expanding scope → harden deployment.

## 15. Completion checklist for every agent response

- [ ] Existing repository structure and changed files inspected.
- [ ] Source-of-truth reports and class ontology respected.
- [ ] No fabricated metrics, visuals, test results or artifact URLs.
- [ ] Historical experiments preserved; revisions identified by experiment number.
- [ ] Source/license provenance and claim boundaries respected.
- [ ] Applicable tests run and outcomes reported (or clearly `NOT RUN`).
- [ ] Documentation/asset links checked.
- [ ] Current vs planned features accurately distinguished.
- [ ] No unnecessary root folders or empty implementation files.
- [ ] No destructive overwrite, secret disclosure or unsupported production claims.
- [ ] Commit message provided when delivering code/documentation.

---

**Operating motto:** **Real Problem → Audited Data → Reproducible Experiment → Honest Evaluation → Working Application → Complete Documentation.**

**This repository is a research prototype until independent production validation explicitly proves otherwise.**
