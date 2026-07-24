from datetime import datetime

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.event import Event
from fastapi import APIRouter, Depends, Query
from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/heatmap", tags=["Heatmap"])


def apply_filters(query, category, start_date, end_date):

    if category and category.lower() != "all":
        query = query.filter(Event.category == category)

    if start_date:
        query = query.filter(
            Event.event_date >= datetime.strptime(start_date, "%Y-%m-%d")
        )

    if end_date:
        query = query.filter(
            Event.event_date <= datetime.strptime(end_date, "%Y-%m-%d")
        )

    return query


@router.get("/kpis")
def get_heatmap_kpis(
    category: str | None = Query(None),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    query = db.query(Event)

    query = apply_filters(query, category, start_date, end_date)

    total_events = query.count()

    affected_countries = query.with_entities(Event.country).distinct().count()

    top_category = (
        query.with_entities(Event.category, func.count(Event.id).label("total"))
        .group_by(Event.category)
        .order_by(desc("total"))
        .first()
    )

    top_country = (
        query.with_entities(Event.country, func.count(Event.id).label("total"))
        .group_by(Event.country)
        .order_by(desc("total"))
        .first()
    )

    return {
        "total_events": total_events,
        "affected_countries": affected_countries,
        "top_category": top_category[0] if top_category else None,
        "top_country": top_country[0] if top_country else None,
    }


@router.get("/map")
def get_heatmap(
    category: str | None = Query(None),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    query = db.query(Event)

    query = apply_filters(query, category, start_date, end_date)

    events = query.all()

    return [
        {"lat": event.latitude, "lng": event.longitude, "weight": 1} for event in events
    ]


@router.get("/countries")
def get_country_ranking(
    category: str | None = Query(None),
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    query = db.query(Event)

    query = apply_filters(query, category, start_date, end_date)

    top = (
        query.with_entities(Event.country, func.count(Event.id).label("events"))
        .group_by(Event.country)
        .order_by(desc("events"))
        .limit(15)
        .all()
    )

    bottom = (
        query.with_entities(Event.country, func.count(Event.id).label("events"))
        .group_by(Event.country)
        .order_by(asc("events"), asc(Event.country))
        .limit(15)
        .all()
    )

    return {
        "top": [{"country": row.country, "events": row.events} for row in top],
        "bottom": [{"country": row.country, "events": row.events} for row in bottom],
    }


@router.get("/categories")
def get_categories(
    start_date: str | None = Query(None),
    end_date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    query = db.query(Event)

    query = apply_filters(query, None, start_date, end_date)

    rows = (
        query.with_entities(Event.category, func.count(Event.id).label("events"))
        .group_by(Event.category)
        .order_by(desc("events"))
        .all()
    )

    return [{"category": row.category, "events": row.events} for row in rows]
