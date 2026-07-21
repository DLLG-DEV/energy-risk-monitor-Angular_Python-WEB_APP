from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.routers.users import auth, roles
from app.routers.admin import users_by_admin, logs_by_admin, roles_by_admin
from app.routers.events import events
app = FastAPI(
    title="Energy Risk Monitor API",
    version="1.0"
)

app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(logs_by_admin.router)
app.include_router(users_by_admin.router)
app.include_router(roles_by_admin.router)
app.include_router(events.router)

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        settings.FRONTEND_URL
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

@app.get("/")
def test_connection():
    return {
        "status" : "OK"
    }