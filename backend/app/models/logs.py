from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    JSON,
    func
)

from app.database.database import Base

class AuditLog(Base):

    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    username = Column(
        String(150),
        nullable=False
    )

    user_role = Column(
        String(50),
        nullable=False
    )

    action = Column(
        String(100),
        nullable=False
    )

    entity = Column(
        String(100),
        nullable=True
    )

    entity_id = Column(
        Integer,
        nullable=True
    )

    description = Column(
        Text,
        nullable=False
    )

    old_data = Column(
        JSON,
        nullable=True
    )

    new_data = Column(
        JSON,
        nullable=True
    )

    ip_address = Column(
        String(50),
        nullable=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )