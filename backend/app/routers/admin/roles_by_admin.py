from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, require_admin
from app.database.database import get_db
from app.models.role import Role
from app.models.module import Module

router = APIRouter(
    prefix="/api/admin",
    tags=["Roles by Admin"]
)

@router.get("/roles")
def get_roles_modules(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
    ):

    roles = (
        db.query(Role)
        .all()
    )

    if not roles:
        raise HTTPException(
            status_code=404,
            detail="Roles no encontrados"
        )

    response = []

    for role in roles:
        modules = (
            db.query(Module)
            .filter(
                Module.id.in_(role.modules)
            )
            .all()
        )

        response.append(
            {
                "id": role.id,
                "name": role.name,
                "modules": [
                    {
                        "id": module.id,
                        "label": module.name,
                        "route": module.route,
                        "icon": module.icon
                    }
                    for module in modules
                ]
            }
        )

    return response