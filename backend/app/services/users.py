from app.db.supabase import get_supabase_admin_client
from app.models.domain import UserProfile


class UserService:
    def list_students(self) -> list[UserProfile]:
        client = get_supabase_admin_client()
        response = (
            client.table("users")
            .select("*")
            .eq("role", "student")
            .order("full_name")
            .execute()
        )
        return [UserProfile.model_validate(item) for item in response.data or []]

    def get_student(self, student_id: str) -> UserProfile | None:
        client = get_supabase_admin_client()
        response = (
            client.table("users")
            .select("*")
            .eq("id", student_id)
            .single()
            .execute()
        )
        if not response.data:
            return None
        return UserProfile.model_validate(response.data)
