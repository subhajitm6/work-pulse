from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User, Workspace
from app.schemas.schemas import WorkspaceCreate, WorkspaceUpdate, WorkspaceOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("", response_model=List[WorkspaceOut])
def list_workspaces(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    workspaces = (
        db.query(Workspace)
        .filter(Workspace.owner_id == current_user.id)
        .order_by(Workspace.is_default.desc(), Workspace.created_at.asc())
        .all()
    )
    return workspaces


@router.post("", response_model=WorkspaceOut, status_code=status.HTTP_201_CREATED)
def create_workspace(
    ws_in: WorkspaceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trimmed = ws_in.name.strip()
    existing = (
        db.query(Workspace)
        .filter(Workspace.owner_id == current_user.id, Workspace.name.ilike(trimmed))
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail=f'A workspace named "{trimmed}" already exists.')

    new_ws = Workspace(
        name=trimmed,
        description=ws_in.description.strip() if ws_in.description else None,
        icon=ws_in.icon or "Briefcase",
        color=ws_in.color or "#5B5FEF",
        owner_id=current_user.id,
        is_default=False,
    )
    db.add(new_ws)
    db.commit()
    db.refresh(new_ws)
    return new_ws


@router.put("/{workspace_id}", response_model=WorkspaceOut)
def update_workspace(
    workspace_id: str,
    ws_in: WorkspaceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ws = (
        db.query(Workspace)
        .filter(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    if ws_in.name:
        trimmed = ws_in.name.strip()
        dup = (
            db.query(Workspace)
            .filter(
                Workspace.owner_id == current_user.id,
                Workspace.id != workspace_id,
                Workspace.name.ilike(trimmed),
            )
            .first()
        )
        if dup:
            raise HTTPException(status_code=400, detail=f'Another workspace named "{trimmed}" already exists.')
        ws.name = trimmed

    if ws_in.description is not None:
        ws.description = ws_in.description.strip() if ws_in.description else None
    if ws_in.icon:
        ws.icon = ws_in.icon
    if ws_in.color:
        ws.color = ws_in.color

    db.commit()
    db.refresh(ws)
    return ws


@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(
    workspace_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ws = (
        db.query(Workspace)
        .filter(Workspace.id == workspace_id, Workspace.owner_id == current_user.id)
        .first()
    )
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")

    if ws.is_default:
        raise HTTPException(status_code=400, detail='"My Workspace" is the default workspace and cannot be deleted.')

    total_count = db.query(Workspace).filter(Workspace.owner_id == current_user.id).count()
    if total_count <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the only remaining workspace.")

    db.delete(ws)
    db.commit()
    return None

