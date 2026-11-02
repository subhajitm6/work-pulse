from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Task, Workspace, Project, Activity
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskOut
from app.api.deps import get_current_user, get_current_workspace

router = APIRouter(prefix="/tasks", tags=["tasks"])


def to_task_out(t: Task) -> TaskOut:
    return TaskOut(
        id=t.id,
        workspace_id=t.workspace_id,
        title=t.title,
        description=t.description,
        project_id=t.project_id,
        status=t.status,
        priority=t.priority,
        due_date=t.due_date,
        completed_at=t.completed_at,
        estimated_minutes=t.estimated_minutes or 0,
        actual_minutes=t.actual_minutes or 0,
        tags=t.tags or [],
        created_at=t.created_at,
        # Frontend aliases
        projectId=t.project_id,
        dueDate=t.due_date,
        completedAt=t.completed_at,
        estimatedMinutes=t.estimated_minutes or 0,
        actualMinutes=t.actual_minutes or 0,
    )


@router.get("", response_model=List[TaskOut])
def list_tasks(
    project_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    query = db.query(Task).filter(Task.workspace_id == workspace.id)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)

    tasks = query.order_by(Task.created_at.desc()).all()
    return [to_task_out(t) for t in tasks]


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    # Validate project belongs to workspace if provided
    if task_in.project_id:
        proj = db.query(Project).filter(Project.id == task_in.project_id, Project.workspace_id == workspace.id).first()
        if not proj:
            task_in.project_id = None

    completed_at = task_in.completed_at
    if task_in.status == "Done" and not completed_at:
        completed_at = datetime.now().strftime("%Y-%m-%d")

    new_task = Task(
        workspace_id=workspace.id,
        title=task_in.title.strip(),
        description=task_in.description.strip() if task_in.description else None,
        project_id=task_in.project_id,
        status=task_in.status or "To Do",
        priority=task_in.priority or "Medium",
        due_date=task_in.due_date,
        completed_at=completed_at,
        estimated_minutes=task_in.estimated_minutes or 0,
        actual_minutes=task_in.actual_minutes or 0,
        tags=task_in.tags or [],
    )
    db.add(new_task)

    # Activity log
    act = Activity(
        workspace_id=workspace.id,
        type="task_created",
        title=f'Created task "{new_task.title}"',
        target=new_task.id,
    )
    db.add(act)

    db.commit()
    db.refresh(new_task)
    return to_task_out(new_task)


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    task_in: TaskUpdate,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id, Task.workspace_id == workspace.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this workspace.")

    if task_in.title is not None:
        task.title = task_in.title.strip()
    if task_in.description is not None:
        task.description = task_in.description.strip() if task_in.description else None
    if task_in.project_id is not None:
        task.project_id = task_in.project_id or None
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.due_date is not None:
        task.due_date = task_in.due_date
    if task_in.estimated_minutes is not None:
        task.estimated_minutes = task_in.estimated_minutes
    if task_in.actual_minutes is not None:
        task.actual_minutes = task_in.actual_minutes
    if task_in.tags is not None:
        task.tags = task_in.tags

    # Status & completion timestamps
    status_changed = False
    if task_in.status is not None:
        was_done = task.status == "Done"
        now_done = task_in.status == "Done"
        if task.status != task_in.status:
            status_changed = True
        task.status = task_in.status

        if now_done and not was_done:
            task.completed_at = datetime.now().strftime("%Y-%m-%d")
            act = Activity(
                workspace_id=workspace.id,
                type="task_completed",
                title=f'Completed "{task.title}"',
                target=task.id,
            )
            db.add(act)
        elif not now_done and was_done:
            task.completed_at = None

    # Activity log for general modifications / updates when not marking complete
    if not (task_in.status == "Done" and was_done is False):
        act = Activity(
            workspace_id=workspace.id,
            type="task_updated",
            title=f'Updated task "{task.title}"',
            target=task.id,
        )
        db.add(act)

    db.commit()
    db.refresh(task)
    return to_task_out(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    task = db.query(Task).filter(Task.id == task_id, Task.workspace_id == workspace.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found in this workspace.")

    db.delete(task)
    db.commit()
    return None

