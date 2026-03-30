from pydantic import BaseModel, EmailStr, Field

from app.models.domain import UserProfile


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class AuthSession(BaseModel):
    access_token: str
    refresh_token: str | None = None
    expires_in: int | None = None
    token_type: str = "bearer"
    user: UserProfile
