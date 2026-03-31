from app.api.routes.ai_mentor import router as ai_mentor_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.schedule import router as schedule_router
from fastapi import APIRouter

from app.api.routes.achievements import router as achievements_router
from app.api.routes.auth import router as auth_router
from app.api.routes.events import router as events_router
from app.api.routes.grades import router as grades_router
from app.api.routes.health import router as health_router
from app.api.routes.students import router as students_router

api_router = APIRouter()
api_router.include_router(ai_mentor_router, tags=["ai-mentor"])
api_router.include_router(analytics_router, tags=["analytics"])
api_router.include_router(achievements_router, tags=["achievements"])
api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(events_router, tags=["events"])
api_router.include_router(grades_router, tags=["grades"])
api_router.include_router(health_router, tags=["health"])
api_router.include_router(schedule_router, tags=["schedule"])
api_router.include_router(students_router, tags=["students"])
