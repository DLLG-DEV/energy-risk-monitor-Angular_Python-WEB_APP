# services/import_service.py

from sqlalchemy.orm import Session
from app.services.nasa_service import (
    save_events,
    get_nasa_categories,
    convert_to_days,
    get_last_days_events
)



def import_daily_events(
    db: Session,
    current_user: str
):
    
    time = [1, "months"]    
    
    days = convert_to_days(
        time[0],
        time[1]
    )
    
    events = get_last_days_events(days)

    result = save_events(
        db=db,
        events=events,
        current_user = current_user
    )

    return result

