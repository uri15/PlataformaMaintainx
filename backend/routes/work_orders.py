from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Request
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/v1/work-orders", tags=["Órdenes de Trabajo"])

# Base de datos simulada en memoria para Órdenes de Trabajo (CMMS)
MOCK_WORK_ORDERS = [
    {
        "id": "WO-1001",
        "title": "Mantenimiento Preventivo Chiller Central #2",
        "description": "Limpieza de serpentines, verificación de presión de refrigerante R-410A y reapriete de contactos eléctricos.",
        "asset_id": "AST-202",
        "asset_name": "Chiller Carrier 150 TR",
        "priority": "Alta",
        "status": "En Proceso",
        "type": "Preventivo",
        "requested_by": "u-solicitante-004",
        "assigned_to": "u-tecnico-003",
        "comments": [
            {"id": "c1", "author": "Téc. Juan Pérez", "text": "Presión de succión verificada en 115 PSI.", "created_at": "2026-08-09T10:30:00"}
        ],
        "signature": None,
        "created_at": "2026-08-08T08:00:00",
        "updated_at": "2026-08-09T10:30:00"
    },
    {
        "id": "WO-1002",
        "title": "Fuga de Agua en Subestación Eléctrica Nave B",
        "description": "Se detectó filtración por tubería superior afectando tablero de distribución principal.",
        "asset_id": "AST-105",
        "asset_name": "Tablero Distribución N-B",
        "priority": "Urgente",
        "status": "Pendiente",
        "type": "Correctivo",
        "requested_by": "u-solicitante-004",
        "assigned_to": "u-tecnico-003",
        "comments": [],
        "signature": None,
        "created_at": "2026-08-10T07:15:00",
        "updated_at": "2026-08-10T07:15:00"
    },
    {
        "id": "WO-1003",
        "title": "Inspección Anual de Polipastos de Carga",
        "description": "Verificación de frenos, cables de acero y botoneras de control.",
        "asset_id": "AST-309",
        "asset_name": "Polipasto Yale 5 Ton",
        "priority": "Media",
        "status": "Completada",
        "type": "Inspección",
        "requested_by": "u-supervisor-002",
        "assigned_to": "u-tecnico-003",
        "comments": [],
        "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        "created_at": "2026-08-05T09:00:00",
        "updated_at": "2026-08-06T16:45:00"
    }
]

# Modelos Pydantic para solicitudes y respuestas
class WorkOrderCreate(BaseModel):
    title: str = Field(..., example="Reparación de Compresor de Aire")
    description: str = Field(..., example="Ruido anormal en polea principal")
    asset_id: str = Field(..., example="AST-101")
    priority: str = Field(default="Media", example="Alta")
    type: str = Field(default="Correctivo", example="Correctivo")
    assigned_to: Optional[str] = Field(None, example="u-tecnico-003")

class WorkRequestCreate(BaseModel):
    title: str = Field(..., example="Fuga de refrigerante en Nave 4")
    description: str = Field(..., example="Se observa goteo en unidad manejadora de aire 3")
    asset_id: str = Field(..., example="AST-501")
    priority: str = Field(default="Media", example="Urgente")

class WorkOrderStatusUpdate(BaseModel):
    status: str = Field(..., example="En Proceso")

class CommentCreate(BaseModel):
    comment: str = Field(..., example="Se reemplazó empaque dañado y se probó hermeticidad.")

class SignatureCreate(BaseModel):
    signature_data: str = Field(..., example="data:image/png;base64,...")


# -----------------------------------------------------------------------------
# ENDPOINTS
# -----------------------------------------------------------------------------

@router.get("/", response_model=List[dict])
def list_work_orders(status: Optional[str] = None):
    """Obtener todas las órdenes de trabajo (Admin, Supervisor, Auditor)."""
    if status:
        return [wo for wo in MOCK_WORK_ORDERS if wo["status"].lower() == status.lower()]
    return MOCK_WORK_ORDERS


@router.get("/my-orders", response_model=List[dict])
def get_my_orders(request: Request):
    """Obtener órdenes asignadas al técnico autenticado (Técnico)."""
    user_id = request.state.user.get("sub")
    # Para demostración, si el usuario es técnico, filtramos o devolvemos las asignadas a él
    user_orders = [wo for wo in MOCK_WORK_ORDERS if wo["assigned_to"] == user_id]
    if not user_orders:
        # Retornar muestra si es primer inicio
        return [wo for wo in MOCK_WORK_ORDERS if wo["assigned_to"] == "u-tecnico-003"]
    return user_orders


@router.get("/my-requests", response_model=List[dict])
def get_my_requests(request: Request):
    """Obtener solicitudes de mantenimiento creadas por el solicitante (Solicitante)."""
    user_id = request.state.user.get("sub")
    user_requests = [wo for wo in MOCK_WORK_ORDERS if wo["requested_by"] == user_id]
    if not user_requests:
        return [wo for wo in MOCK_WORK_ORDERS if wo["requested_by"] == "u-solicitante-004"]
    return user_requests


@router.get("/{order_id}", response_model=dict)
def get_work_order_by_id(order_id: str):
    """Obtener detalle de una orden de trabajo por ID."""
    for wo in MOCK_WORK_ORDERS:
        if wo["id"].upper() == order_id.upper():
            return wo
    raise HTTPException(status_code=404, detail=f"Órden de trabajo '{order_id}' no encontrada.")


@router.post("/", status_code=201, response_model=dict)
def create_work_order(wo_data: WorkOrderCreate, request: Request):
    """Crear una nueva Orden de Trabajo completa (Admin, Supervisor)."""
    user_id = request.state.user.get("sub")
    new_id = f"WO-{1000 + len(MOCK_WORK_ORDERS) + 1}"
    now_str = datetime.now().isoformat()

    new_wo = {
        "id": new_id,
        "title": wo_data.title,
        "description": wo_data.description,
        "asset_id": wo_data.asset_id,
        "asset_name": f"Activo {wo_data.asset_id}",
        "priority": wo_data.priority,
        "status": "Pendiente",
        "type": wo_data.type,
        "requested_by": user_id,
        "assigned_to": wo_data.assigned_to,
        "comments": [],
        "signature": None,
        "created_at": now_str,
        "updated_at": now_str
    }
    MOCK_WORK_ORDERS.append(new_wo)
    return new_wo


@router.post("/create-request", status_code=201, response_model=dict)
def create_work_request(req_data: WorkRequestCreate, request: Request):
    """Crear una solicitud rápida de mantenimiento (Solicitante)."""
    user_id = request.state.user.get("sub")
    new_id = f"WO-REQ-{1000 + len(MOCK_WORK_ORDERS) + 1}"
    now_str = datetime.now().isoformat()

    new_request = {
        "id": new_id,
        "title": req_data.title,
        "description": req_data.description,
        "asset_id": req_data.asset_id,
        "asset_name": f"Activo {req_data.asset_id}",
        "priority": req_data.priority,
        "status": "Pendiente",
        "type": "Correctivo",
        "requested_by": user_id,
        "assigned_to": None,
        "comments": [],
        "signature": None,
        "created_at": now_str,
        "updated_at": now_str
    }
    MOCK_WORK_ORDERS.append(new_request)
    return new_request


@router.put("/{order_id}", response_model=dict)
def update_work_order(order_id: str, wo_data: WorkOrderCreate):
    """Actualizar datos de una Orden de Trabajo existente (Admin, Supervisor)."""
    for wo in MOCK_WORK_ORDERS:
        if wo["id"].upper() == order_id.upper():
            wo["title"] = wo_data.title
            wo["description"] = wo_data.description
            wo["asset_id"] = wo_data.asset_id
            wo["priority"] = wo_data.priority
            wo["type"] = wo_data.type
            if wo_data.assigned_to:
                wo["assigned_to"] = wo_data.assigned_to
            wo["updated_at"] = datetime.now().isoformat()
            return wo
    raise HTTPException(status_code=404, detail=f"Órden de trabajo '{order_id}' no encontrada.")


@router.patch("/{order_id}/status", response_model=dict)
def update_order_status(order_id: str, status_data: WorkOrderStatusUpdate):
    """Actualizar únicamente el estado de una Orden de Trabajo (Técnico, Supervisor, Admin)."""
    for wo in MOCK_WORK_ORDERS:
        if wo["id"].upper() == order_id.upper():
            wo["status"] = status_data.status
            wo["updated_at"] = datetime.now().isoformat()
            return wo
    raise HTTPException(status_code=404, detail=f"Órden de trabajo '{order_id}' no encontrada.")


@router.post("/{order_id}/comments", response_model=dict)
def add_comment(order_id: str, comment_data: CommentCreate, request: Request):
    """Agregar un comentario o bitácora a la Orden de Trabajo (Técnico, Supervisor, Admin)."""
    user_name = request.state.user.get("full_name", "Técnico de Campo")
    for wo in MOCK_WORK_ORDERS:
        if wo["id"].upper() == order_id.upper():
            new_comment = {
                "id": f"c-{len(wo['comments']) + 1}",
                "author": user_name,
                "text": comment_data.comment,
                "created_at": datetime.now().isoformat()
            }
            wo["comments"].append(new_comment)
            wo["updated_at"] = datetime.now().isoformat()
            return {"message": "Comentario registrado con éxito.", "comment": new_comment, "work_order_id": order_id}
    raise HTTPException(status_code=404, detail=f"Órden de trabajo '{order_id}' no encontrada.")


@router.post("/{order_id}/signature", response_model=dict)
def add_signature(order_id: str, sig_data: SignatureCreate):
    """Registrar la firma digital de recepción/conformidad (Técnico, Supervisor, Admin)."""
    for wo in MOCK_WORK_ORDERS:
        if wo["id"].upper() == order_id.upper():
            wo["signature"] = sig_data.signature_data
            wo["updated_at"] = datetime.now().isoformat()
            return {"message": "Firma digital guardada correctamente.", "work_order_id": order_id}
    raise HTTPException(status_code=404, detail=f"Órden de trabajo '{order_id}' no encontrada.")


@router.delete("/{order_id}", response_model=dict)
def delete_work_order(order_id: str):
    """Eliminar una Orden de Trabajo (Sólo Admin)."""
    for idx, wo in enumerate(MOCK_WORK_ORDERS):
        if wo["id"].upper() == order_id.upper():
            removed = MOCK_WORK_ORDERS.pop(idx)
            return {"message": f"Órden de trabajo '{order_id}' eliminada exitosamente.", "deleted_order": removed}
    raise HTTPException(status_code=404, detail=f"Órden de trabajo '{order_id}' no encontrada.")
