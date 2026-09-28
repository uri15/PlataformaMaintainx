from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from backend.auth import DEMO_USERS, create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=LoginResponse)
def login(request_data: LoginRequest):
    """
    Endpoint de Login.
    Usuarios Demo Disponibles:
    - admin@park.com (Password123!)
    - supervisor@park.com (Password123!)
    - tecnico@park.com (Password123!)
    - solicitante@park.com (Password123!)
    - auditor@park.com (Password123!)
    """
    user = DEMO_USERS.get(request_data.email.lower())

    if not user or user["password"] != request_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas. Verifique el correo electrónico y la contraseña."
        )

    token = create_access_token(user)

    user_info = {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"]
    }

    return LoginResponse(access_token=token, user=user_info)

@router.get("/me")
def get_current_user(request: Request):
    """Retorna la información del usuario autenticado vía JWT."""
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no autenticado.")
    return {"user": user}
