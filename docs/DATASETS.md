# Datasets, Provenance and Audit

[Overview](../README.md) · [Reports](../reports/README.md) · [Methodology](METHODOLOGY.md)

## Dataset source register — observed on 2026-10-29

The following sources were mounted and **inventoried** in Kaggle. Only `label_v2` was used for the primary model training reported in this repository. An inventory is not permission to merge ontologies or redistribute images.

| Source ID | Official dataset page | Role | Inventory images |
|---|---|---|---:|
| `label_v2` | [Bottle Label Detection v2](https://www.kaggle.com/datasets/loliwibu/bottle-label-detection-v2) | Primary training/evaluation | 210 |
| `big_cola` | [Big Cola Bottles](https://www.kaggle.com/datasets/youssefeldemerdashh/big-cola-bottles-dataset-for-yolo-quality-control) | Inventory only | 377 |
| `label_other` | [Bottle Label Detection](https://www.kaggle.com/datasets/yashvisave/dataset-for-bottle-label-detection) | Inventory only | 396 |
| `water_defects` | [Water Bottle Defect Detection](https://www.kaggle.com/datasets/jihadakbr/water-bottle-defect-level-detection-dataset) | Inventory only | 1,500 |

Original URLs and Kaggle mount paths are in [`../reports/dataset_provenance.csv`](../reports/dataset_provenance.csv). The dataset publisher/license fields in that report were **unverified**; do not present the root MIT code license as data redistribution permission. Check the original dataset cards before commercial use or publishing derived images/weights.

## Primary dataset label ontology

| Index | Recorded source class | Intended semantic unit |
|---:|---|---|
| 0 | `class_imperfect label` | Source-annotated imperfect label condition; bounding-box detection |
| 1 | `class_no label` | Source-annotated missing label condition; bounding-box detection |
| 2 | `class_perfect label` | Source-annotated perfect label condition; bounding-box detection |

These class names are source-defined categories. They do **not** encode measured angle in degrees, offset in millimeters, skew with respect to a calibrated bottle axis, or a certified QA outcome.

## Inventory and annotation quality

`primary_audit.json` reports source inventory of 171 train images and 39 validation images, 0 recorded annotation errors, and box counts of 62 imperfect, 122 perfect and 26 no label. The training pipeline then created a group-based holdout from the original training portion: **136 train, 39 validation, 35 held-out test**. Thus `171 + 39 = 210` is the initial source inventory, while `136 + 39 + 35 = 210` is the research evaluation split. Do not confuse annotations with image totals.

![Dataset split distribution](../assets/plots/split_counts.png)

![Recorded ground truth examples](../assets/plots/ground_truth_examples.png)

## Split and leakage policy

- Research policy: `group_holdout_from_original_train`, seed `42`.
- Split assignments and fingerprint evidence are in `research_split_manifest.csv`, `dataset_split_fingerprint.json` and `split_policy.json`.
- Exact SHA-256 and recorded filename-family cross-split collision inventories are empty (`cross_split_collisions.json`).
- Visual dHash 8×8 with threshold `5` identified **26 cross-split candidates**, pending manual review (`visual_leakage_audit.json`, `near_duplicate_candidates.csv`). Exact-hash cleanliness is therefore not proof of no leakage.
- Repeated samples, stylistic commonality, camera/viewpoint correlation and source collection effects may affect generalization. No external plant-level validation is reported.

![Near duplicate review candidates](../assets/plots/near_duplicate_review.png)

## Excluded/secondary sources

`water_defects` has classes for bottle brand, fill, cap, debris, and label damage; they are not semantically equivalent to the primary source's three label-condition classes. `big_cola` and `label_other` were not merged because independent annotation verification is needed. Never remap or concatenate these datasets merely to increase sample counts.

## Reproduction / attribution policy

Download data from publishers via authorized access, record exact dataset version where available, preserve original labels and manifests, and review third-party usage rights before distributing either copied images or trained models. Keep raw data out of this Git repository. New experiments must retain independent split manifests and review possible leakage before reporting final metrics.
