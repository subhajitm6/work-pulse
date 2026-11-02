from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime


# ================= USER SCHEMAS =================
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: Optional[str] = "Product Engineer"
    avatar: Optional[str] = None


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    avatar: Optional[str] = None


class UserOut(UserBase):
    id: str
    is_email_verified: bool
    workspace: Optional[str] = "My Workspace"
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ================= WORKSPACE SCHEMAS =================
class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "Briefcase"
    color: Optional[str] = "#5B5FEF"


class WorkspaceCreate(WorkspaceBase):
    pass


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None


class WorkspaceOut(WorkspaceBase):
    id: str
    owner_id: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ================= PROJECT SCHEMAS =================
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: Optional[str] = "In Progress"
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    color: Optional[str] = "#5B5FEF"


class ProjectCreate(ProjectBase):
    workspace_id: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_date: Optional[str] = None
    deadline: Optional[str] = None
    color: Optional[str] = None


class ProjectOut(ProjectBase):
    id: str
    workspace_id: str
    created_at: datetime
    # Frontend camelCase compatibility
    startDate: Optional[str] = None
    deadline: Optional[str] = None

    class Config:
        from_attributes = True


# ================= TASK SCHEMAS =================
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[str] = None
    status: Optional[str] = "To Do"
    priority: Optional[str] = "Medium"
    due_date: Optional[str] = None
    completed_at: Optional[str] = None
    estimated_minutes: Optional[int] = 0
    actual_minutes: Optional[int] = 0
    tags: Optional[List[str]] = []


class TaskCreate(TaskBase):
    workspace_id: Optional[str] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    completed_at: Optional[str] = None
    estimated_minutes: Optional[int] = None
    actual_minutes: Optional[int] = None
    tags: Optional[List[str]] = None


class TaskOut(TaskBase):
    id: str
    workspace_id: str
    created_at: datetime
    # Frontend camelCase aliases
    projectId: Optional[str] = None
    dueDate: Optional[str] = None
    completedAt: Optional[str] = None
    estimatedMinutes: Optional[int] = 0
    actualMinutes: Optional[int] = 0

    class Config:
        from_attributes = True


# ================= DAILY LOG SCHEMAS =================
class DailyLogBase(BaseModel):
    date: str
    summary: Optional[str] = None
    worked_on: Optional[str] = None
    accomplishments: Optional[str] = None
    blockers: Optional[str] = None
    notes_for_tomorrow: Optional[str] = None
    total_minutes: Optional[int] = 0


class DailyLogCreate(DailyLogBase):
    workspace_id: Optional[str] = None
    task_ids: Optional[List[str]] = []


class DailyLogUpdate(BaseModel):
    summary: Optional[str] = None
    worked_on: Optional[str] = None
    accomplishments: Optional[str] = None
    blockers: Optional[str] = None
    notes_for_tomorrow: Optional[str] = None
    total_minutes: Optional[int] = None
    task_ids: Optional[List[str]] = None


class DailyLogOut(DailyLogBase):
    id: str
    workspace_id: str
    task_ids: List[str] = []
    # camelCase aliases
    workedOn: Optional[str] = None
    notesForTomorrow: Optional[str] = None
    totalMinutes: Optional[int] = 0
    taskIds: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True


# ================= ACTIVITY SCHEMAS =================
class ActivityOut(BaseModel):
    id: str
    workspace_id: str
    type: str
    title: str
    target: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

