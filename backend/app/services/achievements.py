from fastapi import HTTPException, status

from app.db.supabase import execute_with_retry, get_supabase_admin_client
from app.models.domain import AchievementCreate, AchievementRecord, UserProfile


class AchievementService:
    def list_achievements(
        self,
        current_user: UserProfile,
        student_id: str | None = None,
    ) -> list[AchievementRecord]:
        client = get_supabase_admin_client()
        query = client.table("achievements").select("*").order("date", desc=True)
        if student_id is not None:
            self._ensure_can_access_student(current_user, student_id)
            query = query.eq("student_id", student_id)
        elif current_user.role not in {"teacher", "admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only teachers or admins can view all achievements.",
            )

        response = execute_with_retry(lambda: query)
        return [AchievementRecord.model_validate(item) for item in response.data or []]

    def create_achievement(
        self,
        current_user: UserProfile,
        payload: AchievementCreate,
    ) -> AchievementRecord:
        if current_user.role not in {"teacher", "admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only teachers or admins can record achievements.",
            )

        client = get_supabase_admin_client()
        response = (
            execute_with_retry(
                lambda: client.table("achievements")
                .insert(
                    {
                        **payload.model_dump(mode="json"),
                        "awarded_by": str(current_user.id),
                    }
                )
            )
        )

        created = (response.data or [None])[0]
        if created is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create achievement.",
            )

        return AchievementRecord.model_validate(created)

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
            detail="You do not have access to this student's achievements.",
        )
