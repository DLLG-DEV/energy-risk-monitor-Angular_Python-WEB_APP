from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from datetime import datetime

from app.database.database import Base



class AlertNotification(Base):

    __tablename__ = "alert_notifications"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    alert_id = Column(
        Integer,
        ForeignKey(
            "user_alerts.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )


    category_id = Column(
        Integer,
        ForeignKey(
            "event_categories.id"
        ),
        nullable=True
    )


    message = Column(
        Text,
        nullable=False
    )


    risk_level = Column(
        String(20),
        nullable=True
    )


    forecast_id = Column(
        Integer,
        nullable=True
    )


    sent_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    status = Column(
        String(20),
        default="SENT"
    )


    error_message = Column(
        Text,
        nullable=True
    )