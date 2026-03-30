from fastapi import APIRouter, Query

from app.api.deps import CurrentUserDep, GradeServiceDep
from app.models.domain import GradeCreate, GradeRecord

router = APIRouter()


@router.get("/grades", response_model=list[GradeRecord])
def list_grades(
    current_user: CurrentUserDep,
    grade_service: GradeServiceDep,
    student_id: str | None = Query(default=None),
    quarter: int | None = Query(default=None, ge=1, le=4),
) -> list[GradeRecord]:
    return grade_service.list_grades(current_user, student_id, quarter)


@router.post("/grades", response_model=GradeRecord, status_code=201)
def create_grade(
    payload: GradeCreate,
    current_user: CurrentUserDep,
    grade_service: GradeServiceDep,
) -> GradeRecord:
    return grade_service.create_grade(current_user, payload)
