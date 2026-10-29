# Backend Agent Instructions

Read [`../AGENTS.md`](../AGENTS.md) first. This file narrows the mandatory rules for all changes under `backend/`.

## Non-negotiable contracts

- Preserve the repository's fixed root structure and the modular FastAPI layout (`app/api/routes`, `app/core`, `app/inference`, `app/schemas`, `app/services`, `tests`). Do not create a parallel `src/` or top-level `app/`.
- Maintain the three exact label names in their original indices: `0 class_imperfect label`, `1 class_no label`, `2 class_perfect label`. Any mismatch is a hard error, never an automatic remapping.
- Always use `models/labelalignment_primary_best.pt` unless an explicitly reviewed model version is introduced. No synthetic detections, fallback mock predictions, or silent substitution of `yolov8n.pt`.
- Preserve API request/response contracts unless explicitly versioning the route and frontend together. Keep safe validation of file bytes, supported content and query range.
- Keep the difference between *checkpoint exists*, *model successfully loads*, *prediction runs*, *CUDA is available*, and *API uses GPU* explicit.

## Change protocol

1. Read current route/schema/config/inference logic and associated tests.
2. Make smallest compatible change; no wholesale architecture rewrite or data/model retraining.
3. Add deterministic unit tests for schema, input limits, no-model error, class mismatch; add a real-model integration test only if artifact exists.
4. Run `python -m pytest -q` and record actual results. Report skipped tests and blockers.
5. If inference parameters/device change, document them and compare outputs on fixed raw images; do not reuse baked-in annotated examples as independent evaluation.
6. Update `backend/README.md`, root status, model instructions and changelog-like experiment notes if behavior changes.

## Security / integrity

Never trust upload filename or MIME alone. Bound bytes and decoded pixel count, avoid persistent storage of user images by default, do not log sensitive payloads, restrict CORS and request rates in public deployments. Never expose private weights or credentials in logs. Handle exceptions without suppressing evidence. Use reproducible dependencies; avoid modifying an already-working CUDA stack casually.

## Proof requirements

Do not claim “GPU inference”, “end-to-end passed”, “ONNX parity”, “production-ready”, or measured latency unless relevant test output demonstrates each statement. Use reports as research source of truth. Keep scientific claims within the small held-out detection benchmark.
