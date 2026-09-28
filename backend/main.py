import os
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from backend.rbac_middleware import RBACAuthMiddleware
from backend.routes.auth_routes import router as auth_router
from backend.routes.work_orders import router as work_orders_router

# Esquema de seguridad JWT para activar el botón "Authorize" y candados 🔐 en Swagger UI (/docs)
security_scheme = HTTPBearer(auto_error=False)

app = FastAPI(
    title="PLATAFORMA PARK CMMS — API Backend & RBAC Engine",
    description="Servidor Backend en FastAPI con Autenticación JWT y Middleware de Autorización basado en roles.json",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. Middleware CORS para integración con Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Middleware de Autenticación JWT y Autorización Dinámica RBAC
app.add_middleware(RBACAuthMiddleware)

# 3. Montar archivos estáticos del Frontend (/src)
if os.path.exists("src"):
    app.mount("/src", StaticFiles(directory="src"), name="src")

# 4. Registro de Routers
app.include_router(auth_router)
app.include_router(work_orders_router, dependencies=[Depends(security_scheme)])

@app.get("/", response_class=FileResponse, tags=["Frontend"])
def serve_index():
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {"system": "PLATAFORMA PARK CMMS API", "status": "Online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

