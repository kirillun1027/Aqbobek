# Deploy Guide

## Target Stack

- Frontend: `Vercel`
- Backend: `Render`
- Database/Auth: `Supabase`
- AI Provider: `Gemini API`

## Deployment Topology

```text
Next.js frontend (Vercel)
        |
        v
FastAPI backend (Render) -> Gemini API
        |
        v
Supabase Auth + Postgres
```

## 1. Supabase Setup

Create a Supabase project first. You will need:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

The app expects:

- authentication via Supabase Auth
- user profiles in the `users` table
- grades, achievements, and events stored in Supabase Postgres

If this is a fresh environment, make sure your database schema is already applied before deploying the app.

## 2. Deploy Backend on Render

You can deploy via [`render.yaml`](./render.yaml) or configure a Render web service manually.

### Manual Render Settings

- Runtime: `Python`
- Root directory: `backend`
- Build command:

```text
pip install .
```

- Start command:

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Required Backend Environment Variables

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `CORS_ORIGINS`

### Optional Backend Environment Variables

- `APP_NAME`
- `APP_VERSION`
- `API_PREFIX`
- `GEMINI_MODEL`

### Recommended Backend Environment Example

```env
APP_NAME=Aqbobek Backend
APP_VERSION=0.1.0
API_PREFIX=/api
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-flash-latest
CORS_ORIGINS=["http://localhost:3000","https://your-vercel-project.vercel.app"]
```

### Notes About `CORS_ORIGINS`

This value must be valid JSON, not a plain comma-separated string.

Correct:

```text
["https://aqbobek.vercel.app","http://localhost:3000"]
```

Incorrect:

```text
https://aqbobek.vercel.app
```

### Notes About `GEMINI_MODEL`

Use a model that is actually available for your Gemini API key. If in doubt, list models first:

```powershell
$apiKey = "YOUR_GEMINI_API_KEY"
$models = Invoke-RestMethod `
  -Method Get `
  -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey"

$models.models |
  Where-Object { $_.supportedGenerationMethods -contains "generateContent" } |
  Select-Object name
```

Common working values may include:

- `gemini-flash-latest`
- `gemini-2.0-flash`
- `gemini-2.0-flash-lite`

Do not assume `gemini-1.5-flash` is available for every key.

### Backend URL

Your backend base URL will be:

```text
https://your-render-service.onrender.com/api
```

Replace the hostname with the actual Render service name.

## 3. Deploy Frontend on Vercel

Import the repository into Vercel.

### Vercel Settings

- Framework preset: `Next.js`
- Root directory: repository root

### Required Frontend Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BACKEND_URL`

### Recommended Frontend Environment Example

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=https://your-render-service.onrender.com/api
```

Important:

- `NEXT_PUBLIC_BACKEND_URL` must include `/api`
- after changing frontend env vars, redeploy the Vercel project

## 4. Seed Demo Users

After backend deploy, create the demo accounts:

```powershell
cd backend
..\.venv\Scripts\python -m app.scripts.seed_demo_users
```

Expected demo accounts:

- `student.demo@aqbobek.kz / Student123!`
- `teacher.demo@aqbobek.kz / Teacher123!`
- `parent.demo@aqbobek.kz / Parent123!`
- `admin.demo@aqbobek.kz / Admin123!`

This script creates:

- users in Supabase Auth
- matching rows in the `users` table
- role assignments
- parent-to-student link for the demo parent

## 5. Post-Deploy Smoke Test

Run these checks after deployment.

### Backend Health

```powershell
Invoke-RestMethod -Method Get -Uri "https://your-render-service.onrender.com/api/health"
```

### Login

```powershell
$login = Invoke-RestMethod `
  -Method Post `
  -Uri "https://your-render-service.onrender.com/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"email":"teacher.demo@aqbobek.kz","password":"Teacher123!"}'
```

### Verify Main Flows

- login works for all four roles
- student dashboard loads
- teacher can record grade
- teacher can record achievement
- admin can create event
- admin smart schedule page loads
- kiosk page loads
- AI Mentor responds

## 6. Troubleshooting

### CORS Error

If the browser shows `Failed to fetch` with a CORS message:

- verify `CORS_ORIGINS` contains the exact Vercel domain
- make sure the value is valid JSON
- redeploy the Render service after changing env vars

### Backend Works but Frontend Still Fails

Check:

- `NEXT_PUBLIC_BACKEND_URL` includes `/api`
- Vercel project was redeployed after env changes
- the frontend is using the correct deployed domain

### `500` with Expired Session Symptoms

If dashboards fail after some time:

- log out and log back in
- clear stale local storage token if needed

The project now handles expired sessions more gracefully, but redeploying both frontend and backend is recommended after auth-related updates.

### Gemini Model Errors

If AI Mentor returns model `404` or quota errors:

- verify `GEMINI_API_KEY`
- verify `GEMINI_MODEL`
- run `ListModels` against the same key
- choose a supported `generateContent` model

## 7. Recommended Demo Stack

For a stable hackathon demo:

- host frontend on Vercel
- host backend on Render
- use Supabase for Auth and Postgres
- seed demo users
- verify AI Mentor before presenting
- verify Smart Schedule page as admin

## 8. Security Note

If an API key was exposed in chat, screenshots, or commits, rotate it before final submission or demo day.
