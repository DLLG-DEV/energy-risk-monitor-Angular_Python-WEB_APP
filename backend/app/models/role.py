from app.database.database import Base
from sqlalchemy import JSON, Column, Integer, String
from sqlalchemy.orm import relationship


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(50), nullable=False, unique=True)

    modules = Column(JSON, nullable=False)

    users = relationship("User", back_populates="role")
