from typing import Annotated

from fastapi import Depends, Header, HTTPException, status

from app.models.domain import UserProfile
from app.services.ai_mentor import AIMentorService
from app.services.analytics import AnalyticsService
from app.services.achievements import AchievementService
from app.services.auth import AuthService
from app.services.events import EventService
from app.services.grades import GradeService
from app.services.users import UserService


def get_auth_service() -> AuthService:
    return AuthService()


def get_user_service() -> UserService:
    return UserService()


def get_grade_service() -> GradeService:
    return GradeService()


def get_achievement_service() -> AchievementService:
    return AchievementService()


def get_event_service() -> EventService:
    return EventService()


def get_analytics_service() -> AnalyticsService:
    return AnalyticsService()


def get_ai_mentor_service() -> AIMentorService:
    return AIMentorService()


def get_bearer_token(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required.",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer token.",
        )

    return token


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
GradeServiceDep = Annotated[GradeService, Depends(get_grade_service)]
AchievementServiceDep = Annotated[AchievementService, Depends(get_achievement_service)]
EventServiceDep = Annotated[EventService, Depends(get_event_service)]
AnalyticsServiceDep = Annotated[AnalyticsService, Depends(get_analytics_service)]
AIMentorServiceDep = Annotated[AIMentorService, Depends(get_ai_mentor_service)]


def get_current_user(
    auth_service: AuthServiceDep,
    access_token: Annotated[str, Depends(get_bearer_token)],
) -> UserProfile:
    return auth_service.get_current_user(access_token)


CurrentUserDep = Annotated[UserProfile, Depends(get_current_user)]
