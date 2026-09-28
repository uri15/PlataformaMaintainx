import datetime
import jwt
from fastapi import HTTPException, status
from backend.config import JWT_SECRET, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Usuarios de prueba preconfigurados para la plataforma CMMS (uno por cada rol en roles.json)
DEMO_USERS = {
    "admin@park.com": {
        "id": "u-admin-001",
        "email": "admin@park.com",
        "password": "Password123!",
        "full_name": "Ing. Carlos Mendoza (Admin)",
        "role": "admin"
    },
    "supervisor@park.com": {
        "id": "u-supervisor-002",
        "email": "supervisor@park.com",
        "password": "Password123!",
        "full_name": "Arq. Sofía Ramírez (Supervisor)",
        "role": "supervisor"
    },
    "tecnico@park.com": {
        "id": "u-tecnico-003",
        "email": "tecnico@park.com",
        "password": "Password123!",
        "full_name": "Téc. Juan Pérez (Técnico)",
        "role": "tecnico"
    },
    "solicitante@park.com": {
        "id": "u-solicitante-004",
        "email": "solicitante@park.com",
        "password": "Password123!",
        "full_name": "Op. Maria López (Solicitante)",
        "role": "solicitante"
    },
    "auditor@park.com": {
        "id": "u-auditor-005",
        "email": "auditor@park.com",
        "password": "Password123!",
        "full_name": "Lic. Roberto Gómez (Auditor)",
        "role": "auditor"
    }
}

def create_access_token(user_data: dict) -> str:
    """Genera un token JWT firmado con el rol y datos del usuario"""
    payload = {
        "sub": user_data["id"],
        "email": user_data["email"],
        "full_name": user_data["full_name"],
        "role": user_data["role"],
        "iat": datetime.datetime.now(datetime.timezone.utc),
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_access_token(token: str) -> dict:
    """Decodifica y valida un token JWT"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token JWT ha expirado. Por favor inicie sesión nuevamente."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token JWT inválido o malformado."
        )
