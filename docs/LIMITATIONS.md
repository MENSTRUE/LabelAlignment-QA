# Research Limitations, Claim Boundaries and Readiness

[Overview](../README.md) · [Methodology](METHODOLOGY.md) · [Model](../models/README.md)

## Verified from research artifacts

- Primary source inventory and audit: 210 images with three classes; 136 train / 39 validation / 35 test research split.
- Source-domain YOLOv8n detector held-out results: precision 0.7827, recall 0.9258, mAP50 0.9870, mAP50–95 0.7395.
- Source class ontology is preserved by the API's model-loading guard.
- Research ONNX export reported `status: ok`, but not inference equivalence.
- A direct Windows/CUDA `.pt` model smoke test completed with one detection on an annotated example.
- A browser request returned one perfect-label detection with a displayed preview in a local test; the sample was previously annotated.

## Unresolved / unsupported

| Claim | Status / reason |
|---|---|
| Zero train/test visual leakage | **Not verified:** 26 dHash candidates need manual inspection |
| Robust accuracy on arbitrary internet bottle images | **Not verified:** an external Bigi water-bottle photo returned zero detections at 25% threshold |
| Label skew / angle (degrees) | **Unsupported:** no verified label-corner geometry or reference axis |
| Label lateral or vertical offset | **Unsupported:** no calibrated reference, dimensions or pose |
| Factory pass/fail | **Withheld:** no physical tolerances or metrology validation |
| Correctness of `class_perfect label` for a specific manufactured product | **Not certified:** source taxonomy only |
| Model fairness across brands / lighting / cameras | **Not validated:** small, source-specific image set |
| API always uses CUDA | **Not verified:** current predictor call does not explicitly pass GPU device |
| ONNX output parity or ONNX API inference | **Not verified:** export record is not a parity test |
| Production throughput, uptime, privacy and security | **Not validated:** development research environment only |
| Full automated CI/browser coverage | **Not evidenced:** code and some smoke tests exist |

## Geometry contract

The saved `reports/geometry_contract.json` requires label corners `(tl,tr,br,bl)`, bottle-axis endpoints, reference center and bottle dimensions for quantitative angle/offset. An axis-aligned YOLO detection box cannot estimate printed label rotation by itself. No millimeter conversion or acceptance threshold is defined.

## Test result interpretation

A positive API prediction verifies transport and model execution, not the correctness of the category. A zero-detection response is a valid model outcome; it may reflect distribution shift or thresholding. The external Bigi bottle case from the local browser session had zero detections and should be retained as a **qualitative generalization limitation**, not suppressed or counted as a formally labeled false negative.

A high mAP50 on 35 images from one primary source does not establish performance on dissimilar packaging. The exact collision audit being clear does not eliminate near duplicates. Existing example files containing rendered bounding boxes must not be reused as pristine external accuracy samples.

## Before wider deployment

Require independent raw images across lighting, brands and cameras; documented labeling protocol and inter-reviewer checks; resolved near-duplicate candidates; model calibration and uncertainty handling; explicit CPU/CUDA device tests; ONNX parity if ONNX is used; upload security and pixel-bomb protections; operational monitoring, licenses, and rollback. For physical alignment QA, separately collect geometry annotations and validate tolerances with actual measurements.

## Approved public description

> “LabelAlignment QA is a research prototype combining a YOLOv8n source-defined bottle-label condition detector with a local FastAPI/React inspection workbench. On a 35-image held-out dataset split, the recorded detection mAP50 was 0.987. The system does not currently measure physical label alignment or certify manufacturing pass/fail.”
