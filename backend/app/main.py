from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.inference.detector import Detector
from app.api.routes.detection import router


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title='LabelAlignment QA', version='0.1.0',
                  description='Research prototype: source-defined label detection, not calibrated QA.')
    app.state.settings = settings
    app.state.detector = Detector(settings.model_path)
    app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins,
                       allow_methods=['GET', 'POST'], allow_headers=['Content-Type'])
    app.include_router(router)

    @app.get('/api/v1/health')
    def health():
        return {'status': 'ok', 'model': app.state.detector.status().model_dump()}

    return app

app = create_app()
