from collections import defaultdict

from fastapi import HTTPException, status

from app.db.supabase import execute_with_retry, get_supabase_admin_client
from app.models.domain import (
    AchievementRecord,
    AnalyticsOverview,
    AtRiskStudent,
    EventRecord,
    GradeRecord,
    KioskAchievement,
    KioskPayload,
    StudentRanking,
    UserProfile,
)


class AnalyticsService:
    def get_overview(self, quarter: int = 3) -> AnalyticsOverview:
        client = get_supabase_admin_client()
        students_response = execute_with_retry(lambda: client.table("users").select("id", count="exact").eq("role", "student"))
        teachers_response = execute_with_retry(lambda: client.table("users").select("id", count="exact").eq("role", "teacher"))
        parents_response = execute_with_retry(lambda: client.table("users").select("id", count="exact").eq("role", "parent"))
        events_response = execute_with_retry(lambda: client.table("events").select("id", count="exact"))
        achievements_response = execute_with_retry(lambda: client.table("achievements").select("id", count="exact"))
        grades = self._get_grades(quarter=quarter)

        school_average = round(
            sum((grade.score / grade.max_score) * 100 for grade in grades) / len(grades),
            1,
        ) if grades else 0.0

        return AnalyticsOverview(
            total_students=students_response.count or 0,
            total_teachers=teachers_response.count or 0,
            total_parents=parents_response.count or 0,
            total_events=events_response.count or 0,
            total_achievements=achievements_response.count or 0,
            school_average=school_average,
        )

    def get_rankings(self, quarter: int = 3) -> list[StudentRanking]:
        students = self._get_students()
        grades = self._get_grades(quarter=quarter)
        achievements = self._get_achievements()

        achievement_points: dict[str, int] = defaultdict(int)
        for achievement in achievements:
            achievement_points[str(achievement.student_id)] += achievement.points

        rankings: list[StudentRanking] = []
        for student in students:
            student_grades = [grade for grade in grades if grade.student_id == student.id]
            if student_grades:
                average = round(
                    sum((grade.score / grade.max_score) * 100 for grade in student_grades)
                    / len(student_grades),
                    1,
                )
            else:
                average = 0.0

            rankings.append(
                StudentRanking(
                    student_id=student.id,
                    name=student.full_name,
                    average=average,
                    achievement_points=achievement_points.get(str(student.id), 0),
                )
            )

        rankings.sort(
            key=lambda item: (item.average, item.achievement_points),
            reverse=True,
        )
        return rankings

    def get_at_risk_students(
        self,
        current_user: UserProfile,
        quarter: int = 3,
        threshold: float = 75,
    ) -> list[AtRiskStudent]:
        if current_user.role not in {"teacher", "admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only teachers or admins can view at-risk students.",
            )

        students = self._get_students()
        grades = self._get_grades(quarter=quarter)
        at_risk: list[AtRiskStudent] = []

        for student in students:
            student_grades = [grade for grade in grades if grade.student_id == student.id]
            if not student_grades:
                continue

            subject_scores: dict[str, list[float]] = defaultdict(list)
            for grade in student_grades:
                subject_scores[grade.subject].append((grade.score / grade.max_score) * 100)

            concern_subjects = [
                subject
                for subject, values in subject_scores.items()
                if (sum(values) / len(values)) < threshold
            ]
            averages = [sum(values) / len(values) for values in subject_scores.values()]
            overall_average = round(sum(averages) / len(averages), 1)

            if concern_subjects or overall_average < threshold:
                at_risk.append(
                    AtRiskStudent(
                        student=student,
                        average=overall_average,
                        concern_subjects=sorted(concern_subjects),
                    )
                )

        at_risk.sort(key=lambda item: item.average)
        return at_risk

    def get_kiosk_payload(self) -> KioskPayload:
        achievements = self._get_achievements()
        students = {str(student.id): student for student in self._get_students()}

        recent_achievements = [
            KioskAchievement(
                id=achievement.id,
                student_id=achievement.student_id,
                student_name=students.get(str(achievement.student_id)).full_name if students.get(str(achievement.student_id)) else "Student",
                title=achievement.title,
                description=achievement.description,
                points=achievement.points,
                category=achievement.category,
                date=achievement.date,
            )
            for achievement in achievements[:4]
        ]

        featured_events = [event for event in self._get_events() if event.is_featured][:5]
        return KioskPayload(
            rankings=self.get_rankings()[:5],
            featured_events=featured_events,
            recent_achievements=recent_achievements,
        )

    def _get_students(self) -> list[UserProfile]:
        client = get_supabase_admin_client()
        response = (
            execute_with_retry(
                lambda: client.table("users")
                .select("*")
                .eq("role", "student")
                .order("full_name")
            )
        )
        return [UserProfile.model_validate(item) for item in response.data or []]

    def _get_grades(self, quarter: int | None = None) -> list[GradeRecord]:
        client = get_supabase_admin_client()
        query = client.table("grades").select("*").order("date", desc=True)
        if quarter is not None:
            query = query.eq("quarter", quarter)
        response = execute_with_retry(lambda: query)
        return [GradeRecord.model_validate(item) for item in response.data or []]

    def _get_achievements(self) -> list[AchievementRecord]:
        client = get_supabase_admin_client()
        response = execute_with_retry(lambda: client.table("achievements").select("*").order("date", desc=True))
        return [AchievementRecord.model_validate(item) for item in response.data or []]

    def _get_events(self) -> list[EventRecord]:
        client = get_supabase_admin_client()
        response = execute_with_retry(lambda: client.table("events").select("*").order("start_date"))
        return [EventRecord.model_validate(item) for item in response.data or []]
