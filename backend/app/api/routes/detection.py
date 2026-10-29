from fastapi import APIRouter, File, UploadFile, HTTPException, Query, Request
from app.schemas.detection import DetectionResponse, ModelStatus
from app.services.images import load_image

router = APIRouter(prefix='/api/v1', tags=['Detection'])

@router.get('/model', response_model=ModelStatus)
def model_status(request: Request):
    return request.app.state.detector.status()

@router.post('/detect', response_model=DetectionResponse)
async def detect(request: Request, file: UploadFile = File(...),
                 confidence: float = Query(0.25, ge=0.05, le=0.95),
                 iou: float = Query(0.45, ge=0.1, le=0.9)):
    settings = request.app.state.settings
    # Reject oversized files before decoding; enforce byte limit even when client lies.
    limit = settings.max_upload_mb * 1024 * 1024
    content = await file.read(limit + 1)
    if len(content) > limit:
        raise HTTPException(413, f'Max upload is {settings.max_upload_mb} MB')
    image = load_image(content, settings.max_upload_mb)
    return request.app.state.detector.predict(image, confidence, iou)
