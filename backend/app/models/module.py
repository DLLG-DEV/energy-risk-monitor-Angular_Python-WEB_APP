from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base


class Module(Base):

    __tablename__ = "modules"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String(100),
        nullable=False,
        unique=True
    )


    route = Column(
        String(150),
        nullable=False
    )


    icon = Column(
        String(100),
        nullable=False
    )


    description = Column(
        Text,
        nullable=True
    )