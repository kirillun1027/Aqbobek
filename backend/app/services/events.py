from fastapi import HTTPException, status

from app.db.supabase import execute_with_retry, get_supabase_admin_client
from app.models.domain import EventCreate, EventRecord, UserProfile


class EventService:
    def list_events(self, featured: bool | None = None) -> list[EventRecord]:
        client = get_supabase_admin_client()
        query = client.table("events").select("*").order("start_date")
        if featured is True:
            query = query.eq("is_featured", True)
        response = execute_with_retry(lambda: query)
        return [EventRecord.model_validate(item) for item in response.data or []]

    def create_event(
        self,
        current_user: UserProfile,
        payload: EventCreate,
    ) -> EventRecord:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can manage events.",
            )

        client = get_supabase_admin_client()
        response = (
            execute_with_retry(
                lambda: client.table("events")
                .insert(
                    {
                        **payload.model_dump(mode="json"),
                        "created_by": str(current_user.id),
                    }
                )
            )
        )

        created = (response.data or [None])[0]
        if created is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create event.",
            )

        return EventRecord.model_validate(created)
