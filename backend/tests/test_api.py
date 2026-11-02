from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_auth_login():
    res = client.post("/api/auth/login", json={"email": "alex@workpulse.app", "password": "Password123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "alex@workpulse.app"


def test_workspaces_isolation():
    # Login
    login_res = client.post("/api/auth/login", json={"email": "alex@workpulse.app", "password": "Password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get workspaces
    ws_res = client.get("/api/workspaces", headers=headers)
    assert ws_res.status_code == 200
    workspaces = ws_res.json()
    assert len(workspaces) >= 1

    default_ws = next(w for w in workspaces if w["name"] == "My Workspace")
    headers["X-Workspace-Id"] = default_ws["id"]

    # Get tasks in default workspace
    tasks_res = client.get("/api/tasks", headers=headers)
    assert tasks_res.status_code == 200
    tasks = tasks_res.json()
    assert len(tasks) > 0


def test_create_and_delete_task():
    login_res = client.post("/api/auth/login", json={"email": "alex@workpulse.app", "password": "Password123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create task
    task_res = client.post("/api/tasks", json={"title": "Automated Test Task", "priority": "High"}, headers=headers)
    assert task_res.status_code == 201
    task_id = task_res.json()["id"]

    # Delete task
    del_res = client.delete(f"/api/tasks/{task_id}", headers=headers)
    assert del_res.status_code == 204

