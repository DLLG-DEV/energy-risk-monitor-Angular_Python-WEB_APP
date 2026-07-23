from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Date,
    Boolean,
    JSON
)
from datetime import datetime
from app.database.database import Base

class Forecast(Base):
    __tablename__ = "forecast"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # Fecha del periodo que se está prediciendo
    forecast_date = Column(
        Date,
        nullable=False,
        index=True
    )

    # Categoría EONET
    # FIRE, FLOOD, STORM, VOLCANO...
    category = Column(
        String(100),
        nullable=False,
        index=True
    )

    # Nivel geográfico
    # Asia, Europe, North America...
    region = Column(
        String(100),
        nullable=False,
        index=True
    )

    # País específico si queremos granularidad mayor
    country = Column(
        String(100),
        nullable=True,
        index=True
    )

    # Cantidad esperada de eventos
    expected_events = Column(
        Integer,
        nullable=False
    )

    # Probabilidad del modelo
    # 0.0 - 1.0
    confidence = Column(
        Float,
        nullable=False
    )

    # Riesgo calculado
    # LOW
    # MEDIUM
    # HIGH
    # CRITICAL
    risk_level = Column(
        String(20),
        nullable=False,
        index=True
    )

    # Rango inferior de predicción
    lower_bound = Column(
        Float,
        nullable=True
    )

    # Rango superior de predicción
    upper_bound = Column(
        Float,
        nullable=True
    )

    # Modelo utilizado
    # Prophet_v1
    # XGBoost_v2
    model_version = Column(
        String(50),
        nullable=False
    )

    # Información adicional
    extra_data = Column(
        JSON,
        nullable=True
    )
    
    # Cuando se generó el forecast
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )
    
    active = Column(
        Boolean,
        default=True,
        index=True
    )