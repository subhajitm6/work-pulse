import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Integer,
    DateTime,
    ForeignKey,
    Text,
    Table,
    JSON,
)
from sqlalchemy.orm import relationship
from app.db.session import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# Association table for DailyLog <-> Task many-to-many relationship
log_task_association = Table(
    "log_tasks",
    Base.metadata,
    Column("log_id", String(36), ForeignKey("daily_logs.id", ondelete="CASCADE"), primary_key=True),
    Column("task_id", String(36), ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(100), default="Product Engineer")
    avatar = Column(Text, nullable=True, default="/avatars/avatar-1.svg")
    is_email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    workspaces = relationship("Workspace", back_populates="owner", cascade="all, delete-orphan")


class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), default="Briefcase")
    color = Column(String(50), default="#5B5FEF")
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    owner = relationship("User", back_populates="workspaces")
    projects = relationship("Project", back_populates="workspace", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="workspace", cascade="all, delete-orphan")
    daily_logs = relationship("DailyLog", back_populates="workspace", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="workspace", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="In Progress")  # Planning, In Progress, On Hold, Completed
    start_date = Column(String(20), nullable=True)      # YYYY-MM-DD
    deadline = Column(String(20), nullable=True)        # YYYY-MM-DD
    color = Column(String(50), default="#5B5FEF")
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    workspace = relationship("Workspace", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="To Do")       # To Do, In Progress, Done
    priority = Column(String(50), default="Medium")    # Low, Medium, High, Urgent
    due_date = Column(String(20), nullable=True)       # YYYY-MM-DD
    completed_at = Column(String(20), nullable=True)   # YYYY-MM-DD
    estimated_minutes = Column(Integer, default=0)
    actual_minutes = Column(Integer, default=0)
    tags = Column(JSON, default=list)                  # Array of string tags
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    workspace = relationship("Workspace", back_populates="tasks")
    project = relationship("Project", back_populates="tasks")
    daily_logs = relationship("DailyLog", secondary=log_task_association, back_populates="tasks")


class DailyLog(Base):
    __tablename__ = "daily_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String(20), nullable=False, index=True) # YYYY-MM-DD
    summary = Column(Text, nullable=True)
    worked_on = Column(Text, nullable=True)
    accomplishments = Column(Text, nullable=True)
    blockers = Column(Text, nullable=True)
    notes_for_tomorrow = Column(Text, nullable=True)
    total_minutes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    workspace = relationship("Workspace", back_populates="daily_logs")
    tasks = relationship("Task", secondary=log_task_association, back_populates="daily_logs")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    title = Column(String(500), nullable=False)
    target = Column(String(255), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utc_now)

    workspace = relationship("Workspace", back_populates="activities")

