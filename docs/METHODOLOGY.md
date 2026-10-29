# Research Methodology and Inference Contract

[Root](../README.md) · [Data audit](DATASETS.md) · [Reports](../reports/README.md)

## Research question

Can an object detector identify three **source-defined bottle-label condition classes** in images from the observed primary dataset, and can the trained checkpoint be integrated into a local browser inspection interface? This is not equivalent to measuring actual alignment offsets or rotations.

## Experiment 01 — existing baseline

**Dataset:** Kaggle `loliwibu/bottle-label-detection-v2`, 210 images. **Split:** grouped holdout 136 train, 39 validation, 35 test; seed 42. **Architecture:** YOLOv8n. **Label ontology:** exact three classes listed in `DATASETS.md`. **Recorded training:** Ultralytics 8.4.192; 90.18 seconds in research environment (`training_run.json`). **Model selection:** checkpoint stored as `labelalignment_primary_best.pt`, with test metrics recorded separately. Not all inner epoch-level configurations should be guessed from the summary; inspect the notebook and training record when reproducing.

### Ground truth and evaluation units

The annotation unit is object bounding box. The metrics are precision, recall, mAP@0.50 and mAP@0.50:0.95 for object detection, not image-level classification accuracy, pixel-level segmentation performance, or geometrically calibrated label alignment.

| Actual held-out metric | Value |
|---|---:|
| Precision | 0.782705 |
| Recall | 0.925798 |
| mAP50 | 0.987000 |
| mAP50–95 | 0.739511 |
| AP50–95: imperfect | 0.793010 |
| AP50–95: no label | 0.746450 |
| AP50–95: perfect | 0.679071 |

All values come from `reports/primary_heldout_metrics.json` on **35 test images**. These results should not be extrapolated to a factory production line or unseen camera conditions.

![Visualized held-out detections](../assets/plots/heldout_predictions.png)

## Audits that remain open

The exact hash and filename-family audit reported no collisions, but dHash found 26 candidate near-duplicates across splits. Human review is pending, so potential visual leakage cannot be excluded. See `reports/near_duplicate_candidates.csv` and the visual panel below.

![Visual similarity review](../assets/plots/near_duplicate_review.png)

## Model export and deployment boundary

The notebook records a successful ONNX export (`onnx_export.json`), and the backend runs the original `.pt` checkpoint. ONNX parity, throughput, class consistency under ONNX Runtime, and numerical equivalence have **not** been verified. Use the `.pt` path for the documented API.

## Local application pipeline

```text
User image upload → React Vite workbench → POST /api/v1/detect
  → FastAPI file/parameter validation → PIL decode
  → lazy-load source checkpoint + class ontology verification
  → Ultralytics YOLOv8n detection (640 input setting)
  → xyxy boxes + confidence + annotated JPEG preview
  → JSON response → React preview + class counts + export
```

There is no separate geometry estimation module, image-to-millimeter calibration, reference bottle-axis estimator, or manufacturing tolerance threshold in the verified app. The API's source-defined class counts are not a validated quality decision.

## Direct GPU vs API evidence

A local Windows GPU test using `device=0` detected one `class_perfect label` object in `assets/examples/test_01.jpg` at confidence 0.8677, with an Ultralytics inference substage of 5.4 ms. The sample was already annotated; it proves model operation only. A subsequent browser smoke test returned one class-perfect detection. In the audited backend code, `device=0` is **not explicitly passed**, so do not claim the API used the RTX 3050 Ti solely from the direct test.

## Future experiment amendment protocol

Append `Experiment 02`, `Experiment 03`, etc. to the bottom of the existing research notebook; preserve Experiment 01 and its evidence. Introduce a new split, human-reviewed leakage analysis, raw-image external test set, corner/axis annotation, or ONNX parity comparison only with a new objective and proper independent validation. Report new metrics in versioned reports; don't rewrite the old results to improve optics.
