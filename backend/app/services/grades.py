from fastapi import HTTPException, status

from app.db.supabase import get_supabase_admin_client
from app.models.domain import GradeCreate, GradeRecord, UserProfile


class GradeService:
    def list_grades(
        self,
        current_user: UserProfile,
        student_id: str | None = None,
        quarter: int | None = None,
    ) -> list[GradeRecord]:
        client = get_supabase_admin_client()
        query = client.table("grades").select("*").order("date", desc=True)

        if student_id is not None:
            self._ensure_can_access_student(current_user, student_id)
            query = query.eq("student_id", student_id)
        elif current_user.role not in {"teacher", "admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only teachers or admins can view all grades.",
            )

        if quarter is not None:
            query = query.eq("quarter", quarter)

        response = query.execute()
        return [GradeRecord.model_validate(item) for item in response.data or []]

    def create_grade(
        self,
        current_user: UserProfile,
        payload: GradeCreate,
    ) -> GradeRecord:
        if current_user.role not in {"teacher", "admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only teachers or admins can record grades.",
            )

        client = get_supabase_admin_client()
        response = (
            client.table("grades")
            .insert(
                {
                    **payload.model_dump(mode="json"),
                    "teacher_id": str(current_user.id),
                }
            )
            .execute()
        )

        created = (response.data or [None])[0]
        if created is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create grade.",
            )

        return GradeRecord.model_validate(created)

    def _ensure_can_access_student(self, current_user: UserProfile, student_id: str) -> None:
        if current_user.role in {"teacher", "admin"}:
            return

        if current_user.role == "student" and str(current_user.id) == student_id:
            return

        linked_ids = {str(item) for item in current_user.linked_student_ids}
        if current_user.role == "parent" and student_id in linked_ids:
            return

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this student's grades.",
        )
