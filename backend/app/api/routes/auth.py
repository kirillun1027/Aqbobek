from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import AuthServiceDep, get_bearer_token
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import UserProfile

router = APIRouter()


@router.post("/auth/login", response_model=AuthSession)
def login(
    credentials: LoginRequest,
    auth_service: AuthServiceDep,
) -> AuthSession:
    return auth_service.login(credentials)


@router.get("/me", response_model=UserProfile)
def get_me(
    auth_service: AuthServiceDep,
    access_token: Annotated[str, Depends(get_bearer_token)],
) -> UserProfile:
    return auth_service.get_current_user(access_token)
