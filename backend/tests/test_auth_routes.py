from datetime import datetime
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.api.deps import get_auth_service
from app.main import app
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import UserProfile, UserRole


class StubAuthService:
    def login(self, credentials: LoginRequest) -> AuthSession:
        assert credentials.email == "student@example.com"
        assert credentials.password == "secret123"
        return AuthSession(
            access_token="access-token",
            refresh_token="refresh-token",
            expires_in=3600,
            user=self._user(),
        )

    def get_current_user(self, access_token: str) -> UserProfile:
        assert access_token == "access-token"
        return self._user()

    @staticmethod
    def _user() -> UserProfile:
        now = datetime(2026, 3, 30, 0, 0, 0)
        return UserProfile(
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


client = TestClient(app)


@pytest.fixture(autouse=True)
def auth_overrides():
    app.dependency_overrides[get_auth_service] = lambda: StubAuthService()
    yield
    app.dependency_overrides.clear()


def test_login_route_returns_session() -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": "student@example.com", "password": "secret123"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["access_token"] == "access-token"
    assert payload["user"]["role"] == "student"


def test_me_route_returns_profile() -> None:
    response = client.get(
        "/api/me",
        headers={"Authorization": "Bearer access-token"},
    )

    assert response.status_code == 200
    assert response.json()["email"] == "student@example.com"
