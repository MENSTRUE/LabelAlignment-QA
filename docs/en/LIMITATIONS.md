# Limitations, Claim Boundaries and Release Readiness

[English index](README.md) · [Bahasa Indonesia](../id/LIMITATIONS.md) · [Metrics evidence](../../reports/primary_heldout_metrics.json)

## Evidence-supported statements

- The saved reports contain 35-image held-out detection metrics for a YOLOv8n primary-source baseline.
- A locally demonstrated React/FastAPI integration returned a detection on a previously annotated example; this supports one integration smoke test, not independent predictive accuracy.
- PyTorch CUDA detected an RTX 3050 Ti in the terminal and a direct `.pt` inference on a local example produced one `class_perfect label` prediction with confidence approximately 0.8677.
- The research report lists ONNX export `status: ok`; parity of ONNX and `.pt` outputs remains untested.

## Unsupported, unverified or not implemented

| Claim | Current status | Evidence needed |
|---|---|---|
| Calibrated label angle | **Not implemented** | Four label corners, geometry and ground-truth angle validation |
| Physical label displacement | **Not implemented** | Bottle reference frame, scale/perspective calibration |
| Factory PASS/FAIL | **Not implemented** | Plant tolerances, ground-truth QA labels, false accept/reject evaluation |
| Generalization across all brands | **Unverified** | External multi-domain held-out benchmarking |
| No duplicate leakage | **Unverified** | Manual adjudication of 26 cross-split visual candidates |
| GPU use on each API request | **Unverified** | Request-level device logging and latency experiments |
| ONNX–PyTorch equivalence | **Unverified** | Paired-input parity validation with NMS contract |
| Production security | **Unaudited** | Authentication, rate limits, HTTPS, logs and security testing |

## Data and statistical limitations

Only 210 primary images were inventoried and 35 allocated to the final test. Source annotation imbalance and visually similar images may bias generalization. dHash candidate pairs are not confirmed duplicates. A reported **mAP50 of 0.9870** must never be rewritten as “98.7% factory accuracy” or “98.7% of labels pass.”

## Application limits and model availability

The checkpoint expected at `models/labelalignment_primary_best.pt` was not present in the audited GitHub tree, although the user tested a local copy. The frontend is an interactive research workbench, not a durable production audit ledger. Before public deployment, review image privacy, server capacity, size and pixel limits, attack surface and artifact licensing.

## Language for public claims

**Allowed:** “Local research prototype for YOLOv8n detection of three dataset-defined bottle-label classes with archived held-out metrics and tested local UI/API inference on a sample.” **Not allowed without evidence:** “precise angle measurement,” “factory-certified,” “99% production accuracy,” “no dataset leakage,” or “all API requests run on GPU.”

![Research detections, not industrial compliance evidence](../../assets/plots/heldout_predictions.png)

**Readiness:** demonstrable portfolio prototype; **not** calibrated industrial QA. Priority: raw-image validation, human duplicate review, API device audit, benchmark and external domain testing.
