from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_token
from app.models.models import User, Workspace

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def get_current_workspace(
    x_workspace_id: Optional[str] = Header(None, alias="X-Workspace-Id"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Workspace:
    # If provided via header, verify user ownership
    if x_workspace_id:
        ws = (
            db.query(Workspace)
            .filter(Workspace.id == x_workspace_id, Workspace.owner_id == current_user.id)
            .first()
        )
        if ws:
            return ws

    # Otherwise return default workspace or first available workspace
    ws = (
        db.query(Workspace)
        .filter(Workspace.owner_id == current_user.id)
        .order_by(Workspace.is_default.desc(), Workspace.created_at.asc())
        .first()
    )

    if not ws:
        # Create default workspace if none exists
        ws = Workspace(
            name="My Workspace",
            description="Main product engineering and personal productivity space",
            icon="Briefcase",
            color="#5B5FEF",
            owner_id=current_user.id,
            is_default=True,
        )
        db.add(ws)
        db.commit()
        db.refresh(ws)

    return ws

