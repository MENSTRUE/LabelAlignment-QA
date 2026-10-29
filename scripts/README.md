# Scripts and Reproduction Utilities

[Project overview](../README.md) · [Notebook](../notebooks/README.md)

The scripts directory is currently reserved for repeatable, reviewed maintenance or artifact verification utilities. The audited repository contained a `.gitkeep` rather than implemented commands. **Do not advertise non-existent CLI tools.** The primary executable experiment remains `notebooks/labelalignment-qa.ipynb`, and the application is started from `backend/` and `frontend/`.

## Appropriate future scripts

- Verify required research evidence files exist and are internally consistent without changing them.
- Produce a SHA256 manifest for checkpoint and archived research outputs.
- Validate that example imagery is designated `raw`, `ground_truth`, `preannotated`, or `api_preview` before assessment.
- Run reproducible smoke tests against a local FastAPI server with explicitly recorded parameters.
- Generate documentation indices by reading actual Git-tracked files.

## Rules

Scripts must not download unlicensed datasets automatically, silently rewrite notebook outputs, train new models without explicit consent, forge metrics/screenshots, or modify files outside the fixed root structure. Each new script should have an accompanying help section, input/output contract, safety note and verification command. Prefer PowerShell examples for Windows workflows.

## Existing commands (not scripts inside this folder)

Backend tests:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest -q
```

Frontend build:

```powershell
cd frontend
npm run build
```

Run these only after installing the relevant dependencies and obtaining the real checkpoint where needed. Record the executed outputs before claiming PASS.
