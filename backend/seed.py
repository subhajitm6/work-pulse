import sys
from datetime import datetime, timedelta
from app.db.session import SessionLocal, engine, Base
from app.core.security import hash_password
from app.models.models import (
    User,
    Workspace,
    Project,
    Task,
    DailyLog,
    Activity,
)

# Ensure schema exists
Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.email == "alex@workpulse.app").first()
        if not demo_user:
            demo_user = User(
                email="alex@workpulse.app",
                name="Alex Vance",
                hashed_password=hash_password("Password123"),
                role="Product Engineer",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                is_email_verified=True,
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            print("Created demo user alex@workpulse.app")

        # Check default workspace
        my_ws = db.query(Workspace).filter(Workspace.owner_id == demo_user.id, Workspace.name == "My Workspace").first()
        if not my_ws:
            my_ws = Workspace(
                name="My Workspace",
                description="Main product engineering and personal productivity space",
                icon="Briefcase",
                color="#5B5FEF",
                owner_id=demo_user.id,
                is_default=True,
            )
            db.add(my_ws)

        # Check second workspace (Freelance)
        freelance_ws = db.query(Workspace).filter(Workspace.owner_id == demo_user.id, Workspace.name == "Freelance & Clients").first()
        if not freelance_ws:
            freelance_ws = Workspace(
                name="Freelance & Clients",
                description="Contract deliverables, client milestones, and invoicing tasks",
                icon="FolderKanban",
                color="#10B981",
                owner_id=demo_user.id,
                is_default=False,
            )
            db.add(freelance_ws)

        db.commit()
        db.refresh(my_ws)
        db.refresh(freelance_ws)

        today = datetime.now()
        def days_ago(d): return (today - timedelta(days=d)).strftime("%Y-%m-%d")
        def days_from_now(d): return (today + timedelta(days=d)).strftime("%Y-%m-%d")

        # Seed Projects if empty
        if db.query(Project).filter(Project.workspace_id == my_ws.id).count() == 0:
            proj1 = Project(
                id="proj-1",
                workspace_id=my_ws.id,
                name="Website Redesign",
                description="Revamp marketing pages with high-converting layouts and sleek dark theme.",
                status="In Progress",
                start_date=days_ago(18),
                deadline=days_from_now(12),
                color="#5B5FEF",
            )
            proj2 = Project(
                id="proj-2",
                workspace_id=my_ws.id,
                name="Mobile App Launch",
                description="Prepare iOS & Android build submissions and store assets.",
                status="In Progress",
                start_date=days_ago(25),
                deadline=days_from_now(5),
                color="#10B981",
            )
            proj3 = Project(
                id="proj-3",
                workspace_id=my_ws.id,
                name="API Integration",
                description="Integrate payment gateways and webhook processing pipeline.",
                status="Planning",
                start_date=days_ago(4),
                deadline=days_from_now(20),
                color="#F59E0B",
            )
            proj4 = Project(
                id="proj-4",
                workspace_id=my_ws.id,
                name="Design System 2.0",
                description="Standardize Figma components, tokens, and React component library.",
                status="Completed",
                start_date=days_ago(45),
                deadline=days_ago(2),
                color="#8B5CF6",
            )
            proj5 = Project(
                id="proj-5",
                workspace_id=my_ws.id,
                name="Portfolio Improvements",
                description="Add interactive case studies, benchmarks, and customer testimonials.",
                status="On Hold",
                start_date=days_ago(30),
                deadline=days_from_now(30),
                color="#EC4899",
            )
            db.add_all([proj1, proj2, proj3, proj4, proj5])
            db.commit()

            # Seed Tasks
            task1 = Task(
                id="task-1",
                workspace_id=my_ws.id,
                project_id=proj1.id,
                title="Audit current website performance and lighthouse scores",
                description="Run deep Lighthouse and PageSpeed benchmarks on key landing pages.",
                status="Done",
                priority="Medium",
                due_date=days_ago(10),
                completed_at=days_ago(10),
                estimated_minutes=90,
                actual_minutes=75,
                tags=["audit", "performance"],
            )
            task2 = Task(
                id="task-2",
                workspace_id=my_ws.id,
                project_id=proj1.id,
                title="Create wireframes for revamped pricing tiers and FAQ",
                description="Include annual vs monthly switcher and enterprise tier comparison table.",
                status="Done",
                priority="High",
                due_date=days_ago(5),
                completed_at=days_ago(4),
                estimated_minutes=180,
                actual_minutes=210,
                tags=["design", "wireframe"],
            )
            task3 = Task(
                id="task-3",
                workspace_id=my_ws.id,
                project_id=proj1.id,
                title="Implement responsive hero section with interactive demo",
                description="Build animated preview card with framer-motion micro-interactions.",
                status="In Progress",
                priority="High",
                due_date=days_from_now(0),
                completed_at=None,
                estimated_minutes=150,
                actual_minutes=90,
                tags=["frontend", "react"],
            )
            task4 = Task(
                id="task-4",
                workspace_id=my_ws.id,
                project_id=proj1.id,
                title="Connect contact sales form with validation and captcha",
                description="Sanitize inputs, setup accessible error tooltips, test edge cases.",
                status="To Do",
                priority="Medium",
                due_date=days_from_now(3),
                completed_at=None,
                estimated_minutes=120,
                actual_minutes=0,
                tags=["forms"],
            )
            task6 = Task(
                id="task-6",
                workspace_id=my_ws.id,
                project_id=proj2.id,
                title="Fix iOS push notification APNS certificate expiration issue",
                description="Renew APNS keys in Apple Developer portal and re-sign staging build.",
                status="Done",
                priority="Urgent",
                due_date=days_ago(1),
                completed_at=days_ago(1),
                estimated_minutes=60,
                actual_minutes=80,
                tags=["ios", "urgent"],
            )
            task17 = Task(
                id="task-17",
                workspace_id=my_ws.id,
                project_id=None,
                title="Draft quarterly product roadmap and team milestone overview",
                description="Align deliverables for Q4 and allocate sprint velocities.",
                status="In Progress",
                priority="Urgent",
                due_date=days_from_now(0),
                completed_at=None,
                estimated_minutes=120,
                actual_minutes=60,
                tags=["planning"],
            )
            db.add_all([task1, task2, task3, task4, task6, task17])
            db.commit()

            # Seed Daily Logs
            log1 = DailyLog(
                id="log-1",
                workspace_id=my_ws.id,
                date=days_ago(0),
                summary="Focused on responsive hero component and product roadmap alignment.",
                worked_on="Refined framer-motion micro-interactions for the hero preview card. Reviewed sprint milestones.",
                accomplishments="Closed prototype testing on desktop & mobile viewports.",
                blockers="Awaiting design signoff on secondary CTA color variants.",
                notes_for_tomorrow="Complete contact form validation and begin end-to-end testing.",
                total_minutes=270,
            )
            log1.tasks = [task3, task17]
            db.add(log1)

            # Seed Activities
            act1 = Activity(
                id="act-1",
                workspace_id=my_ws.id,
                type="task_completed",
                title='Completed "Fix iOS push notification APNS certificate expiration issue"',
                target="task-6",
            )
            db.add(act1)
            db.commit()
            print("Successfully seeded demo data in database.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()

