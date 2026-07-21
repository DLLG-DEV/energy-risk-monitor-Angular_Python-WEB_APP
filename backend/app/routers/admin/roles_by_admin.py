from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, require_admin
from app.database.database import get_db
from app.models.role import Role
from app.models.module import Module
from app.utils.logs import create_log


router = APIRouter(
    prefix="/api/admin",
    tags=["Roles by Admin"]
)

class RoleCreate(BaseModel):

    name:str

    modules:list[int]
    
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

@router.get("/roles/list")
def get_roles_list(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
    ):
    
    roles = (
        db.query(Role)
        .order_by(Role.id)
        .all()
    )

    if not roles:
        raise HTTPException(
            status_code=404,
            detail="Roles no encontrados"
        )

    return [
        {
            "id": role.id,
            "name": role.name
        }
        for role in roles
    ]

@router.post("/roles")
def create_role(
    data: RoleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    exists = (
        db.query(Role)
        .filter(Role.name == data.name)
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="El rol ya existe"
        )

    new_role = Role(
        name=data.name,
        modules=data.modules
    )

    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    new_data = {
        "name": new_role.name,
        "modules": new_role.modules
    }

    create_log(
        db=db,
        user=current_user,
        action="CREATE",
        entity="ROLE",
        entity_id=new_role.id,
        description=f"Creó el rol {new_role.name}",
        old_data=None,
        new_data=new_data
    )

    return {
        "message":"Rol creado correctamente",
        "id":new_role.id
    }
    
@router.put("/roles/{role_id}")
def update_role(
    role_id:int,
    data:RoleCreate,
    db:Session = Depends(get_db),
    current_user = Depends(require_admin)
):
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

    exists = (
        db.query(Role)
        .filter(
            Role.name == data.name,
            Role.id != role_id
        )
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="El rol ya existe"
        )

    old_data = {
        "name": role.name,
        "modules": role.modules
    }
    
    role.name = data.name
    role.modules = data.modules

    db.commit()
    db.refresh(role)

    new_data = {
        "name": role.name,
        "modules": role.modules
    }

    create_log(
        db=db,
        user=current_user,
        action="UPDATE",
        entity="ROLE",
        entity_id=role.id,
        description=f"Actualizó el rol {role.name}",
        old_data=old_data,
        new_data=new_data
    )

    return {
        "message":"Rol actualizado correctamente"
    }