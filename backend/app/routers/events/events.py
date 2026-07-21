from fastapi import APIRouter, Depends,Query
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.services.eventos import get_events
from app.services.nasa_service import (
    get_last_5_years_events,
    save_events
)

router = APIRouter(
    prefix="/api/events",
    tags=["Events"]
)


@router.post("/import")
def import_events(
    db: Session = Depends(get_db)
):

    events = get_last_5_years_events()

    result = save_events(
        db,
        events
    )

    return {

        "message": "Events imported successfully",

        "events_received": len(events),

        "events_imported": result["imported"],

        "events_skipped": result["skipped"]

    }
    
@router.get("/events")
def list_events(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category: str | None = None,
    country: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_events(
        db=db,
        page=page,
        size=size,
        category=category,
        country=country,
        search=search
    )