from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Project, Task, Workspace, Activity
from app.schemas.schemas import ProjectCreate, ProjectUpdate, ProjectOut
from app.api.deps import get_current_workspace

router = APIRouter(prefix="/projects", tags=["projects"])


def to_project_out(p: Project) -> ProjectOut:
    return ProjectOut(
        id=p.id,
        workspace_id=p.workspace_id,
        name=p.name,
        description=p.description,
        status=p.status,
        start_date=p.start_date,
        deadline=p.deadline,
        color=p.color,
        created_at=p.created_at,
        # Frontend aliases
        startDate=p.start_date,
    )


@router.get("", response_model=List[ProjectOut])
def list_projects(
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    projects = (
        db.query(Project)
        .filter(Project.workspace_id == workspace.id)
        .order_by(Project.created_at.desc())
        .all()
    )
    return [to_project_out(p) for p in projects]


@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    new_proj = Project(
        workspace_id=workspace.id,
        name=project_in.name.strip(),
        description=project_in.description.strip() if project_in.description else None,
        status=project_in.status or "In Progress",
        start_date=project_in.start_date,
        deadline=project_in.deadline,
        color=project_in.color or "#5B5FEF",
    )
    db.add(new_proj)

    act = Activity(
        workspace_id=workspace.id,
        type="project_created",
        title=f'Created project "{new_proj.name}"',
        target=new_proj.id,
    )
    db.add(act)

    db.commit()
    db.refresh(new_proj)
    return to_project_out(new_proj)


@router.get("/{project_id}", response_model=ProjectOut)
def get_project(
    project_id: str,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.workspace_id == workspace.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    return to_project_out(project)


@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.workspace_id == workspace.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if project_in.name is not None:
        project.name = project_in.name.strip()
    if project_in.description is not None:
        project.description = project_in.description.strip() if project_in.description else None
    if project_in.status is not None:
        project.status = project_in.status
    if project_in.start_date is not None:
        project.start_date = project_in.start_date
    if project_in.deadline is not None:
        project.deadline = project_in.deadline
    if project_in.color is not None:
        project.color = project_in.color

    db.commit()
    db.refresh(project)
    return to_project_out(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.workspace_id == workspace.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    # Cascade delete all tasks belonging to this project
    db.query(Task).filter(Task.project_id == project_id, Task.workspace_id == workspace.id).delete()
    db.delete(project)
    db.commit()
    return None

