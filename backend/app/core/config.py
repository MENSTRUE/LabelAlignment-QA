from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[3]

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT / '.env', extra='ignore')
    model_path: Path = ROOT / 'models' / 'labelalignment_primary_best.pt'
    max_upload_mb: int = 10
    confidence: float = 0.25
    iou: float = 0.45
    cors_origins: str = 'http://localhost:5173,http://127.0.0.1:5173'

    @property
    def allowed_origins(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(',') if x.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()
