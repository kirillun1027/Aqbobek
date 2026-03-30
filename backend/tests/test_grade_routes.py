from datetime import date, datetime
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_auth_service, get_grade_service, get_user_service
from app.main import app
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import GradeCreate, GradeRecord, UserProfile, UserRole


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


class StubGradeService:
    def list_grades(
        self,
        current_user: UserProfile,
        student_id: str,
        quarter: int | None = None,
    ) -> list[GradeRecord]:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return [
            GradeRecord(
                id=UUID("cccccccc-cccc-cccc-cccc-cccccccccccc"),
                student_id=UUID(student_id),
                teacher_id=current_user.id,
                subject="Mathematics",
                score=95,
                max_score=100,
                quarter=quarter or 3,
                comment="Strong result",
                date=date(2026, 3, 30),
                created_at=now,
                updated_at=now,
            )
        ]

    def create_grade(
        self,
        current_user: UserProfile,
        payload: GradeCreate,
    ) -> GradeRecord:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return GradeRecord(
            id=UUID("dddddddd-dddd-dddd-dddd-dddddddddddd"),
            student_id=payload.student_id,
            teacher_id=current_user.id,
            subject=payload.subject,
            score=payload.score,
            max_score=payload.max_score,
            quarter=payload.quarter,
            comment=payload.comment,
            date=payload.date,
            created_at=now,
            updated_at=now,
        )


class StubUserService:
    def list_students(self) -> list[UserProfile]:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return [
            UserProfile(
                id=UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
                email="student@example.com",
                full_name="Test Student",
                role=UserRole.STUDENT,
                class_name="11A",
                grade_level=11,
                linked_student_ids=[],
                created_at=now,
                updated_at=now,
            )
        ]


client = TestClient(app)


@pytest.fixture(autouse=True)
def grade_overrides():
    app.dependency_overrides[get_auth_service] = lambda: StubAuthService()
    app.dependency_overrides[get_grade_service] = lambda: StubGradeService()
    app.dependency_overrides[get_user_service] = lambda: StubUserService()
    yield
    app.dependency_overrides.clear()


def test_list_grades_route() -> None:
    response = client.get(
        "/api/grades",
        params={
            "student_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "quarter": 3,
        },
        headers={"Authorization": "Bearer teacher-token"},
    )

    assert response.status_code == 200
    assert response.json()[0]["subject"] == "Mathematics"


def test_create_grade_route() -> None:
    response = client.post(
        "/api/grades",
        json={
            "student_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
            "subject": "Physics",
            "score": 88,
            "max_score": 100,
            "quarter": 3,
            "comment": "Good progress",
            "date": "2026-03-30",
        },
        headers={"Authorization": "Bearer teacher-token"},
    )

    assert response.status_code == 201
    assert response.json()["subject"] == "Physics"


def test_list_students_route() -> None:
    response = client.get(
        "/api/students",
        headers={"Authorization": "Bearer teacher-token"},
    )

    assert response.status_code == 200
    assert response.json()[0]["role"] == "student"
