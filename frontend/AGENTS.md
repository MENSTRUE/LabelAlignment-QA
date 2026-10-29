# Frontend Agent Rules
- Respect root directory structure. No new root `app/` or `src/`.
- All detections must originate from real `POST /api/v1/detect` response. No fabricated charts, scores, or examples.
- Keep loading, validation, offline, missing model, empty and error states honest.
- Never equate a source class prediction with certified manufacturing acceptance.
- Run `npm run build` before claiming a passing build; test manually with a real backend and checkpoint.
- Avoid sending images to any service except user-configured local backend.
