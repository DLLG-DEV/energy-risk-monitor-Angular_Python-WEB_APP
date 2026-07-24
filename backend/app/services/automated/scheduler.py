import logging
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.services.automated.import_service import import_daily_events
from app.services.automated.trining_forecast import train_forecast

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def run_daily_pipeline(
    db: Session
):
    import_result = import_daily_events(
        db=db,
        current_user=None
    )
    forecast_result = train_forecast(
        db=db,
        current_user=None
    )

    return {
        "status": "OK",
        "message": "Daily pipeline completed successfully.",
        "data": {
            "import": import_result,
            "forecast": forecast_result
        }
    }

def daily_job():
    db = SessionLocal()

    try:
        logger.info(
            "Starting daily pipeline..."
        )

        result = run_daily_pipeline(
            db
        )

        logger.info(
            "Daily pipeline completed: %s",
            result
        )

    except Exception as e:

        db.rollback()
        logger.exception(
            "Daily pipeline failed."
        )

    finally:
        db.close()

scheduler.add_job(
    daily_job,
    trigger="cron",
    hour=1,
    minute=00,
    id="daily_pipeline",
    replace_existing=True
)