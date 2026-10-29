# Backend Agent Rules
- Follow root AGENTS.md and fixed repository structure.
- Real inference only from `models/labelalignment_primary_best.pt`; never fabricate boxes, scores or fallback labels.
- Preserve source class indices 0=class_imperfect label, 1=class_no label, 2=class_perfect label.
- Reject incompatible checkpoint ontology; do not silently remap.
- Validate uploads, max size and image pixel count; never store images unless explicitly approved.
- Run `python -m pytest -q` and a manual checkpoint-backed smoke test before claiming inference works.
- Never describe class names as calibrated angle/offset or factory pass/fail.
