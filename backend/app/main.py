from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.routers import auth


app = FastAPI(
    title="Energy Risk Monitor API",
    version="1.0"
)

app.include_router(auth.router)

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