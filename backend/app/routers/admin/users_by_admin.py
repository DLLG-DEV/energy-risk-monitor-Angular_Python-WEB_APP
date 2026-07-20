from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.dependencies import get_current_user, require_admin
from app.database.database import get_db
from app.models.user import User
from app.models.role import Role

router = APIRouter(
    prefix="/api/admin",
    tags=["Users by Admin"]
)

class UserAdminResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime


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
            "role": user.role.name,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
        for user in users
    ]