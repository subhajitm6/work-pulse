import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_unauthenticated_requests_blocked():
    """Step 7.1: Protected endpoints must reject unauthenticated requests."""
    routes = [
        ("GET", "/api/auth/me"),
        ("PATCH", "/api/auth/me"),
        ("GET", "/api/workspaces"),
        ("POST", "/api/workspaces"),
        ("GET", "/api/projects"),
        ("POST", "/api/projects"),
        ("GET", "/api/tasks"),
        ("POST", "/api/tasks"),
        ("GET", "/api/daily-logs"),
        ("POST", "/api/daily-logs"),
        ("GET", "/api/dashboard/summary"),
        ("GET", "/api/analytics/summary"),
    ]
    for method, route in routes:
        if method == "GET":
            response = client.get(route)
        else:
            response = client.post(route, json={})
        assert response.status_code == 401, f"{method} {route} should return 401 Unauthorized"

def test_health_check_open():
    """Health check endpoint should remain public."""
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

