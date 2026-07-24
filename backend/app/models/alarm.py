from datetime import datetime

from app.database.database import Base
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Alarm(Base):
    __tablename__ = "alarms"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    country = Column(String(100), nullable=True)

    category = Column(String(100), nullable=True)

    active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    is_deleted = Column(Boolean, default=False)

    periodicity = Column(
        String(20),
    )

    # relaciones

    user = relationship("User", back_populates="alarms")

    notifications = relationship("Notification", back_populates="alarm")
