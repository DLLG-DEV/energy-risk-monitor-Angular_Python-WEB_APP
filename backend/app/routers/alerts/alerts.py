from datetime import datetime

from app.core.dependencies import get_current_user
from app.database.database import get_db
from app.models.alarm import Alarm
from app.models.event import Event
from app.models.event_category import EventCategory
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import distinct
from sqlalchemy.orm import Session


class AlarmCreate(BaseModel):
    country: str | None = None

    category: str | None = None

    periodicity: str | None = None


class AlarmUpdate(BaseModel):
    country: str | None = None

    category: str | None = None

    active: bool | None = None


class AlarmResponse(BaseModel):
    id: int

    user_id: int

    country: str | None

    category: str | None

    active: bool

    created_at: datetime

    periodicity: str

    class Config:
        from_attributes = True


router = APIRouter(prefix="/api/alarms", tags=["Alarms"])


@router.post("", response_model=AlarmResponse)
def create_alarm(
    alarm: AlarmCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    new_alarm = Alarm(
        user_id=current_user.id,
        country=alarm.country,
        category=alarm.category,
        periodicity=alarm.periodicity,
    )

    db.add(new_alarm)

    db.commit()

    db.refresh(new_alarm)

    return new_alarm


@router.get("", response_model=list[AlarmResponse])
def get_my_alarms(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    alarms = (
        db.query(Alarm)
        .filter(
            Alarm.user_id == current_user.id,
        )
        .all()
    )

    return alarms


@router.get("/{alarm_id}", response_model=AlarmResponse)
def get_alarm(
    alarm_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    alarm = (
        db.query(Alarm)
        .filter(
            Alarm.id == alarm_id,
            Alarm.user_id == current_user.id,
            Alarm.is_deleted == False,
        )
        .first()
    )

    if not alarm:
        raise HTTPException(status_code=404, detail="Alarma no encontrada")

    return alarm


@router.put("/{alarm_id}", response_model=AlarmResponse)
def update_alarm(
    alarm_id: int,
    data: AlarmUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    alarm = (
        db.query(Alarm)
        .filter(
            Alarm.id == alarm_id,
            Alarm.user_id == current_user.id,
        )
        .first()
    )

    if not alarm:
        raise HTTPException(404, "Alarma no encontrada")

    if data.country is not None:
        alarm.country = data.country

    if data.category is not None:
        alarm.category = data.category

    if data.active is not None:
        alarm.active = data.active

    db.commit()

    db.refresh(alarm)

    return alarm


@router.delete("/{alarm_id}")
def delete_alarm(
    alarm_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    alarm = (
        db.query(Alarm)
        .filter(
            Alarm.id == alarm_id,
            Alarm.user_id == current_user.id,
            Alarm.is_deleted == False,
        )
        .first()
    )

    if not alarm:
        raise HTTPException(404, "Alarma no encontrada")

    alarm.is_deleted = True

    alarm.active = False

    db.commit()

    return {"message": "Alarma eliminada correctamente"}


@router.get("/countries/search")
def search_countries(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    countries = (
        db.query(distinct(Event.country))
        .filter(Event.country.ilike(f"%{q}%"))
        .filter(Event.country.isnot(None))
        .order_by(Event.country)
        .limit(10)
        .all()
    )

    return [country[0] for country in countries]


@router.get("/cat/categories")
def get_categories(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):

    categories = (
        db.query(EventCategory.name)
        .filter(EventCategory.active == True)
        .order_by(EventCategory.name)
        .all()
    )

    return [category[0].replace("_", " ") for category in categories]
