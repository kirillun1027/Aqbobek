from fastapi import APIRouter, Query

from app.api.deps import CurrentUserDep, EventServiceDep
from app.models.domain import EventCreate, EventRecord

router = APIRouter()


@router.get("/events", response_model=list[EventRecord])
def list_events(
    event_service: EventServiceDep,
    featured: bool | None = Query(default=None),
) -> list[EventRecord]:
    return event_service.list_events(featured)


@router.post("/events", response_model=EventRecord, status_code=201)
def create_event(
    payload: EventCreate,
    current_user: CurrentUserDep,
    event_service: EventServiceDep,
) -> EventRecord:
    return event_service.create_event(current_user, payload)
