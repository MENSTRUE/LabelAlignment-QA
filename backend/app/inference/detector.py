import base64
import threading
import time
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from fastapi import HTTPException
from app.schemas.detection import Detection, DetectionResponse, ModelStatus

EXPECTED = {0: 'class_imperfect label', 1: 'class_no label', 2: 'class_perfect label'}
COLORS = {0: '#e3a85d', 1: '#c45f65', 2: '#55aaa0'}

class Detector:
    def __init__(self, path: Path):
        self.path = Path(path)
        self._model = None
        self._error = None
        self._lock = threading.Lock()

    def status(self) -> ModelStatus:
        if self._model is not None:
            return ModelStatus(loaded=True, checkpoint_found=True,
                               checkpoint_path=str(self.path), classes=EXPECTED)
        return ModelStatus(loaded=False, checkpoint_found=self.path.is_file(),
                           checkpoint_path=str(self.path), reason=self._error or 'Not loaded')

    def load(self):
        if self._model is not None:
            return self._model
        with self._lock:
            if self._model is not None:
                return self._model
            if not self.path.is_file():
                self._error = 'Checkpoint missing: copy Kaggle best.pt to models/'
                raise HTTPException(503, self._error)
            try:
                from ultralytics import YOLO
                model = YOLO(str(self.path))
                names = {int(k): str(v) for k, v in model.names.items()} if isinstance(model.names, dict) else dict(enumerate(model.names))
                if names != EXPECTED:
                    self._error = f'Checkpoint class ontology mismatch: {names}'
                    raise HTTPException(503, self._error)
                self._model = model
            except HTTPException:
                raise
            except Exception as exc:
                self._error = f'Model load failure: {type(exc).__name__}: {exc}'
                raise HTTPException(503, self._error) from exc
            return self._model

    def predict(self, img: Image.Image, conf: float, iou: float) -> DetectionResponse:
        model = self.load()
        t0 = time.perf_counter()
        # Serialize predict: Ultralytics predictor state can be mutable between calls.
        with self._lock:
            result = model.predict(source=img, conf=conf, iou=iou, imgsz=640,
                                   verbose=False, max_det=25)[0]
        elapsed = round((time.perf_counter() - t0) * 1000, 2)
        detections = []
        drawing = img.copy()
        canvas = ImageDraw.Draw(drawing)
        w, h = img.size
        if result.boxes is not None:
            for b in result.boxes:
                class_id = int(b.cls.item())
                if class_id not in EXPECTED:
                    continue
                coords = [float(v) for v in b.xyxy[0].tolist()]
                coords = [max(0.0, min(float(w if i % 2 == 0 else h), v)) for i, v in enumerate(coords)]
                confidence = float(b.conf.item())
                detections.append(Detection(class_id=class_id, class_name=EXPECTED[class_id],
                                            confidence=confidence, xyxy=coords))
                color = COLORS[class_id]
                canvas.rectangle(coords, outline=color, width=max(2, w // 240))
                label = f'{EXPECTED[class_id]} {confidence:.0%}'
                left, top = int(coords[0]), int(coords[1])
                bbox = canvas.textbbox((left, top), label)
                tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
                ty = max(0, top - th - 8)
                canvas.rectangle([left, ty, min(w, left + tw + 12), ty + th + 6], fill=color)
                canvas.text((left + 5, ty + 2), label, fill='#101821')
        out = BytesIO()
        drawing.save(out, format='JPEG', quality=88)
        return DetectionResponse(model_name=self.path.name, model_available=True,
                                 image_width=w, image_height=h, detections=detections,
                                 inference_ms=elapsed,
                                 preview_jpeg_base64=base64.b64encode(out.getvalue()).decode('ascii'))
