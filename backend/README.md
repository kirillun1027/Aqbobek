# Aqbobek Backend

## Local setup

```powershell
cd backend
..\.venv\Scripts\python -m pip install -e .[dev]
..\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

## Tests

```powershell
cd backend
..\.venv\Scripts\python -m pytest
```

## Seed demo users

```powershell
cd backend
..\.venv\Scripts\python -m app.scripts.seed_demo_users
```
