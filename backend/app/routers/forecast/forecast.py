from datetime import datetime

from app.core.dependencies import get_current_user, require_admin
from app.database.database import get_db
from app.models.event_category import EventCategory
from app.models.forecast import Forecast
from app.services.forecast_service import generate_forecast
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/forecast", tags=["Forecast"])


@router.get("/data")
def get_forecast_data(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    forecasts = db.query(Forecast).order_by(Forecast.forecast_date).all()

    return forecasts


@router.get("/timeline")
def forecast_timeline(db: Session = Depends(get_db)):
    forecasts = (
        db.query(Forecast)
        .filter(Forecast.active == True)
        .order_by(Forecast.forecast_date)
        .all()
    )

    timeline = {}

    for item in forecasts:
        date = str(item.forecast_date)

        if date not in timeline:
            timeline[date] = {"date": date, "total_events": 0, "categories": []}

        timeline[date]["total_events"] += item.expected_events

        timeline[date]["categories"].append(
            {
                "category": item.category,
                "region": item.region,
                "country": item.country,
                "events": item.expected_events,
                "risk": item.risk_level,
                "confidence": item.confidence,
            }
        )

    return list(timeline.values())


@router.get("/dashboard")
def forecast_dashboard(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    forecasts = (
        db.query(Forecast)
        .filter(Forecast.active == True)
        .order_by(Forecast.forecast_date)
        .all()
    )

    timeline = {}

    total_events = 0
    critical_regions = set()
    categories = set()

    for item in forecasts:
        total_events += item.expected_events

        categories.add(item.category)

        if item.risk_level in ["HIGH", "CRITICAL"]:
            critical_regions.add(item.country)

        date = str(item.forecast_date)

        if date not in timeline:
            timeline[date] = {
                "date": date,
                "total_events": 0,
                "risk_levels": [],
                "categories": [],
            }

        timeline[date]["total_events"] += item.expected_events

        timeline[date]["risk_levels"].append(item.risk_level)

        timeline[date]["categories"].append(
            {
                "category": item.category,
                "region": item.region,
                "country": item.country,
                "events": item.expected_events,
                "confidence": item.confidence,
                "risk": item.risk_level,
            }
        )

    return {
        "generated_at": datetime.utcnow(),
        "summary": {
            "total_expected_events": total_events,
            "critical_regions": len(critical_regions),
            "categories": len(categories),
        },
        "timeline": list(timeline.values()),
    }


@router.get("/categories")
def forecast_categories(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    data = (
        db.query(Forecast.category, func.sum(Forecast.expected_events).label("events"))
        .filter(Forecast.active == True)
        .group_by(Forecast.category)
        .all()
    )

    total = sum(x.events for x in data)

    return [
        {
            "category": row.category,
            "expected_events": row.events,
            "percentage": round((row.events / total) * 100, 2) if total else 0,
        }
        for row in data
    ]


@router.get("/cat/caategoria")
def get_categories(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    categories = (
        db.query(EventCategory)
        .filter(EventCategory.active == True)
        .order_by(EventCategory.name)
        .all()
    )

    return [
        {
            "id": category.id,
            "name": category.name,
            "external_name": category.external_name,
            "description": category.description,
            "icon": category.icon,
        }
        for category in categories
    ]


@router.get("/map")
def forecast_map(db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    data = (
        db.query(
            Forecast.country,
            Forecast.region,
            func.sum(Forecast.expected_events).label("events"),
        )
        .filter(Forecast.active == True, Forecast.country != None)
        .group_by(Forecast.country, Forecast.region)
        .all()
    )

    if not data:
        return []

    max_events = max(item.events for item in data)

    result = []

    for item in data:
        events = item.events

        if events > 500:
            risk = "CRITICAL"

        elif events > 100:
            risk = "HIGH"

        elif events > 50:
            risk = "MEDIUM"

        else:
            risk = "LOW"

        intensity = round((events / max_events) * 100, 2)

        result.append(
            {
                "country": item.country,
                "region": item.region,
                "expected_events": events,
                "risk": risk,
                "intensity": intensity,
            }
        )

    return result


@router.post("/generate")
def create_forecast(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    result = generate_forecast(db, current_user)

    return {"message": "Forecast generated", "records": len(result)}
