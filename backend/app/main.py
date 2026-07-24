from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.routers.users import auth, roles
from app.routers.admin import users_by_admin, logs_by_admin, roles_by_admin
from app.routers.events import events
from app.routers.heatmap import heatmap
from app.routers.forecast import forecast

from app.services.automated.scheduler import scheduler


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Starting Energy Risk Monitor API...")

    try:

        if not scheduler.running:

            scheduler.start()

            logger.info("Background scheduler started successfully.")

    except Exception:

        logger.exception("Failed to start background scheduler.")

        raise

    yield

    logger.info("Stopping Energy Risk Monitor API...")

    try:

        if scheduler.running:

            scheduler.shutdown(wait=False)

            logger.info("Background scheduler stopped successfully.")

    except Exception:

        logger.exception("Error while stopping background scheduler.")


app = FastAPI(
    title="Energy Risk Monitor API",
    version="1.0.0",
    lifespan=lifespan
)


# ==========================================================
# Routers
# ==========================================================

app.include_router(auth.router)
app.include_router(roles.router)

app.include_router(users_by_admin.router)
app.include_router(roles_by_admin.router)
app.include_router(logs_by_admin.router)

app.include_router(events.router)
app.include_router(heatmap.router)
app.include_router(forecast.router)


# ==========================================================
# Middleware
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# Health Check
# ==========================================================

@app.get("/", tags=["Health"])
def health_check():

    return {
        "status": "OK",
        "service": "Energy Risk Monitor API"
    }