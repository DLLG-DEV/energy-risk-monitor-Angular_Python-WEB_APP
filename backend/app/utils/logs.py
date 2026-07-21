from app.models.logs import AuditLog

def create_log(
    db,
    user,
    action: str,
    entity: str,
    description: str,
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