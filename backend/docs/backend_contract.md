# Backend Contract

The backend contract for all new work is:

- `users.class_name`, not `users.class`
- `users.grade_level`, not `users.grade`
- `grades.score` and `grades.max_score`, not a single `grade`
- `grades.date`, not `recorded_date`
- `achievements.date`, not `awarded_date`
- `events.start_date` and `events.end_date`, not `event_date`
- `events.is_featured` is stored explicitly because the frontend already depends on it

This is intentional. It matches the current UI and reduces the amount of frontend churn while we replace the demo backend.
