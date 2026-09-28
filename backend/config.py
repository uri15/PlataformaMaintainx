import os
import json
from pathlib import Path

# Configuración JWT
JWT_SECRET = os.getenv("JWT_SECRET", "cmms_park_super_secret_jwt_key_2026_plataformapark_platform")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

# Cargar definición de roles RBAC
BASE_DIR = Path(__file__).resolve().parent.parent
ROLES_FILE_PRIMARY = BASE_DIR / "src" / "data" / "roles.json"
ROLES_FILE_SECONDARY = BASE_DIR / "roles.json"

def load_roles_config() -> dict:
    if ROLES_FILE_PRIMARY.exists():
        with open(ROLES_FILE_PRIMARY, "r", encoding="utf-8") as f:
            return json.load(f)
    elif ROLES_FILE_SECONDARY.exists():
        with open(ROLES_FILE_SECONDARY, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        raise FileNotFoundError("No se encontró el archivo roles.json en la estructura del proyecto.")

ROLES_DATA = load_roles_config()
