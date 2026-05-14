from sqlalchemy.orm import Session
import models


def get_accessible_camera_ids(user: models.User, db: Session) -> list[int]:
    """Returns camera IDs where the user has can_view=True.
    Admins get all cameras. Viewers get only explicitly permitted ones."""
    if user.role == "admin":
        rows = db.query(models.Camera.id).all()
        return [row.id for row in rows]
    perms = (
        db.query(models.CameraPermission)
        .filter(
            models.CameraPermission.user_id == user.id,
            models.CameraPermission.can_view == True,
        )
        .all()
    )
    return [p.camera_id for p in perms]


def get_accessible_camera_ids_for_replay(user: models.User, db: Session) -> list[int]:
    """Returns camera IDs where the user has can_replay=True.
    Admins get all cameras."""
    if user.role == "admin":
        rows = db.query(models.Camera.id).all()
        return [row.id for row in rows]
    perms = (
        db.query(models.CameraPermission)
        .filter(
            models.CameraPermission.user_id == user.id,
            models.CameraPermission.can_replay == True,
        )
        .all()
    )
    return [p.camera_id for p in perms]


def get_accessible_cameras(
    user: models.User, db: Session, skip: int = 0, limit: int = 100
) -> list[models.Camera]:
    """Returns Camera objects the user can access, with pagination."""
    if user.role == "admin":
        return db.query(models.Camera).offset(skip).limit(limit).all()
    camera_ids = get_accessible_camera_ids(user, db)
    if not camera_ids:
        return []
    return (
        db.query(models.Camera)
        .filter(models.Camera.id.in_(camera_ids))
        .offset(skip)
        .limit(limit)
        .all()
    )


def user_can_access_camera(user: models.User, camera_id: int, db: Session) -> bool:
    """Returns True if the user is admin or has can_view=True for this camera."""
    if user.role == "admin":
        return True
    perm = (
        db.query(models.CameraPermission)
        .filter(
            models.CameraPermission.user_id == user.id,
            models.CameraPermission.camera_id == camera_id,
        )
        .first()
    )
    return perm is not None and perm.can_view


def user_can_replay_camera(user: models.User, camera_id: int, db: Session) -> bool:
    """Returns True if the user is admin or has can_replay=True for this camera."""
    if user.role == "admin":
        return True
    perm = (
        db.query(models.CameraPermission)
        .filter(
            models.CameraPermission.user_id == user.id,
            models.CameraPermission.camera_id == camera_id,
        )
        .first()
    )
    return perm is not None and perm.can_replay


def user_can_control_camera(user: models.User, camera_id: int, db: Session) -> bool:
    """Returns True if the user is admin or has can_control=True for this camera."""
    if user.role == "admin":
        return True
    perm = (
        db.query(models.CameraPermission)
        .filter(
            models.CameraPermission.user_id == user.id,
            models.CameraPermission.camera_id == camera_id,
        )
        .first()
    )
    return perm is not None and perm.can_control
