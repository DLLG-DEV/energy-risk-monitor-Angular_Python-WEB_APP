from app.database.database import Base
from sqlalchemy import Column, DateTime, Float, Integer, String


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)

    external_id = Column(String(100), nullable=False, unique=True, index=True)

    title = Column(String(255), nullable=False)

    category = Column(String(100), nullable=False, index=True)

    country = Column(String(100), nullable=True, index=True)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    event_date = Column(DateTime, nullable=True, index=True)
