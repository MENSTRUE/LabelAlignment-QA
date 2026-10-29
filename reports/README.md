# Research Reports and Evidence Register

[Project overview](../README.md) · [Notebook](../notebooks/README.md) · [Research limits](../docs/LIMITATIONS.md)

The files in this directory are the **source of truth** for claims about the completed Day 24 experiment. Do not replace measured numbers with UI counters, an unverified external image, or a newly generated notebook output from different split/model settings.

## Evidence inventory

| File | Interpretation / use |
|---|---|
| `dataset_provenance.csv` | Original publisher URLs, mount paths and data-use roles; license verification pending |
| `source_inventory.json` | Sources found during discovery |
| `source_comparison.json` | Primary and secondary inventories; not merge approval |
| `primary_audit.json` | Primary source class box counts and source train/val audit |
| `split_policy.json` | Exact experiment split counts, seed, declared policy |
| `research_split_manifest.csv` | Split assignments used in experiment |
| `split_per_class_counts.csv` | Per-class distribution by split |
| `dataset_split_fingerprint.json` | Dataset/split fingerprint evidence |
| `primary_manifest_source.csv` | Source-image reference and annotation provenance |
| `cross_split_collisions.json` | Reported zero SHA256 and filename-family exact collisions |
| `visual_hash_manifest.csv` | Image hash audit material |
| `visual_leakage_audit.json` | dHash method and **26 unreviewed cross-split candidate pairs** |
| `near_duplicate_candidates.csv` | Candidate list requiring visual review |
| `environment.json` | Recorded research environment |
| `training_run.json` | Training status, software version, split hash, best checkpoint path |
| `primary_heldout_metrics.json` | Source-domain held-out detection scores |
| `heldout_error_cases.csv` | Casewise review material |
| `onnx_export.json` | Export status only, not validated ONNX parity |
| `geometry_contract.json` | Missing geometry inputs and withheld pass/fail |
| `research_gate.json` | Research readiness and unresolved limitations |
| `final_summary.json` | Concise report of task, source, metrics, and limitations |

## Actual measured baseline

| Measure | Value | Scope |
|---|---:|---|
| Source images | 210 | Primary source inventory |
| Train / validation / test | 136 / 39 / 35 | `group_holdout_from_original_train` |
| Held-out precision | 0.782705 | Detection |
| Held-out recall | 0.925798 | Detection |
| Held-out mAP@0.50 | 0.987000 | Detection |
| Held-out mAP@0.50:0.95 | 0.739511 | Detection |
| AP50:95 imperfect | 0.793010 | Class-specific detection |
| AP50:95 no label | 0.746450 | Class-specific detection |
| AP50:95 perfect | 0.679071 | Class-specific detection |

These scores were recorded for 35 held-out images, not an independent factory inspection benchmark. `primary_audit.json` counts 62 imperfect, 26 no-label, 122 perfect **boxes** in the primary source's initial train+val inventory. Do not confuse these counts with image totals.

## Leakage and scientific caution

`cross_split_collisions.json` contains empty hash/family collision objects, while `visual_leakage_audit.json` flags 26 near-duplicate candidates using 8×8 dHash threshold 5. **A clean exact-hash check is not proof of zero visual leakage.** Manual candidate review is pending; conclusions must disclose that status.

## Asset visualization

![Split counts](../assets/plots/split_counts.png)

![Held-out examples](../assets/plots/heldout_predictions.png)

![Near-duplicate review panel](../assets/plots/near_duplicate_review.png)

## When adding a revised experiment

1. Do not overwrite prior evidence; use a uniquely named experiment prefix or versioned subdirectory **inside `reports/`**.
2. Document changed hypothesis, seed, dataset fingerprint, split method, checkpoint lineage and validation-based model selection.
3. Record failed runs and excluded cases transparently; never silently discard them.
4. Compare only metrics from the same task, unit, split and evaluation protocol. Do not convert an application screenshot into a held-out metric.
5. Preserve provenance and report SHA256 checksums of important artifacts when available.
