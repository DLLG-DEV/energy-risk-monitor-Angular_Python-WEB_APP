from datetime import datetime

from app.database.database import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, UniqueConstraint


class UserAlertCategory(Base):
    __tablename__ = "user_alert_categories"

    id = Column(Integer, primary_key=True, index=True)

    alert_id = Column(
        Integer, ForeignKey("user_alerts.id", ondelete="CASCADE"), nullable=False
    )

    category_id = Column(
        Integer, ForeignKey("event_categories.id", ondelete="CASCADE"), nullable=False
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("alert_id", "category_id", name="uq_alert_category"),
    )
