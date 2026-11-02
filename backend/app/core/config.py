from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import List, Union
from pathlib import Path
import json

# Locate backend directory and root workspace directory
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    # Required sensitive settings must be provided via .env (no hardcoded passwords or credentials)
    DATABASE_URL: str = Field(..., description="PostgreSQL database connection URL")
    SECRET_KEY: str = Field(..., description="Secret key for JWT/session token cryptographic signing")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173"]
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        # Look for .env in current working dir, backend dir, or root dir
        env_file=(
            str(Path(".env").resolve()),
            str((BACKEND_DIR / ".env").resolve()),
            str((ROOT_DIR / ".env").resolve()),
        ),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()


