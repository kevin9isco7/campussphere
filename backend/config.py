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


def env_bool(*names, default=False):
    value = str(env_value(*names, default=str(default))).strip().lower()
    return value in {"1", "true", "yes", "on"}


class Config:
    APP_ENV = env_value("APP_ENV", default="production")
    DEBUG = env_bool("DEBUG", default=False)
    SECRET_KEY = env_value("SECRET_KEY", "APP_SECRET", default="change-this-long-random-secret")

    DATABASE_HOST = env_value("DATABASE_HOST", "DB_HOST", default="127.0.0.1")
    DATABASE_PORT = env_int("DATABASE_PORT", "DB_PORT", default=3306)
    DATABASE_NAME = env_value("DATABASE_NAME", "DB_NAME", default="school_management")
    DATABASE_USER = env_value("DATABASE_USER", "DB_USER", default="root")
    DATABASE_PASSWORD = env_value("DATABASE_PASSWORD", "DB_PASSWORD", default="", allow_empty=True)
    DATABASE_SSL_MODE = env_value("DATABASE_SSL_MODE", default="", allow_empty=True)
    DATABASE_SSL_CA = env_value("DATABASE_SSL_CA", default="", allow_empty=True)
    DATABASE_CONNECT_TIMEOUT = env_int("DATABASE_CONNECT_TIMEOUT", default=10)

    DB_HOST = DATABASE_HOST
    DB_PORT = DATABASE_PORT
    DB_NAME = DATABASE_NAME
    DB_USER = DATABASE_USER
    DB_PASSWORD = DATABASE_PASSWORD

    DEFAULT_FRONTEND_URL = "https://campussphere-sigma.vercel.app"
    FRONTEND_URL = env_value("FRONTEND_URL", default=DEFAULT_FRONTEND_URL, allow_empty=True)
    _default_cors_source = (
        "http://localhost,http://localhost:8000,"
        "http://127.0.0.1,http://127.0.0.1:8000,"
        f"{DEFAULT_FRONTEND_URL}"
    )
    _cors_source = env_value(
        "CORS_ALLOWED_ORIGINS",
        "CORS_ORIGINS",
        default=_default_cors_source,
    )
    CORS_ORIGINS = [
        origin.strip()
        for origin in _cors_source.split(",")
        if origin.strip()
    ]
    if FRONTEND_URL and FRONTEND_URL not in CORS_ORIGINS:
        CORS_ORIGINS.append(FRONTEND_URL)
    CORS_SUPPORTS_CREDENTIALS = env_bool("CORS_SUPPORTS_CREDENTIALS", default=False)

    TOKEN_TTL_SECONDS = env_int("TOKEN_TTL_SECONDS", default=28800)
    UPLOAD_DIR = Path(env_value("UPLOAD_DIR", default=str(BASE_DIR / "uploads"))).resolve()
    SERVER_HOST = env_value("SERVER_HOST", default="127.0.0.1")
    SERVER_PORT = env_int("SERVER_PORT", "PORT", default=5000)

    SESSION_COOKIE_SECURE = env_bool("SESSION_COOKIE_SECURE", default=APP_ENV == "production")
    SESSION_COOKIE_SAMESITE = env_value("SESSION_COOKIE_SAMESITE", default="Lax")

    OPENAI_API_KEY = env_value("OPENAI_API_KEY", default="", allow_empty=True)
    CLOUDINARY_CLOUD_NAME = env_value("CLOUDINARY_CLOUD_NAME", default="", allow_empty=True)
    CLOUDINARY_API_KEY = env_value("CLOUDINARY_API_KEY", default="", allow_empty=True)
    CLOUDINARY_API_SECRET = env_value("CLOUDINARY_API_SECRET", default="", allow_empty=True)
    CLOUDINARY_URL = env_value("CLOUDINARY_URL", default="", allow_empty=True)
    STORAGE_PROVIDER = env_value("STORAGE_PROVIDER", default="local")
