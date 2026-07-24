# services/import_service.py

from app.services.nasa_service import (
    convert_to_days,
    get_last_days_events,
    save_events,
)
from sqlalchemy.orm import Session


def import_daily_events(db: Session, current_user: str):

    time = [3, "months"]

    days = convert_to_days(time[0], time[1])

    events = get_last_days_events(days)

    result = save_events(db=db, events=events, current_user=current_user)

    return result
