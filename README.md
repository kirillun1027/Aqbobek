# Aqbobek Lyceum Unified Portal

Unified school portal for Aqbobek Lyceum with role-based dashboards, academic analytics, AI mentoring, kiosk mode, and a smart schedule MVP.

## Overview

The project solves a common school operations problem: grades, achievements, events, and internal coordination are usually scattered across separate systems or handled manually. This portal brings them into one digital environment for students, teachers, parents, and school administrators.

The platform combines:

- a multi-role web portal
- a dedicated backend API
- Supabase authentication and storage
- AI-powered mentoring and summaries
- a smart schedule demo module with conflict-aware generation and rebuild logic

## What Is Implemented

### Core Product

- Role-based authentication for `student`, `teacher`, `parent`, and `admin`
- Student, teacher, parent, and admin dashboards
- Grades management and viewing
- Achievements recording and portfolio-style display
- School events feed and management
- Kiosk mode for public hallway displays
- Online deployment for frontend and backend

### AI Features

- AI Mentor powered by Gemini API
- Personalized guidance based on student profile and academic data
- Teacher-facing risk visibility through analytics and at-risk views
- Rule-based analytics on top of raw data instead of LLM-only logic

### Smart Schedule MVP

- Admin-only smart schedule page
- Conflict-aware schedule generation
- Support for teacher availability constraints
- Support for room availability constraints
- Support for stream lessons / parallel groups
- Rebuild flow for teacher absence scenarios
- Explainable list of schedule changes after rebuild

## User Roles and Main Use Cases

### Student

- View grades and academic progress
- See achievements and portfolio items
- Track events and school announcements
- Use AI Mentor for personalized study support
- Check rankings and gamified performance blocks

### Teacher

- View students
- Record grades
- Record achievements
- Monitor at-risk students
- Use class-level analytics

### Parent

- View linked child dashboard
- Monitor grades, achievements, and events
- Use the portal in observer mode without teacher/admin controls

### Admin

- Monitor school-wide overview analytics
- Manage events
- Use kiosk mode content
- Generate and rebuild smart schedules

## Architecture

### Frontend

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`

The frontend is responsible for:

- authentication UX
- role-based routing
- dashboard views
- admin schedule UI
- kiosk presentation mode

### Backend

- `FastAPI`
- `Pydantic`
- `Uvicorn`

The backend is responsible for:

- API endpoints
- role-aware business logic
- analytics calculations
- AI Mentor integration
- schedule generation and rebuild logic
- demo data seeding

### Data and Auth

- `Supabase Auth`
- `Supabase Postgres`

The database stores:

- users
- grades
- achievements
- events
- role-linked relations such as parent-to-student access

### AI Layer

- `Gemini API`

Used for:

- AI Mentor responses
- contextual academic guidance

### Deployment

- Frontend: `Vercel`
- Backend: `Render`
- Database/Auth: `Supabase`

## High-Level Project Structure

```text
app/                         Next.js app routes
components/                  Reusable UI and dashboard views
lib/                         Frontend API client, auth context, types
backend/app/api/             FastAPI routes and dependencies
backend/app/services/        Business logic and AI/schedule services
backend/app/models/          Backend domain and API models
backend/tests/               Backend test suite
```

## Key Functional Areas

### Dashboards

- Student dashboard with grades, achievements, events, and AI access
- Teacher dashboard with student visibility and intervention signals
- Parent dashboard with linked child observer mode
- Admin dashboard with school-wide analytics and operational tools

### AI Mentor

The AI Mentor uses live backend data to generate role-aware academic guidance. It is integrated through the backend, not hardcoded in the frontend.

### Analytics

Implemented analytics include:

- school overview metrics
- student rankings
- at-risk detection
- grade-based summaries

### Kiosk Mode

Public display mode includes:

- top students / rankings
- featured events
- recent achievements

### Smart Schedule

The schedule module is a focused hackathon MVP, not a full industrial timetable solver. It demonstrates:

- constraint-aware generation
- avoidance of direct conflicts
- teacher absence handling
- schedule rebuild logic
- explainable change output

## Strengths of the Project

- Real multi-role product, not a single dashboard mockup
- Dedicated backend instead of frontend-only fake APIs
- Live data flow through Supabase
- Working AI integration through external API
- Practical school use cases instead of generic CRUD only
- Smart schedule MVP gives the project a strong algorithmic module
- Online deployment makes the project demo-ready

## Demo Accounts

These demo users are seeded through the backend helper script:

- `student.demo@aqbobek.kz / Student123!`
- `teacher.demo@aqbobek.kz / Teacher123!`
- `parent.demo@aqbobek.kz / Parent123!`
- `admin.demo@aqbobek.kz / Admin123!`

## Running Locally

### Frontend

```powershell
npm install
npm run dev
```

### Backend

```powershell
cd backend
..\.venv\Scripts\python -m pip install -e .[dev]
..\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_BACKEND_URL=https://your-render-service.onrender.com/api
```

### Backend

```env
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
GEMINI_MODEL=...
CORS_ORIGINS=["http://localhost:3000","https://your-vercel-project.vercel.app"]
```

See also:

- [`DEPLOY.md`](./DEPLOY.md)
- [`backend/README.md`](./backend/README.md)

## Seed Demo Users

```powershell
cd backend
..\.venv\Scripts\python -m app.scripts.seed_demo_users
```

This creates demo users in Supabase Auth and corresponding profile rows in the database.

## Tests

### Backend

```powershell
cd backend
..\.venv\Scripts\python -m pytest
```

### Frontend

```powershell
npm run build
```

## Example Demo Flow

For a short product demo:

1. Log in as `teacher` and record a grade.
2. Record an achievement for the student.
3. Log in as `admin` and create an event.
4. Open `Smart Schedule` and generate a schedule.
5. Simulate teacher absence and rebuild the schedule.
6. Log in as `student` and show updated dashboard data.
7. Open `Kiosk Mode`.
8. Ask AI Mentor for study guidance.

## Hackathon Alignment

The project already demonstrates:

- working role-based portal
- analytics and AI integration
- kiosk mode
- dedicated backend architecture
- smart schedule MVP with rebuild logic

The strongest parts for presentation are:

- end-to-end working product
- AI Mentor with live data
- analytics and risk visibility
- smart schedule generation and absence handling

## Known Scope Boundaries

This repository currently focuses on a strong hackathon MVP. Some areas remain intentionally lightweight compared to a full production school ERP:

- BilimClass integration is represented through internal backend-driven data flows rather than a full external integration layer
- Smart Schedule is a demo-grade planner, not a full enterprise scheduler
- Some advanced AI scenarios from the expanded brief can still be extended further

## License

MIT
