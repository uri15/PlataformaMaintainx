import re
import jwt
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from backend.config import ROLES_DATA, JWT_SECRET, JWT_ALGORITHM

# Rutas públicas que no requieren autenticación ni validación RBAC
PUBLIC_ROUTES = [
    "/",
    "/index.html",
    "/src",
    "/api/v1/auth/login",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/favicon.ico"
]

def match_route_pattern(pattern: str, request_path: str) -> bool:
    """
    Verifica si una ruta solicitada (request_path) coincide con un patrón RBAC (pattern).
    Soporta coincidencia exacta y comodines '*' (ej: /api/v1/work-orders/* o /api/v1/work-orders/*/status).
    """
    norm_path = request_path.rstrip("/") if len(request_path) > 1 else request_path
    norm_pattern = pattern.rstrip("/") if len(pattern) > 1 else pattern

    if "*" in norm_pattern:
        if norm_pattern.endswith("/*"):
            prefix = norm_pattern[:-2]
            return norm_path == prefix or norm_path.startswith(prefix + "/")
        
        regex_str = "^" + re.escape(norm_pattern).replace(r"\*", ".*") + "$"
        return bool(re.match(regex_str, norm_path))
    
    return norm_path == norm_pattern


class RBACAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # 1. Permitir rutas públicas sin token
        if any(path == pub_route or path.startswith(pub_route + "/") for pub_route in PUBLIC_ROUTES if pub_route != "/"):
            return await call_next(request)

        # 2. Exigir cabecera Authorization: Bearer <token>
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "error": "Unauthorized",
                    "detail": "Acceso no autorizado: Se requiere la cabecera 'Authorization: Bearer <token>'."
                }
            )

        token = auth_header.split(" ")[1]

        # 3. Validar token JWT
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            request.state.user = payload
        except jwt.ExpiredSignatureError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"error": "Unauthorized", "detail": "El token JWT ha expirado. Por favor autentíquese nuevamente."}
            )
        except jwt.InvalidTokenError:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"error": "Unauthorized", "detail": "Token JWT inválido o malformado."}
            )

        user_role = payload.get("role")
        user_email = payload.get("email")

        # 4. Validar configuración del rol en roles.json
        roles_dict = ROLES_DATA.get("roles", {})
        if user_role not in roles_dict:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "error": "Forbidden",
                    "detail": f"Acceso denegado: El rol '{user_role}' no está configurado en la definición de seguridad."
                }
            )

        role_config = roles_dict[user_role]
        route_protection = role_config.get("routeProtection", {})
        api_routes = route_protection.get("apiRoutes", [])
        allowed_methods = [m.upper() for m in route_protection.get("allowedMethods", [])]

        # 5. Comprobar coincidencia de la ruta
        path_allowed = any(match_route_pattern(route_pattern, path) for route_pattern in api_routes)

        if not path_allowed:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "error": "Forbidden",
                    "detail": f"Acceso denegado (RBAC): El rol '{user_role}' ({user_email}) no tiene acceso a la ruta '{path}'."
                }
            )

        # 6. Comprobar método HTTP permitido
        method = request.method.upper()
        if method not in allowed_methods:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={
                    "error": "Forbidden",
                    "detail": f"Acceso denegado (RBAC): El rol '{user_role}' no tiene permiso para ejecutar la acción '{method}' en '{path}'. Métodos autorizados: {allowed_methods}"
                }
            )

        # Si supera todas las validaciones de autenticación y autorización, procede a la ruta
        return await call_next(request)
