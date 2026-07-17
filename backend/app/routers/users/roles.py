from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.role import Role
from app.models.module import Module


router = APIRouter(
    prefix="/api/rol",
    tags=["Roles"]
)


@router.get("/default-role")
def default_role(db: Session = Depends(get_db)):

    role = (
        db.query(Role)
        .filter(Role.name == "Viewer")
        .first()
    )

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Rol Viewer no encontrado"
        )

    modules = (
        db.query(Module)
        .filter(Module.id.in_(role.modules))
        .all()
    )

    return {
        "role": {
            "id": role.id,
            "name": role.name
        },
        "modules": [
            {
                "label": module.name,
                "route": module.route,
                "icon": module.icon,
            }
            for module in modules
        ]

    }