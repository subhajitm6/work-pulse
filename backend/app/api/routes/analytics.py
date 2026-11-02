from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Task, Project, DailyLog, Activity, Workspace
from app.schemas.schemas import ActivityOut
from app.api.deps import get_current_workspace

router = APIRouter(tags=["dashboard-analytics"])


@router.get("/dashboard/summary")
def get_dashboard_summary(
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    tasks = db.query(Task).filter(Task.workspace_id == workspace.id).all()
    active_tasks = [t for t in tasks if t.status != "Done"]
    
    # Last 7 days completed
    today = datetime.now()
    seven_days_ago_str = (today - timedelta(days=7)).strftime("%Y-%m-%d")
    today_str = today.strftime("%Y-%m-%d")

    completed_7d = [
        t for t in tasks 
        if t.status == "Done" and t.completed_at and t.completed_at >= seven_days_ago_str
    ]

    # Overdue tasks
    overdue = [
        t for t in tasks 
        if t.status != "Done" and t.due_date and t.due_date < today_str
    ]

    total_relevant = len(completed_7d) + len(active_tasks)
    rate = round((len(completed_7d) / total_relevant) * 100) if total_relevant > 0 else 0

    return {
        "activeTasksCount": len(active_tasks),
        "completedThisWeekCount": len(completed_7d),
        "overdueCount": len(overdue),
        "weeklyCompletionRate": rate,
    }


@router.get("/analytics/summary")
def get_analytics_summary(
    days: int = Query(30),
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    tasks = db.query(Task).filter(Task.workspace_id == workspace.id).all()
    cutoff_str = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    # Filter tasks in scope
    relevant = [
        t for t in tasks 
        if (t.completed_at and t.completed_at >= cutoff_str) or (t.due_date and t.due_date >= cutoff_str)
    ]
    if not relevant:
        relevant = tasks

    completed = [t for t in relevant if t.status == "Done"]
    total = len(relevant)

    completion_rate = round((len(completed) / total) * 100) if total > 0 else None

    # On-time rate
    completed_with_due = [t for t in completed if t.due_date]
    on_time = [
        t for t in completed_with_due 
        if not t.completed_at or t.completed_at <= t.due_date
    ]
    on_time_rate = round((len(on_time) / len(completed_with_due)) * 100) if completed_with_due else None

    # Avg duration
    with_duration = [t for t in completed if t.actual_minutes and t.actual_minutes > 0]
    avg_minutes = (
        round(sum(t.actual_minutes for t in with_duration) / len(with_duration))
        if with_duration
        else None
    )

    return {
        "tasksCompleted": len(completed),
        "completionRate": completion_rate if completion_rate is not None else "—",
        "onTimeRate": on_time_rate if on_time_rate is not None else "—",
        "avgCompletionMinutes": avg_minutes if avg_minutes is not None else "—",
        "totalTasks": total,
    }


@router.get("/activities", response_model=List[ActivityOut])
def list_activities(
    limit: int = Query(25),
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    activities = (
        db.query(Activity)
        .filter(Activity.workspace_id == workspace.id)
        .order_by(Activity.timestamp.desc())
        .limit(limit)
        .all()
    )
    return activities


@router.delete("/activities", status_code=204)
def clear_activities(
    workspace: Workspace = Depends(get_current_workspace),
    db: Session = Depends(get_db),
):
    db.query(Activity).filter(Activity.workspace_id == workspace.id).delete()
    db.commit()
    return None

