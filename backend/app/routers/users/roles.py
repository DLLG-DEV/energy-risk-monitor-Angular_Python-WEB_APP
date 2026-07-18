from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.role import Role
from app.models.module import Module


router = APIRouter(
    prefix="/api/rol",
    tags=["Roles"]
)


@router.get("/modules/{role_id}")
def get_role_modules(role_id: int, db: Session = Depends(get_db) ):

    role = (
        db.query(Role)
        .filter(Role.id == role_id)
        .first()
    )

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado"
        )

    modules = (
        db.query(Module)
        .filter(Module.id.in_(role.modules))
        .all()
    )

    return [
        {
            "label": module.name,
            "route": module.route,
            "icon": module.icon
        }
        for module in modules
    ]