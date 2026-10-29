from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
from fastapi import HTTPException

ALLOWED = {'JPEG', 'PNG', 'WEBP', 'BMP'}
MAX_PIXELS = 25_000_000
Image.MAX_IMAGE_PIXELS = MAX_PIXELS

def load_image(blob: bytes, max_upload_mb: int) -> Image.Image:
    if not blob:
        raise HTTPException(400, 'Empty file')
    if len(blob) > max_upload_mb * 1024 * 1024:
        raise HTTPException(413, f'Max upload is {max_upload_mb} MB')
    try:
        with Image.open(BytesIO(blob)) as im:
            if im.format not in ALLOWED:
                raise HTTPException(415, 'Supported image formats: JPEG, PNG, WebP, BMP')
            if im.width * im.height > MAX_PIXELS:
                raise HTTPException(413, 'Image resolution too large')
            img = ImageOps.exif_transpose(im).convert('RGB')
            img.load()
        return img
    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise HTTPException(415, 'Invalid or unsupported image') from exc
