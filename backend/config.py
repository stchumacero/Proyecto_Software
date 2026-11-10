
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:

    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "elan_watches_super_secret_key_dev_2026"
    )

    DATABASE_PATH = os.environ.get(
        "DATABASE_PATH",
        os.path.join(BASE_DIR, "elan_security.db")
    )

    FRONTEND_URL = os.environ.get(
        "FRONTEND_URL",
        "http://localhost:5173"
    )

    SESSION_COOKIE_NAME = "elan_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = os.environ.get(
        "SESSION_COOKIE_SAMESITE",
        "Lax"
    )

    SESSION_COOKIE_SECURE = os.environ.get(
        "SESSION_COOKIE_SECURE",
        "False"
    ).lower() in ("true", "1")

    PERMANENT_SESSION_LIFETIME = timedelta(hours=8)

    ROLES_PERMITIDOS = [
        "ADMINISTRADOR",
        "ALMACEN",
        "CLIENTE"
    ]

    ESTADOS_PERMITIDOS = [
        "ACTIVO",
        "INACTIVO"
    ]
