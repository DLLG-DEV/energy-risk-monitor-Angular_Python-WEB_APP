from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)


class LoginRequest(BaseModel):

    email: str

    password: str



@router.post("/login")
def login(data: LoginRequest):

    print("Usuario recibido:")
    print(data.email)
    print(data.password)


    # Simulación temporal
    if data.email == "admin@test.com" and data.password == "123456":

        return {

            "message": "Login correcto",

            "user": {
                "email": data.email,
                "role": "admin"
            }

        }


    raise HTTPException(

        status_code=401,

        detail="Credenciales incorrectas"

    )