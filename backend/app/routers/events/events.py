from fastapi import APIRouter, Depends,Query, HTTPException
from sqlalchemy.orm import Session
from app.models.event import Event
from app.database.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.services.eventos import get_events
from datetime import datetime
from typing import Optional
from sqlalchemy import func
from app.services.nasa_service import (
    get_last_years_events,
    save_events,
    get_nasa_categories
)

router = APIRouter(
    prefix="/api/events",
    tags=["Events"]
)

CATEGORY_TRANSLATION = {
    "FIRE": "Incendios",
    "ICE": "Hielo",
    "STORM": "Tormentas",
    "VOLCANO": "Volcanes"
}


@router.post("/import")
def import_events(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):

    categories = get_nasa_categories()


    print(
        "Categorias NASA:",
        categories
    )
    
    events = get_last_years_events(
        years=5
    )


    result = save_events(
        db,
        events
    )


    return {
        
        "message": "Import completed",
        "categories": len(categories),

        "events_received": len(events),

        **result
    }
       
@router.get("/list")
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()

    return [
        {
            "id": event.id,
            "title": event.title,
            "category": event.category,
            "country": event.country,
            "event_date": event.event_date,
            "latitude":event.latitude,
            "longitude": event.longitude
        }
        for event in events
    ]
 
@router.get("/categories")
def get_event_categories(
    db: Session = Depends(get_db)
):

    categories = (
        db.query(Event.category)
        .distinct()
        .order_by(Event.category)
        .all()
    )


    result = []


    for item in categories:

        category = item[0]


        result.append({

            "code": category,

            "name": CATEGORY_TRANSLATION.get(
                category,
                category
            )

        })


    return result
   
@router.get("/search")
def search_events(
    category: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(
        1,
        ge=1
    ),
    limit: int = Query(
        20,
        ge=1,
        le=1000
    ),
    db: Session = Depends(get_db)
):
    query = db.query(Event)

    if category:
        query = query.filter(
            Event.category.ilike(
                f"%{category}%"
            )
        )

    if country:
        query = query.filter(
            Event.country.ilike(
                f"%{country}%"
            )
        )

    if start_date:
        start_date_obj = datetime.strptime(
            start_date,
            "%Y-%m-%d"
        )
        query = query.filter(
            Event.event_date >= start_date_obj
        )

    if end_date:
        end_date_obj = datetime.strptime(
            end_date,
            "%Y-%m-%d"
        )
        query = query.filter(
            Event.event_date <= end_date_obj
        )

    total = query.count()

    events = (
        query
        .order_by(
            Event.event_date.desc()
        )
        .offset(
            (page - 1) * limit
        )
        .limit(
            limit
        )
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results":[
            {
                "id": event.id,
                "title": event.title,
                "category": event.category,
                "country": event.country,
                "event_date": event.event_date,
                "latitude":event.latitude,
                "longitude": event.longitude

            }
            for event in events
        ]
    }
    
@router.get("/statistics")
def get_statistics(
    db: Session = Depends(get_db)
):

    # Total de eventos
    total = (
        db.query(
            func.count(Event.id)
        )
        .scalar()
    )


    # Total agrupado por categoría
    categories = (
        db.query(
            Event.category,
            func.count(Event.id).label("total")
        )
        .group_by(
            Event.category
        )
        .order_by(
            func.count(Event.id).desc()
        )
        .all()
    )


    return {
        "total": total,

        "categories": [
            {
                "code": category,
                "name": CATEGORY_TRANSLATION.get(
                    category,
                    category
                ),
                "total": total_category
            }

            for category, total_category in categories
        ]
    }
    
    
@router.get("/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Evento no encontrado"
        )

    return {
        "id": event.id,
        "external_id": event.external_id,
        "title": event.title,
        "category": event.category,
        "country": event.country,
        "latitude": event.latitude,
        "longitude": event.longitude,
        "event_date": event.event_date
    }
    