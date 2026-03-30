from fastapi import APIRouter, Query

from app.api.deps import AchievementServiceDep, CurrentUserDep
from app.models.domain import AchievementCreate, AchievementRecord

router = APIRouter()


@router.get("/achievements", response_model=list[AchievementRecord])
def list_achievements(
    current_user: CurrentUserDep,
    achievement_service: AchievementServiceDep,
    student_id: str | None = Query(default=None),
) -> list[AchievementRecord]:
    return achievement_service.list_achievements(current_user, student_id)


@router.post("/achievements", response_model=AchievementRecord, status_code=201)
def create_achievement(
    payload: AchievementCreate,
    current_user: CurrentUserDep,
    achievement_service: AchievementServiceDep,
) -> AchievementRecord:
    return achievement_service.create_achievement(current_user, payload)
