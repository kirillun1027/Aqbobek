import time
from functools import lru_cache

import httpx
from fastapi import HTTPException, status
from supabase import Client, create_client

from app.core.config import settings


@lru_cache(maxsize=1)
def get_supabase_client() -> Client:
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise RuntimeError("Supabase environment variables are not configured.")

    return create_client(settings.supabase_url, settings.supabase_anon_key)


@lru_cache(maxsize=1)
def get_supabase_admin_client() -> Client:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise RuntimeError("Supabase admin environment variables are not configured.")

    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def execute_with_retry(query_factory, *, attempts: int = 3, delay_seconds: float = 0.35):
    last_error: Exception | None = None

    for attempt in range(1, attempts + 1):
        try:
            return query_factory().execute()
        except (httpx.ReadError, httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError) as exc:
            last_error = exc
            if attempt == attempts:
                break
            time.sleep(delay_seconds * attempt)

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Temporary database connectivity issue. Please retry.",
    ) from last_error
