from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database.database import Base


class Notification(Base):

    __tablename__ = "notifications"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    alarm_id = Column(
        Integer,
        ForeignKey(
            "alarms.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )


    forecast_id = Column(
        Integer,
        ForeignKey(
            "forecast.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )


    email = Column(
        String(255),
        nullable=False
    )


    status = Column(
        String(50),
        default="PENDING"
    )


    sent_at = Column(
        DateTime,
        nullable=True
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    # relaciones


    alarm = relationship(
        "Alarm",
        back_populates="notifications"
    )


    forecast = relationship(
        "Forecast",
        back_populates="notifications"
    )