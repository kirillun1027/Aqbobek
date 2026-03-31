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


class ScheduleLessonType(StrEnum):
    LESSON = "lesson"
    STREAM = "stream"
    EVENT = "event"


class ScheduleEntryStatus(StrEnum):
    SCHEDULED = "scheduled"
    REASSIGNED = "reassigned"
    UNFILLED = "unfilled"


class ScheduleTeacher(BaseModel):
    id: str
    name: str
    subjects: list[str]
    unavailable_slots: list[str] = Field(default_factory=list)


class ScheduleRoom(BaseModel):
    id: str
    name: str
    capacity: int
    features: list[str] = Field(default_factory=list)


class ScheduleRequirement(BaseModel):
    id: str
    class_name: str
    subject: str
    weekly_lessons: int = Field(ge=1)
    preferred_slots: list[str] = Field(default_factory=list)
    allowed_teacher_ids: list[str]
    room_features: list[str] = Field(default_factory=list)
    lesson_type: ScheduleLessonType = ScheduleLessonType.LESSON
    group_label: str | None = None


class ScheduleEntry(BaseModel):
    id: str
    slot_id: str
    day: str
    period: int
    class_name: str
    subject: str
    teacher_id: str | None = None
    teacher_name: str | None = None
    room_id: str | None = None
    room_name: str | None = None
    lesson_type: ScheduleLessonType = ScheduleLessonType.LESSON
    group_label: str | None = None
    status: ScheduleEntryStatus = ScheduleEntryStatus.SCHEDULED
    note: str | None = None


class ScheduleChange(BaseModel):
    entry_id: str
    change_type: str
    message: str


class ScheduleDataset(BaseModel):
    classes: list[str]
    slots: list[str]
    teachers: list[ScheduleTeacher]
    rooms: list[ScheduleRoom]
    requirements: list[ScheduleRequirement]


class ScheduleGenerationResult(BaseModel):
    dataset: ScheduleDataset
    entries: list[ScheduleEntry]
    changes: list[ScheduleChange] = Field(default_factory=list)
    unresolved_requirements: list[str] = Field(default_factory=list)
    summary: str


class ScheduleRegenerationRequest(BaseModel):
    absent_teacher_id: str
