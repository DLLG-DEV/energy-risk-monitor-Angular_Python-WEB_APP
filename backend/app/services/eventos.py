from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

from app.models.event import Event


def get_events(
    db,
    page: int,
    size: int,
    category: str | None,
    country: str | None,
    search: str | None
):

    try:

        query = db.query(Event)

        if category:

            query = query.filter(
                Event.category == category
            )

        if country:

            query = query.filter(
                Event.country == country
            )

        if search:

            query = query.filter(

                or_(

                    Event.title.ilike(f"%{search}%"),

                    Event.country.ilike(f"%{search}%")

                )

            )

        total = query.count()

        if total == 0:

            raise HTTPException(

                status_code=404,

                detail="No events found."

            )

        events = (

            query

            .order_by(Event.event_date.desc())

            .offset((page - 1) * size)

            .limit(size)

            .all()

        )

        return {

            "status": "success",

            "total": total,

            "page": page,

            "size": size,

            "data": events

        }

    except HTTPException:

        raise

    except SQLAlchemyError:

        raise HTTPException(

            status_code=500,

            detail="Database error while retrieving events."

        )

    except Exception:

        raise HTTPException(

            status_code=500,

            detail="Unexpected server error."

        )