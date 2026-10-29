# Documentation Index

[Root README](../README.md) · [Agent governance](../AGENTS.md)

This folder holds research and integration explanations that complement, but never contradict, the root README and saved artifact reports. Use `reports/` for actual numeric experiment evidence and `notebooks/` for the executable research record.

| Document | Purpose |
|---|---|
| [`DATASETS.md`](DATASETS.md) | Four inventoried sources, actual training source, labels, permissions, audit, split and leakage |
| [`METHODOLOGY.md`](METHODOLOGY.md) | Object detection design, training, evaluation, export and local inference architecture |
| [`LIMITATIONS.md`](LIMITATIONS.md) | What is verified, unknown, unsupported or only planned |
| [`INTEGRATION_GUIDE.md`](INTEGRATION_GUIDE.md) | Existing local backend/frontend setup guide |
| `id/` | Reserved for reviewed Indonesian expansions |
| `en/` | Reserved for reviewed English expansions |

## Editing protocol

All claims must link to saved reports or verified source code. Do not claim ONNX parity from export success; do not claim zero leakage while 26 candidates remain unreviewed. Keep separate **research notebook metrics**, **API smoke tests**, **direct PyTorch GPU tests**, and **external image results**. Put dated experiment revisions below the original experiment rather than overwriting it. Preserve asset links as relative repository URLs.
