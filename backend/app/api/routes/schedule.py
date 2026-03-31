from fastapi import APIRouter

from app.api.deps import CurrentUserDep, ScheduleServiceDep
from app.models.domain import ScheduleDataset, ScheduleGenerationResult, ScheduleRegenerationRequest

router = APIRouter()


@router.get("/schedule/context", response_model=ScheduleDataset)
def get_schedule_context(
    current_user: CurrentUserDep,
    schedule_service: ScheduleServiceDep,
) -> ScheduleDataset:
    return schedule_service.get_dataset(current_user)


@router.post("/schedule/generate", response_model=ScheduleGenerationResult)
def generate_schedule(
    current_user: CurrentUserDep,
    schedule_service: ScheduleServiceDep,
) -> ScheduleGenerationResult:
    return schedule_service.generate_schedule(current_user)


@router.post("/schedule/rebuild", response_model=ScheduleGenerationResult)
def rebuild_schedule(
    payload: ScheduleRegenerationRequest,
    current_user: CurrentUserDep,
    schedule_service: ScheduleServiceDep,
) -> ScheduleGenerationResult:
    return schedule_service.regenerate_for_absence(current_user, payload)
