from __future__ import annotations

import asyncio
from dataclasses import dataclass

import httpx

from app.core.config import settings
from app.db.supabase import get_supabase_admin_client


@dataclass(frozen=True)
class DemoUser:
    email: str
    password: str
    full_name: str
    role: str
    class_name: str | None = None
    grade_level: int | None = None


DEMO_USERS = [
    DemoUser(
        email="student.demo@aqbobek.kz",
        password="Student123!",
        full_name="Aliya Nurlan",
        role="student",
        class_name="11A",
        grade_level=11,
    ),
    DemoUser(
        email="teacher.demo@aqbobek.kz",
        password="Teacher123!",
        full_name="Madina Orazova",
        role="teacher",
    ),
    DemoUser(
        email="parent.demo@aqbobek.kz",
        password="Parent123!",
        full_name="Nurlan Aliyev",
        role="parent",
    ),
    DemoUser(
        email="admin.demo@aqbobek.kz",
        password="Admin123!",
        full_name="Dana Serik",
        role="admin",
    ),
]


async def create_or_get_auth_user(client: httpx.AsyncClient, user: DemoUser) -> str:
    response = await client.post(
        f"{settings.supabase_url}/auth/v1/admin/users",
        headers={
            "apikey": settings.supabase_service_role_key,
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "Content-Type": "application/json",
        },
        json={
            "email": user.email,
            "password": user.password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": user.full_name,
                "role": user.role,
            },
        },
    )

    if response.status_code == 422 and "already been registered" in response.text:
        existing = await client.get(
            f"{settings.supabase_url}/auth/v1/admin/users",
            headers={
                "apikey": settings.supabase_service_role_key,
                "Authorization": f"Bearer {settings.supabase_service_role_key}",
            },
            params={"page": 1, "per_page": 1000},
        )
        existing.raise_for_status()
        users = existing.json().get("users", [])
        match = next((item for item in users if item.get("email") == user.email), None)
        if not match:
            raise RuntimeError(f"Auth user exists but could not be fetched for {user.email}")
        return match["id"]

    response.raise_for_status()
    return response.json()["id"]


async def main() -> None:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.")

    admin_client = get_supabase_admin_client()

    async with httpx.AsyncClient(timeout=30) as client:
        auth_users: dict[str, str] = {}
        for user in DEMO_USERS:
            auth_users[user.email] = await create_or_get_auth_user(client, user)

    student_id = auth_users["student.demo@aqbobek.kz"]

    rows = [
        {
            "id": auth_users[user.email],
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "class_name": user.class_name,
            "grade_level": user.grade_level,
            "linked_student_ids": [student_id] if user.role == "parent" else [],
        }
        for user in DEMO_USERS
    ]

    admin_client.table("users").upsert(rows).execute()

    print("Demo users are ready:")
    for user in DEMO_USERS:
        print(f"- {user.role}: {user.email} / {user.password}")


if __name__ == "__main__":
    asyncio.run(main())
