from fastapi import HTTPException, status
from supabase_auth.errors import AuthApiError

from app.db.supabase import execute_with_retry, get_supabase_admin_client, get_supabase_client
from app.models.auth import AuthSession, LoginRequest
from app.models.domain import UserProfile


class AuthService:
    def login(self, credentials: LoginRequest) -> AuthSession:
        client = get_supabase_client()
        try:
            auth_response = client.auth.sign_in_with_password(
                {
                    "email": credentials.email,
                    "password": credentials.password,
                }
            )
        except AuthApiError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            ) from exc

        session = getattr(auth_response, "session", None)
        user = getattr(auth_response, "user", None)
        if session is None or user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        profile = self._get_profile_by_user_id(str(user.id))
        return AuthSession(
            access_token=session.access_token,
            refresh_token=session.refresh_token,
            expires_in=session.expires_in,
            token_type="bearer",
            user=profile,
        )

    def get_current_user(self, access_token: str) -> UserProfile:
        client = get_supabase_client()
        try:
            auth_response = client.auth.get_user(access_token)
        except AuthApiError as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired or access token is invalid.",
            ) from exc
        user = getattr(auth_response, "user", None)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid access token.",
            )

        return self._get_profile_by_user_id(str(user.id))

    def _get_profile_by_user_id(self, user_id: str) -> UserProfile:
        admin_client = get_supabase_admin_client()
        response = (
            execute_with_retry(
                lambda: admin_client.table("users")
                .select("*")
                .eq("id", user_id)
                .single()
            )
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile was not found.",
            )

        return UserProfile.model_validate(response.data)
