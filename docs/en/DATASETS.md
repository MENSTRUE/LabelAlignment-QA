# Datasets, Provenance and Audit — LabelAlignment QA

[English index](README.md) · [Bahasa Indonesia](../id/DATASETS.md) · [Evidence reports](../../reports/README.md)

## Inventoried sources (29 October 2026)

| ID | Original publisher page | Images inventoried | Research role |
|---|---|---:|---|
| `label_v2` | [Bottle Label Detection v2](https://www.kaggle.com/datasets/loliwibu/bottle-label-detection-v2) | 210 | **Only primary train/evaluation source** |
| `big_cola` | [Big Cola Bottles](https://www.kaggle.com/datasets/youssefeldemerdashh/big-cola-bottles-dataset-for-yolo-quality-control) | 377 | Inventory only |
| `label_other` | [Bottle Label Detection](https://www.kaggle.com/datasets/yashvisave/dataset-for-bottle-label-detection) | 396 | Inventory only |
| `water_defects` | [Water Bottle Defects](https://www.kaggle.com/datasets/jihadakbr/water-bottle-defect-level-detection-dataset) | 1,500 | Inventory only; incompatible label ontology |

See `reports/dataset_provenance.csv` and `reports/source_comparison.json`. Published versions, licenses and redistribution rights remain **unverified** for these source mounts. Inventory counts must not be summed and presented as the training dataset size.

## Primary model label order

| ID | Exact class string | Meaning and constraint |
|---:|---|---|
| 0 | `class_imperfect label` | Imperfect according to source annotation; no calibrated offset value |
| 1 | `class_no label` | Absent label according to source annotations |
| 2 | `class_perfect label` | Perfect according to source annotations, not factory-tolerance certification |

The spelling, spaces and numeric IDs are part of the checkpoint/API contract. `reports/primary_audit.json` records **62 / 26 / 122 bounding boxes** for imperfect/no-label/perfect in the source audit; these are box counts, **not held-out image class counts**.

## Split, leakage checks and what they mean

`reports/split_policy.json` records a `group_holdout_from_original_train` policy, seed 42, with **136 train / 39 validation / 35 test images**. Grouping reduces specified relationships but does not prove independent cameras or capture sessions. `reports/cross_split_collisions.json` found no SHA256 or filename-family collisions under its limited checks.

`reports/visual_leakage_audit.json` identifies **26 candidate visually similar cross-split pairs** using dHash 8×8, threshold 5. These require human adjudication; candidate matches are neither confirmed leakage nor proof of a clean dataset.

![Train, validation, test distribution](../../assets/plots/split_counts.png)

![Candidate near-duplicate pairs](../../assets/plots/near_duplicate_review.png)

![Source annotation examples](../../assets/plots/ground_truth_examples.png)

## Required follow-up audit

1. Preserve filenames, source IDs, split identities, and SHA256/dHash manifests.
2. Manually review all 26 candidate pairs and record adjudications.
3. Check coordinate bounds, class IDs, corrupted images, empty annotations and multi-box images.
4. Audit ontology and licensing **before** including any secondary dataset; then evaluate domains separately.
5. Freeze the held-out test, do not retune it based on unfavorable outcomes, and record dataset fingerprints.

## Evidence inventory

- `reports/primary_audit.json`, `reports/source_inventory.json`, `reports/dataset_provenance.csv`
- `reports/split_policy.json`, `reports/research_split_manifest.csv`, `reports/split_per_class_counts.csv`
- `reports/near_duplicate_candidates.csv`, `reports/visual_leakage_audit.json`, `reports/cross_split_collisions.json`
- `reports/dataset_split_fingerprint.json`, `notebooks/labelalignment-qa.ipynb`

An annotation inventory does not certify every source label. Already annotated/rendered example images must not be treated as clean unseen inputs.
