from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Text
)

from datetime import datetime

from app.database.database import Base


class EventCategory(Base):

    __tablename__="event_categories"


    id = Column(
        Integer,
        primary_key=True
    )


    name = Column(
        String(100),
        nullable=False
    )


    external_name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text
    )


    active = Column(
        Boolean,
        default=True
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    icon = Column(
        Text,
    )