import os
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None

BASE_DIR = Path(__file__).resolve().parent
if load_dotenv:
    load_dotenv(BASE_DIR / ".env")


def env_value(*names, default=None, allow_empty=False):
    for name in names:
        if name in os.environ:
            value = os.environ.get(name)
            if value or allow_empty:
                return value
    return default


def env_int(*names, default=0):
    value = env_value(*names, default=str(default), allow_empty=False)
    return int(value)


class Config:
    APP_ENV = env_value("APP_ENV", default="production")
    SECRET_KEY = env_value("SECRET_KEY", "APP_SECRET", default="change-this-long-random-secret")

    DATABASE_HOST = env_value("DATABASE_HOST", "DB_HOST", default="127.0.0.1")
    DATABASE_PORT = env_int("DATABASE_PORT", "DB_PORT", default=3306)
    DATABASE_NAME = env_value("DATABASE_NAME", "DB_NAME", default="school_management")
    DATABASE_USER = env_value("DATABASE_USER", "DB_USER", default="root")
    DATABASE_PASSWORD = env_value("DATABASE_PASSWORD", "DB_PASSWORD", default="", allow_empty=True)

    DB_HOST = DATABASE_HOST
    DB_PORT = DATABASE_PORT
    DB_NAME = DATABASE_NAME
    DB_USER = DATABASE_USER
    DB_PASSWORD = DATABASE_PASSWORD

    CORS_ORIGINS = [
        origin.strip()
        for origin in env_value(
            "CORS_ORIGINS",
            default="http://localhost,http://localhost:8000,http://127.0.0.1,http://127.0.0.1:8000",
        ).split(",")
        if origin.strip()
    ]
    TOKEN_TTL_SECONDS = env_int("TOKEN_TTL_SECONDS", default=28800)
    UPLOAD_DIR = Path(env_value("UPLOAD_DIR", default=str(BASE_DIR / "uploads"))).resolve()
    SERVER_HOST = env_value("SERVER_HOST", default="127.0.0.1")
    SERVER_PORT = env_int("SERVER_PORT", "PORT", default=5000)

    OPENAI_API_KEY = env_value("OPENAI_API_KEY", default="", allow_empty=True)
    CLOUDINARY_CLOUD_NAME = env_value("CLOUDINARY_CLOUD_NAME", default="", allow_empty=True)
    CLOUDINARY_API_KEY = env_value("CLOUDINARY_API_KEY", default="", allow_empty=True)
    CLOUDINARY_API_SECRET = env_value("CLOUDINARY_API_SECRET", default="", allow_empty=True)
