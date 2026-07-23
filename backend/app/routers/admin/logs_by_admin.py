from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, require_admin
from app.database.database import get_db
from app.models.logs import AuditLog


router = APIRouter(
    prefix="/api/admin",
    tags=["Logs by Admin"]
)

@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    logs = (
        db.query(AuditLog)
        .order_by(
            AuditLog.created_at.desc()
        )
        .all()
    )
    return logs

@router.get("/system-updates")
def get_system_updates(
    db:Session = Depends(get_db),
    current_user = Depends(require_admin)
):


    # Última actualización eventos NASA

    events_log = (
        db.query(AuditLog)
        .filter(
            AuditLog.entity=="EVENTS"
        )
        .order_by(
            AuditLog.created_at.desc()
        )
        .first()
    )



    # Último forecast generado

    forecast_log = (
        db.query(AuditLog)
        .filter(
            AuditLog.entity=="FORECAST"
        )
        .order_by(
            AuditLog.created_at.desc()
        )
        .first()
    )



    return {


        "events_update":{

            "username": events_log.username if events_log else None,

            "date": events_log.created_at if events_log else None,

            "description": events_log.description if events_log else None,

            "imported":
                events_log.new_data.get("imported")
                if events_log and events_log.new_data
                else 0,


            "skipped":
                events_log.new_data.get("skipped")
                if events_log and events_log.new_data
                else 0

        },


        "forecast_update":{


            "username": forecast_log.username if forecast_log else None,


            "date": forecast_log.created_at if forecast_log else None,


            "description": forecast_log.description if forecast_log else None,


            "model":
                forecast_log.new_data.get("model")
                if forecast_log and forecast_log.new_data
                else None,


            "records_generated":
                forecast_log.new_data.get("records_generated")
                if forecast_log and forecast_log.new_data
                else 0

        }

    }
    
def create_log(
    db:Session,
    user,
    action:str,
    entity:str,
    description:str,
    entity_id=None,
    old_data=None,
    new_data=None,
    ip=None
):

    log = AuditLog(
        user_id=user.id,
        username=f"{user.first_name} {user.last_name}",
        user_role=user.role.name,
        action=action,
        entity=entity,
        entity_id=entity_id,
        description=description,
        old_data=old_data,
        new_data=new_data,
        ip_address=ip
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log