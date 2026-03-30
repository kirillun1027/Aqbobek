from datetime import date, datetime
from enum import StrEnum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserRole(StrEnum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"
    ADMIN = "admin"


class AchievementCategory(StrEnum):
    ACADEMIC = "academic"
    SPORTS = "sports"
    ARTS = "arts"
    LEADERSHIP = "leadership"
    COMMUNITY = "community"
    OTHER = "other"


class EventCategory(StrEnum):
    ANNOUNCEMENT = "announcement"
    EXAM = "exam"
    HOLIDAY = "holiday"
    SPORTS = "sports"
    CULTURAL = "cultural"
    MEETING = "meeting"


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    full_name: str
    role: UserRole
    avatar_url: str | None = None
    class_name: str | None = None
    grade_level: int | None = Field(default=None, ge=1, le=12)
    linked_student_ids: list[UUID] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime


class GradeRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    teacher_id: UUID
    subject: str
    score: float = Field(ge=0)
    max_score: float = Field(gt=0)
    quarter: int = Field(ge=1, le=4)
    comment: str | None = None
    date: date
    created_at: datetime
    updated_at: datetime


class GradeCreate(BaseModel):
    student_id: UUID
    subject: str
    score: float = Field(ge=0)
    max_score: float = Field(gt=0)
    quarter: int = Field(ge=1, le=4)
    comment: str | None = None
    date: date


class AchievementRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    student_id: UUID
    title: str
    description: str
    category: AchievementCategory
    points: int = Field(ge=0)
    awarded_by: UUID
    date: date
    created_at: datetime
    updated_at: datetime


class AchievementCreate(BaseModel):
    student_id: UUID
    title: str
    description: str
    category: AchievementCategory
    points: int = Field(ge=0)
    date: date


class EventRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    description: str
    category: EventCategory
    start_date: date
    end_date: date | None = None
    location: str | None = None
    is_featured: bool = False
    created_by: UUID
    created_at: datetime
    updated_at: datetime


class EventCreate(BaseModel):
    title: str
    description: str
    category: EventCategory
    start_date: date
    end_date: date | None = None
    location: str | None = None
    is_featured: bool = False


class StudentRanking(BaseModel):
    student_id: UUID
    name: str
    average: float
    achievement_points: int


class AtRiskStudent(BaseModel):
    student: UserProfile
    average: float
    concern_subjects: list[str]


class KioskAchievement(BaseModel):
    id: UUID
    student_id: UUID
    student_name: str
    title: str
    description: str
    points: int
    category: AchievementCategory
    date: date


class KioskPayload(BaseModel):
    rankings: list[StudentRanking]
    featured_events: list[EventRecord]
    recent_achievements: list[KioskAchievement]


class AnalyticsOverview(BaseModel):
    total_students: int
    total_teachers: int
    total_parents: int
    total_events: int
    total_achievements: int
    school_average: float


AtRiskTrend = Literal["up", "down", "stable"]
