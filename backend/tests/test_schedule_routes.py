from datetime import datetime
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_auth_service, get_schedule_service
from app.main import app
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import (
    ScheduleDataset,
    ScheduleEntry,
    ScheduleGenerationResult,
    ScheduleLessonType,
    ScheduleRegenerationRequest,
    ScheduleRoom,
    ScheduleTeacher,
    UserProfile,
    UserRole,
)


class StubAuthService:
    @staticmethod
    def admin() -> UserProfile:
        now = datetime(2026, 4, 1, 0, 0, 0)
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
            access_token="admin-token",
            refresh_token="refresh-token",
            expires_in=3600,
            user=self.admin(),
        )

    def get_current_user(self, access_token: str) -> UserProfile:
        assert access_token == "admin-token"
        return self.admin()


class StubScheduleService:
    def get_dataset(self, current_user: UserProfile) -> ScheduleDataset:
        return ScheduleDataset(
            classes=["11A"],
            slots=["Monday-P1"],
            teachers=[ScheduleTeacher(id="teacher-1", name="Teacher", subjects=["Math"], unavailable_slots=[])],
            rooms=[ScheduleRoom(id="room-1", name="Room 1", capacity=25, features=["projector"])],
            requirements=[],
        )

    def generate_schedule(self, current_user: UserProfile) -> ScheduleGenerationResult:
        return ScheduleGenerationResult(
            dataset=self.get_dataset(current_user),
            entries=[
                ScheduleEntry(
                    id="entry-1",
                    slot_id="Monday-P1",
                    day="Monday",
                    period=1,
                    class_name="11A",
                    subject="Mathematics",
                    teacher_id="teacher-1",
                    teacher_name="Teacher",
                    room_id="room-1",
                    room_name="Room 1",
                    lesson_type=ScheduleLessonType.LESSON,
                )
            ],
            summary="Generated demo schedule.",
        )

    def regenerate_for_absence(
        self,
        current_user: UserProfile,
        payload: ScheduleRegenerationRequest,
    ) -> ScheduleGenerationResult:
        result = self.generate_schedule(current_user)
        result.summary = f"Rebuilt for {payload.absent_teacher_id}"
        return result


client = TestClient(app)


@pytest.fixture(autouse=True)
def schedule_overrides():
    app.dependency_overrides[get_auth_service] = lambda: StubAuthService()
    app.dependency_overrides[get_schedule_service] = lambda: StubScheduleService()
    yield
    app.dependency_overrides.clear()


def test_schedule_context_route() -> None:
    response = client.get(
        "/api/schedule/context",
        headers={"Authorization": "Bearer admin-token"},
    )
    assert response.status_code == 200
    assert response.json()["classes"] == ["11A"]


def test_schedule_generate_route() -> None:
    response = client.post(
        "/api/schedule/generate",
        json={},
        headers={"Authorization": "Bearer admin-token"},
    )
    assert response.status_code == 200
    assert response.json()["entries"][0]["subject"] == "Mathematics"


def test_schedule_rebuild_route() -> None:
    response = client.post(
        "/api/schedule/rebuild",
        json={"absent_teacher_id": "teacher-1"},
        headers={"Authorization": "Bearer admin-token"},
    )
    assert response.status_code == 200
    assert "teacher-1" in response.json()["summary"]
