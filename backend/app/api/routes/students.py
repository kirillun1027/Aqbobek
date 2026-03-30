from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUserDep, UserServiceDep
from app.models.domain import UserProfile

router = APIRouter()


@router.get("/students", response_model=list[UserProfile])
def list_students(
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> list[UserProfile]:
    if current_user.role not in {"teacher", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers or admins can view the student list.",
        )

    return user_service.list_students()


@router.get("/students/{student_id}", response_model=UserProfile)
def get_student(
    student_id: str,
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> UserProfile:
    if current_user.role not in {"teacher", "admin", "parent"} and str(current_user.id) != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this student profile.",
        )

    student = user_service.get_student(student_id)
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found.",
        )

    if current_user.role == "parent" and student_id not in {str(item) for item in current_user.linked_student_ids}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this student profile.",
        )

    return student
