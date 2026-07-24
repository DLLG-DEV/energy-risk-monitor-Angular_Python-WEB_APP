from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services.forecast_service import generate_forecast


def train_forecast(
    db: Session,
    current_user=None
):

    try:

        result = generate_forecast(
            db,
            current_user
        )

        return {
            "status": "OK",
            "message": "Forecast generated successfully.",
            "data": {
                "records": len(result)
            }
        }

    except Exception as e:

        db.rollback()
        
        raise HTTPException(
            status_code=500,
            detail={
                "status": "ERROR",
                "message": "Error generating forecast.",
                "error": str(e)
            }
        )