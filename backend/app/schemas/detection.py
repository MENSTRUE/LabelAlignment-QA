from pydantic import BaseModel, Field

class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float = Field(ge=0, le=1)
    xyxy: list[float] = Field(min_length=4, max_length=4)

class DetectionResponse(BaseModel):
    model_name: str
    model_available: bool
    image_width: int
    image_height: int
    detections: list[Detection]
    inference_ms: float
    preview_jpeg_base64: str
    disclaimer: str = 'Research-only source-class detections. No certified angle, offset, or pass/fail.'

class ModelStatus(BaseModel):
    loaded: bool
    checkpoint_found: bool
    checkpoint_path: str
    classes: dict[int, str] | None = None
    reason: str | None = None
