from datetime import datetime

from app.database.database import Base
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String


class UserAlert(Base):
    __tablename__ = "user_alerts"

    id = Column(Integer, primary_key=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String(150))

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    country = Column(String(100))

    state = Column(String(100))

    radius_km = Column(Integer, default=100)

    min_risk_level = Column(String(20), default="LOW")

    frequency = Column(String(20), nullable=False)

    preferred_day = Column(Integer)

    last_sent_at = Column(DateTime)

    next_send_at = Column(DateTime)

    enabled = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
