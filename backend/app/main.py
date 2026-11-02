from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.db.session import engine, Base
from app.api.routes import auth, workspaces, tasks, projects, daily_logs, analytics
import logging

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger("workpulse")

# Create tables if not using migrations directly
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WorkPulse API",
    description="Full-stack FastAPI + PostgreSQL backend for WorkPulse productivity dashboard.",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes under /api
app.include_router(auth.router, prefix="/api")
app.include_router(workspaces.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(daily_logs.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")

# Also include routes without /api prefix for compatibility
app.include_router(auth.router)
app.include_router(workspaces.router)
app.include_router(tasks.router)
app.include_router(projects.router)
app.include_router(daily_logs.router)
app.include_router(analytics.router)


@app.get("/health")
def health():
    return {"status": "ok", "environment": settings.ENVIRONMENT, "database": "connected"}


@app.get("/")
def root():
    return {"message": "Welcome to WorkPulse API", "docs": "/docs", "health": "/health"}

