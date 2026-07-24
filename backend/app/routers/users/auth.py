from app.core.security import create_access_token
from app.database.database import get_db
from app.models.module import Module
from app.models.role import Role
from app.models.user import User
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    email: str
    password: str


class NewUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role_id: int


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if user is None:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="El usuario está deshabilitado")

    role = db.query(Role).filter(Role.id == user.role_id).first()

    if role is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    modules = db.query(Module).filter(Module.id.in_(role.modules)).all()

    modulos = [
        {"label": module.name, "route": module.route, "icon": module.icon}
        for module in modules
    ]

    token = create_access_token(
        {
            "sub": str(user.id),
            "userName": f"{user.first_name} {user.last_name}",
            "modulos": modulos,
            "rol": user.role_id,
            "mail": user.email,
        }
    )

    return {"status": "ok", "access_token": token, "token_type": "Bearer"}


@router.post("/register")
def register_user(data: NewUserRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if user:
        raise HTTPException(status_code=400, detail="El correo ya está regiastrado")

    password_hash = pwd_context.hash(data.password)

    new_user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password_hash=password_hash,
        role_id=data.role_id,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"status": "ok", "detail": "Usuario registrado correctamente"}
