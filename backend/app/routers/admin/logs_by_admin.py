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