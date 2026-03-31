# Deploy

## Target stack

- Frontend: Vercel
- Backend: Render
- Database/Auth: Supabase

## Render backend

- Create a new `Blueprint` or `Web Service` in Render from this repository.
- Use [`render.yaml`](./render.yaml) or these manual values:
  - Root directory: `backend`
  - Build command: `pip install .`
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set env vars:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL=gemini-1.5-flash`
  - `CORS_ORIGINS=["https://your-vercel-project.vercel.app"]`

The backend URL will be:

```text
https://akbobek-backend.onrender.com/api
```

Replace the hostname if Render assigns a different service name.

## Vercel frontend

- Import the repository into Vercel.
- Framework preset: `Next.js`
- Root directory: repository root
- Set env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_BACKEND_URL=https://akbobek-backend.onrender.com/api`

## Required post-deploy checks

- Create real Supabase Auth users for `student`, `teacher`, `parent`, `admin`.
  - You can use the helper script:

```powershell
cd backend
..\.venv\Scripts\python -m app.scripts.seed_demo_users
```

- Ensure matching rows exist in `users`.
- Run smoke tests:
  - login
  - record grade
  - record achievement
  - create event
  - dashboard loads
  - kiosk loads
  - AI mentor responds
