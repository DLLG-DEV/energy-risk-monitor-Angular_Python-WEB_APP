from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.dependencies import get_current_user, require_admin
from app.database.database import get_db
from app.models.user import User
from app.models.role import Role
from app.utils.logs import create_log


router = APIRouter(
    prefix="/api/admin",
    tags=["Users by Admin"]
)

class UserAdminResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role_id: int
    role: str
    is_active: bool
    created_at: datetime
    
class UserAdminUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role_id: int
    is_active: bool


@router.get("/users", response_model=list[UserAdminResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
    ):

    users = (
        db.query(User)
        .join(Role)
        .all()
    )

    return [
        {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role_id": user.role_id,
            "role": user.role.name,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
        for user in users
    ]
    

@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    data: UserAdminUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="Usuario no encontrado"
        )

    role = (
        db.query(Role)
        .filter(Role.id == data.role_id)
        .first()
    )

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Rol no encontrado"
        )

    # Evitar correos duplicados
    email_exists = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.id != user_id
        )
        .first()
    )

    if email_exists:
        raise HTTPException(
            status_code=400,
            detail="El correo ya está registrado"
        )

    old_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role_id": user.role_id,
        "role": user.role.name,
        "is_active": user.is_active
    }

    user.first_name = data.first_name
    user.last_name = data.last_name
    user.email = data.email
    user.role_id = data.role_id
    user.is_active = data.is_active

    db.commit()
    
    new_data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role_id": user.role_id,
        "role": role.name,
        "is_active": user.is_active
    }
    
    create_log(
        db=db,
        user=current_user,
        action="UPDATE",
        entity="USER",
        entity_id=user.id,
        description=f"Actualizó el usuario {user.email}",
        old_data=old_data,
        new_data=new_data
    )    
    
    db.refresh(user)

    return {
        "detail": "Usuario actualizado correctamente"
    }