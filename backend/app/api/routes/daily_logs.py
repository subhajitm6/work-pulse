from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import DailyLog, Task, Workspace, Activity
from app.schemas.schemas import DailyLogCreate, DailyLogUpdate, DailyLogOut
from app.api.deps import get_current_workspace

router = APIRouter(prefix="/daily-logs", tags=["daily-logs"])


def to_daily_log_out(log: DailyLog) -> DailyLogOut:
    task_ids = [t.id for t in log.tasks] if log.tasks else []
    return DailyLogOut(
        id=log.id,
        workspace_id=log.workspace_id,
        date=log.date,
        summary=log.summary,
        worked_on=log.worked_on,
        accomplishments=log.accomplishments,
        blockers=log.blockers,
        notes_for_tomorrow=log.notes_for_tomorrow,
        total_minutes=log.total_minutes or 0,
        task_ids=task_ids,
        created_at=log.created_at,
        # Frontend camelCase aliases
        workedOn=log.worked_on,
        notesForTomorrow=log.notes_for_tomorrow,
        totalMinutes=log.total_minutes or 0,
        taskIds=task_ids,
    )


@router.get("", response_model=List[DailyLogOut])
def list_daily_logs(
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(DailyLog)
        .filter(DailyLog.workspace_id == workspace.id)
        .order_by(DailyLog.date.desc())
        .all()
    )
    return [to_daily_log_out(l) for l in logs]


@router.post("", response_model=DailyLogOut, status_code=status.HTTP_201_CREATED)
def create_daily_log(
    log_in: DailyLogCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    new_log = DailyLog(
        workspace_id=workspace.id,
        date=log_in.date,
        summary=log_in.summary.strip() if log_in.summary else None,
        worked_on=log_in.worked_on.strip() if log_in.worked_on else None,
        accomplishments=log_in.accomplishments.strip() if log_in.accomplishments else None,
        blockers=log_in.blockers.strip() if log_in.blockers else None,
        notes_for_tomorrow=log_in.notes_for_tomorrow.strip() if log_in.notes_for_tomorrow else None,
        total_minutes=log_in.total_minutes or 0,
    )

    if log_in.task_ids:
        tasks = (
            db.query(Task)
            .filter(Task.id.in_(log_in.task_ids), Task.workspace_id == workspace.id)
            .all()
        )
        new_log.tasks = tasks

    db.add(new_log)

    act = Activity(
        workspace_id=workspace.id,
        type="log_added",
        title=f"Submitted Daily Log for {new_log.date}",
        target=new_log.id,
    )
    db.add(act)

    db.commit()
    db.refresh(new_log)
    return to_daily_log_out(new_log)


@router.put("/{log_id}", response_model=DailyLogOut)
def update_daily_log(
    log_id: str,
    log_in: DailyLogUpdate,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    log = db.query(DailyLog).filter(DailyLog.id == log_id, DailyLog.workspace_id == workspace.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Daily log not found.")

    if log_in.summary is not None:
        log.summary = log_in.summary.strip() if log_in.summary else None
    if log_in.worked_on is not None:
        log.worked_on = log_in.worked_on.strip() if log_in.worked_on else None
    if log_in.accomplishments is not None:
        log.accomplishments = log_in.accomplishments.strip() if log_in.accomplishments else None
    if log_in.blockers is not None:
        log.blockers = log_in.blockers.strip() if log_in.blockers else None
    if log_in.notes_for_tomorrow is not None:
        log.notes_for_tomorrow = log_in.notes_for_tomorrow.strip() if log_in.notes_for_tomorrow else None
    if log_in.total_minutes is not None:
        log.total_minutes = log_in.total_minutes

    if log_in.task_ids is not None:
        tasks = (
            db.query(Task)
            .filter(Task.id.in_(log_in.task_ids), Task.workspace_id == workspace.id)
            .all()
        )
        log.tasks = tasks

    db.commit()
    db.refresh(log)
    return to_daily_log_out(log)


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_daily_log(
    log_id: str,
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    log = db.query(DailyLog).filter(DailyLog.id == log_id, DailyLog.workspace_id == workspace.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Daily log not found.")

    db.delete(log)
    db.commit()
    return None

