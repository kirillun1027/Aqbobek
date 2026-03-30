from datetime import date, datetime
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.api.deps import (
    get_achievement_service,
    get_auth_service,
    get_event_service,
)
from app.main import app
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import (
    AchievementCreate,
    AchievementRecord,
    EventCreate,
    EventRecord,
    UserProfile,
    UserRole,
)


class StubAuthService:
    @staticmethod
    def teacher() -> UserProfile:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return UserProfile(
            id=UUID("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            email="teacher@example.com",
            full_name="Teacher Example",
            role=UserRole.TEACHER,
            class_name=None,
            grade_level=None,
            linked_student_ids=[],
            created_at=now,
            updated_at=now,
        )

    @staticmethod
    def admin() -> UserProfile:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return UserProfile(
            id=UUID("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
            email="admin@example.com",
            full_name="Admin Example",
            role=UserRole.ADMIN,
            class_name=None,
            grade_level=None,
            linked_student_ids=[],
            created_at=now,
            updated_at=now,
        )

    def login(self, credentials: LoginRequest) -> AuthSession:
        return AuthSession(
            access_token="teacher-token",
            refresh_token="refresh-token",
            expires_in=3600,
            user=self.teacher(),
        )

    def get_current_user(self, access_token: str) -> UserProfile:
        if access_token == "teacher-token":
            return self.teacher()
        if access_token == "admin-token":
            return self.admin()
        raise AssertionError(access_token)


class StubAchievementService:
    def list_achievements(
        self,
        current_user: UserProfile,
        student_id: str,
    ) -> list[AchievementRecord]:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return [
            AchievementRecord(
                id=UUID("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                student_id=UUID(student_id),
                title="Math Olympiad",
                description="Regional winner",
                category="academic",
                points=100,
                awarded_by=current_user.id,
                date=date(2026, 3, 30),
                created_at=now,
                updated_at=now,
            )
        ]

    def create_achievement(
        self,
        current_user: UserProfile,
        payload: AchievementCreate,
    ) -> AchievementRecord:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return AchievementRecord(
            id=UUID("11111111-1111-1111-1111-111111111111"),
            student_id=payload.student_id,
            title=payload.title,
            description=payload.description,
            category=payload.category,
            points=payload.points,
            awarded_by=current_user.id,
            date=payload.date,
            created_at=now,
            updated_at=now,
        )


class StubEventService:
    def list_events(self, featured: bool | None = None) -> list[EventRecord]:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return [
            EventRecord(
                id=UUID("22222222-2222-2222-2222-222222222222"),
                title="Career Day",
                description="Talks with industry guests",
                category="cultural",
                start_date=date(2026, 4, 2),
                end_date=None,
                location="Main Hall",
                is_featured=bool(featured),
                created_by=UUID("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee"),
                created_at=now,
                updated_at=now,
            )
        ]

    def create_event(
        self,
        current_user: UserProfile,
        payload: EventCreate,
    ) -> EventRecord:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return EventRecord(
            id=UUID("33333333-3333-3333-3333-333333333333"),
            title=payload.title,
            description=payload.description,
            category=payload.category,
            start_date=payload.start_date,
            end_date=payload.end_date,
            location=payload.location,
            is_featured=payload.is_featured,
            created_by=current_user.id,
            created_at=now,
            updated_at=now,
        )


client = TestClient(app)


@pytest.fixture(autouse=True)
def achievement_event_overrides():
    app.dependency_overrides[get_auth_service] = lambda: StubAuthService()
    app.dependency_overrides[get_achievement_service] = lambda: StubAchievementService()
    app.dependency_overrides[get_event_service] = lambda: StubEventService()
    yield
    app.dependency_overrides.clear()


def test_list_achievements_route() -> None:
    response = client.get(
        "/api/achievements",
        params={"student_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"},
        headers={"Authorization": "Bearer teacher-token"},
    )
    assert response.status_code == 200
    assert response.json()[0]["title"] == "Math Olympiad"


def test_create_achievement_route() -> None:
    response = client.post(
        "/api/achievements",
        json={
            "student_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "title": "Science Fair",
            "description": "Won first place",
            "category": "academic",
            "points": 120,
            "date": "2026-03-30",
        },
        headers={"Authorization": "Bearer teacher-token"},
    )
    assert response.status_code == 201
    assert response.json()["points"] == 120


def test_list_events_route() -> None:
    response = client.get("/api/events?featured=true")
    assert response.status_code == 200
    assert response.json()[0]["is_featured"] is True


def test_create_event_route() -> None:
    response = client.post(
        "/api/events",
        json={
            "title": "Parent Meeting",
            "description": "Quarter update",
            "category": "meeting",
            "start_date": "2026-04-03",
            "end_date": None,
            "location": "Conference Room",
            "is_featured": False,
        },
        headers={"Authorization": "Bearer admin-token"},
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Parent Meeting"
