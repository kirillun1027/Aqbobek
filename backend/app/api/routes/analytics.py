from fastapi import APIRouter, Query

from app.api.deps import AnalyticsServiceDep, CurrentUserDep
from app.models.domain import AnalyticsOverview, AtRiskStudent, KioskPayload, StudentRanking

router = APIRouter()


@router.get("/analytics/rankings", response_model=list[StudentRanking])
def get_rankings(
    analytics_service: AnalyticsServiceDep,
    quarter: int = Query(default=3, ge=1, le=4),
) -> list[StudentRanking]:
    return analytics_service.get_rankings(quarter)


@router.get("/analytics/overview", response_model=AnalyticsOverview)
def get_overview(
    analytics_service: AnalyticsServiceDep,
    quarter: int = Query(default=3, ge=1, le=4),
) -> AnalyticsOverview:
    return analytics_service.get_overview(quarter)


@router.get("/analytics/at-risk", response_model=list[AtRiskStudent])
def get_at_risk_students(
    current_user: CurrentUserDep,
    analytics_service: AnalyticsServiceDep,
    quarter: int = Query(default=3, ge=1, le=4),
    threshold: float = Query(default=75, ge=0, le=100),
) -> list[AtRiskStudent]:
    return analytics_service.get_at_risk_students(current_user, quarter, threshold)


@router.get("/analytics/kiosk", response_model=KioskPayload)
def get_kiosk_payload(
    analytics_service: AnalyticsServiceDep,
) -> KioskPayload:
    return analytics_service.get_kiosk_payload()
