# WorkPulse — Secure FastAPI + Supabase PostgreSQL Without JWT

## Role

Act as a senior FastAPI backend engineer and database security specialist.

My application, WorkPulse, uses:
- Frontend: React + Tailwind CSS + Framer Motion
- Backend: FastAPI
- Database: Supabase-hosted PostgreSQL
- ORM: SQLAlchemy
- Migrations: Alembic, if already configured

**Important:** My application does not use JWT authentication. Do not add JWT, introduce a new authentication system, or rewrite the login flow without first inspecting the existing implementation.

My Supabase tables are showing an "UNRESTRICTED" label. I want to understand and fix the underlying database security configuration while preserving my existing application.

## 1. Inspect the existing implementation

Before modifying any files:

- Inspect the backend folder structure and existing source code.
- Identify how registration, login, logout, and session management currently work, if implemented.
- Determine whether authentication uses server-side sessions, cookies, HTTP Basic authentication, an existing authentication provider, or no authentication.
- Inspect SQLAlchemy models, database sessions, database connection configuration, and Alembic migrations.
- List all tables and their relationships.
- Determine which tables have RLS enabled and which database role FastAPI uses to connect to Supabase.
- Inspect existing authorization checks and frontend API calls.

First provide a concise audit report. Do not assume authentication exists merely because login pages are present.

## 2. Preserve the current authentication system

Do not introduce JWT or replace the existing authentication mechanism.

If authentication already exists:
- Preserve the existing login and logout behavior.
- Reuse the existing authentication and session mechanism.
- Add reusable FastAPI dependencies to identify the authenticated user.
- Protect private API endpoints using the existing authentication mechanism.
- Validate the user's identity on the server.
- Never trust a user ID submitted by the frontend as proof of ownership.

If authentication does not exist:
- Report that finding clearly.
- Explain that database authorization alone cannot establish which human user is making an API request.
- Recommend a suitable authentication approach, but do not silently implement a new authentication system or make existing endpoints unusable.

## 3. Investigate the Supabase "UNRESTRICTED" label

Inspect every application table in the `public` schema.

Determine:
- Whether RLS is enabled.
- Which roles have table privileges.
- Whether the FastAPI database role has `BYPASSRLS` or superuser privileges.
- Whether existing RLS policies are appropriate for the actual connection model.
- Whether private tables can be accessed through Supabase's Data API.
- Whether any existing configuration exposes private user data.

Do not assume that enabling RLS automatically protects queries made by a privileged backend connection.

Enable RLS on appropriate tables using reviewed SQL or migrations. Do not create permissive policies such as `USING (true)` just to remove the warning.

Do not drop, recreate, truncate, or reset existing tables.

## 4. Secure workspace and record access

WorkPulse supports multiple workspaces. Users must only access workspaces they own or are authorized to use.

Review and secure all applicable endpoints for:
- Workspaces and memberships.
- Projects.
- Tasks.
- Daily work logs.
- Activity records.
- Dashboard summaries.
- Work efficiency analytics.

Ensure that:
- Every private request is authenticated using the existing mechanism, if one exists.
- Workspace access is checked server-side.
- Projects and tasks cannot be accessed by guessing or changing record IDs.
- Daily logs follow the existing ownership rules.
- Dashboard and analytics queries are scoped to authorized records.
- Updates and deletes verify authorization before changing data.
- Cross-workspace references are validated.

Use SQLAlchemy queries scoped to authorized workspaces. Do not fetch all records and rely on frontend filtering.

## 5. Database connection and least privilege

Keep the existing FastAPI + SQLAlchemy connection to Supabase PostgreSQL.

- Store credentials in backend environment variables.
- Never expose database credentials in React.
- Keep `.env` out of version control.
- Verify the actual database role used by FastAPI.
- Avoid privileged roles for routine operations when a restricted role is practical.
- If RLS is used for defense in depth, design its policies around the actual database identity and connection lifecycle.
- Never trust a client-supplied user ID as the database's authenticated user identity.
- Ensure transaction-scoped security context cannot leak between pooled connections.

If the current connection role bypasses RLS, explain the implications and recommend a safe configuration before changing permissions.

## 6. Keep the frontend functional

- Preserve existing API routes and request/response formats wherever possible.
- Keep React communicating with FastAPI.
- Do not move database operations directly into the browser to bypass backend authorization.
- Do not add JWT bearer-token handling unless the existing application actually uses it.
- Preserve existing workspace switching, task management, projects, daily logs, dashboard, and analytics features.
- Make only changes necessary for security and compatibility.

## 7. Test the changes

Add or update tests for:

1. Unauthenticated requests cannot access protected endpoints, where authentication is implemented.
2. Authorized users can access their own permitted records.
3. Users cannot access another user's private workspace.
4. Changing task or project IDs cannot expose another user's records.
5. Unauthorized updates and deletes are rejected.
6. Workspace relationships are validated.
7. Dashboard and analytics data are correctly scoped.
8. Existing login and logout flows continue working.
9. The actual database role and RLS configuration match the intended security model.

Use isolated test data. Do not run destructive tests against production data.

## 8. Deliverables

Provide:
- The authentication mechanism discovered in the existing project.
- The cause of the Supabase "UNRESTRICTED" label.
- The database role and RLS audit results.
- The files changed and why.
- Any SQL or Alembic migrations required.
- Tests executed and actual results.
- Exact Windows PowerShell commands for testing and running FastAPI.
- Any manual Supabase dashboard steps still required.

## Acceptance criteria

The application must continue using its existing authentication approach. No JWT system should be introduced automatically.

Private WorkPulse data must be protected by server-side authorization, database permissions must be reviewed, and RLS must be configured appropriately for the actual connection model.

Begin by inspecting the current implementation. Do not replace working authentication, reset the database, or claim security tests passed unless they were actually executed.