from datetime import date, datetime
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.api.deps import (
    get_ai_mentor_service,
    get_analytics_service,
    get_auth_service,
)
from app.main import app
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import (
    AnalyticsOverview,
    AtRiskStudent,
    KioskAchievement,
    KioskPayload,
    StudentRanking,
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

    def login(self, credentials: LoginRequest) -> AuthSession:
        return AuthSession(
            access_token="teacher-token",
            refresh_token="refresh-token",
            expires_in=3600,
            user=self.teacher(),
        )

    def get_current_user(self, access_token: str) -> UserProfile:
        assert access_token == "teacher-token"
        return self.teacher()


class StubAnalyticsService:
    def get_rankings(self, quarter: int = 3) -> list[StudentRanking]:
        assert quarter == 3
        return [
            StudentRanking(
                student_id=UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                name="Test Student",
                average=91.5,
                achievement_points=120,
            )
        ]

    def get_overview(self, quarter: int = 3) -> AnalyticsOverview:
        assert quarter == 3
        return AnalyticsOverview(
            total_students=10,
            total_teachers=4,
            total_parents=8,
            total_events=3,
            total_achievements=12,
            school_average=84.2,
        )

    def get_at_risk_students(
        self,
        current_user: UserProfile,
        quarter: int = 3,
        threshold: float = 75,
    ) -> list[AtRiskStudent]:
        assert current_user.role == UserRole.TEACHER
        assert quarter == 3
        assert threshold == 75
        return [
            AtRiskStudent(
                student=current_user.model_copy(
                    update={
                        "id": UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                        "email": "student@example.com",
                        "full_name": "Risk Student",
                        "role": UserRole.STUDENT,
                        "class_name": "11A",
                        "grade_level": 11,
                    }
                ),
                average=68.5,
                concern_subjects=["Math", "Physics"],
            )
        ]

    def get_kiosk_payload(self) -> KioskPayload:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return KioskPayload(
            rankings=self.get_rankings(),
            featured_events=[],
            recent_achievements=[
                KioskAchievement(
                    id=UUID("ffffffff-ffff-ffff-ffff-ffffffffffff"),
                    student_id=UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                    student_name="Test Student",
                    title="Olympiad",
                    description="Winner",
                    points=100,
                    category="academic",
                    date=date(2026, 3, 30),
                )
            ],
        )


class StubAIMentorService:
    async def chat(self, messages: list[dict], student_data: dict | None) -> dict[str, str]:
        assert messages[-1]["content"] == "How do I improve math?"
        assert student_data is not None
        return {"message": "Focus on weekly math practice and review your latest mistakes."}


client = TestClient(app)


@pytest.fixture(autouse=True)
def analytics_overrides():
    app.dependency_overrides[get_auth_service] = lambda: StubAuthService()
    app.dependency_overrides[get_analytics_service] = lambda: StubAnalyticsService()
    app.dependency_overrides[get_ai_mentor_service] = lambda: StubAIMentorService()
    yield
    app.dependency_overrides.clear()


def test_analytics_overview_route() -> None:
    response = client.get(
        "/api/analytics/overview?quarter=3",
        headers={"Authorization": "Bearer teacher-token"},
    )
    assert response.status_code == 200
    assert response.json()["school_average"] == 84.2


def test_analytics_at_risk_route() -> None:
    response = client.get(
        "/api/analytics/at-risk?threshold=75&quarter=3",
        headers={"Authorization": "Bearer teacher-token"},
    )
    assert response.status_code == 200
    assert response.json()[0]["concern_subjects"] == ["Math", "Physics"]


def test_analytics_kiosk_route() -> None:
    response = client.get("/api/analytics/kiosk")
    assert response.status_code == 200
    assert response.json()["rankings"][0]["name"] == "Test Student"


def test_ai_mentor_route() -> None:
    response = client.post(
        "/api/ai-mentor",
        json={
            "messages": [{"role": "user", "content": "How do I improve math?"}],
            "student_data": {"grades": [], "achievements": [], "student": {"full_name": "Test Student"}},
        },
        headers={"Authorization": "Bearer teacher-token"},
    )
    assert response.status_code == 200
    assert "math practice" in response.json()["message"]
