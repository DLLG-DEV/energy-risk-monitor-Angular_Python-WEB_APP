from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.role import Role
from app.models.module import Module
from app.core.config import settings


router = APIRouter(
    prefix="/api/rol",
    tags=["Roles"]
)


@router.get("/modules")
def get_role_modules(db: Session = Depends(get_db)):

    role = (
        db.query(Role)
        .filter(Role.id == settings.VIEWER_ROLE_ID)
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