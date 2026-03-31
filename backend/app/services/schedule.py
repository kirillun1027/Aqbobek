from collections import defaultdict

from fastapi import HTTPException, status

from app.models.domain import (
    ScheduleChange,
    ScheduleDataset,
    ScheduleEntry,
    ScheduleEntryStatus,
    ScheduleGenerationResult,
    ScheduleLessonType,
    ScheduleRegenerationRequest,
    ScheduleRequirement,
    ScheduleRoom,
    ScheduleTeacher,
    UserProfile,
)


class ScheduleService:
    DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    PERIODS = [1, 2, 3, 4, 5]

    def get_dataset(self, current_user: UserProfile) -> ScheduleDataset:
        self._ensure_admin(current_user)
        return self._build_dataset()

    def generate_schedule(self, current_user: UserProfile) -> ScheduleGenerationResult:
        self._ensure_admin(current_user)
        dataset = self._build_dataset()
        entries, unresolved = self._assign_requirements(dataset)
        return ScheduleGenerationResult(
            dataset=dataset,
            entries=sorted(entries, key=lambda item: (self.DAYS.index(item.day), item.period, item.class_name)),
            unresolved_requirements=unresolved,
            summary=f"Generated {len(entries)} schedule entries with {len(unresolved)} unresolved requirement(s).",
        )

    def regenerate_for_absence(
        self,
        current_user: UserProfile,
        payload: ScheduleRegenerationRequest,
    ) -> ScheduleGenerationResult:
        self._ensure_admin(current_user)
        dataset = self._build_dataset()
        teacher_ids = {teacher.id for teacher in dataset.teachers}
        if payload.absent_teacher_id not in teacher_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Teacher was not found in schedule dataset.",
            )

        entries, unresolved = self._assign_requirements(dataset, absent_teacher_id=payload.absent_teacher_id)
        return ScheduleGenerationResult(
            dataset=dataset,
            entries=sorted(entries, key=lambda item: (self.DAYS.index(item.day), item.period, item.class_name)),
            changes=[
                ScheduleChange(
                    entry_id=entry.id,
                    change_type="reassigned" if entry.status == ScheduleEntryStatus.REASSIGNED else "unfilled",
                    message=entry.note or "",
                )
                for entry in entries
                if entry.note
            ],
            unresolved_requirements=unresolved,
            summary=(
                f"Rebuilt schedule for absent teacher {payload.absent_teacher_id}. "
                f"{len([entry for entry in entries if entry.note])} adjustment(s), "
                f"{len(unresolved)} unresolved requirement(s)."
            ),
        )

    def _assign_requirements(
        self,
        dataset: ScheduleDataset,
        absent_teacher_id: str | None = None,
    ) -> tuple[list[ScheduleEntry], list[str]]:
        teachers = {teacher.id: teacher for teacher in dataset.teachers}
        class_slots: dict[str, set[str]] = defaultdict(set)
        teacher_slots: dict[str, set[str]] = defaultdict(set)
        room_slots: dict[str, set[str]] = defaultdict(set)
        entries: list[ScheduleEntry] = []
        unresolved: list[str] = []

        for requirement in sorted(dataset.requirements, key=lambda item: (item.class_name, item.subject, item.group_label or "")):
            assigned = 0
            slot_candidates = requirement.preferred_slots or dataset.slots

            for slot_id in slot_candidates:
                if assigned >= requirement.weekly_lessons or slot_id in class_slots[requirement.class_name]:
                    continue

                teacher_id, teacher_name, status_value, note = self._select_teacher(
                    requirement,
                    teachers,
                    teacher_slots,
                    slot_id,
                    absent_teacher_id,
                )
                if teacher_id is None and status_value != ScheduleEntryStatus.UNFILLED:
                    continue

                room = self._select_room(requirement, dataset.rooms, room_slots, slot_id)
                if room is None and status_value != ScheduleEntryStatus.UNFILLED:
                    continue

                day, period_text = slot_id.split("-P")
                entries.append(
                    ScheduleEntry(
                        id=f"{requirement.id}-{assigned + 1}",
                        slot_id=slot_id,
                        day=day,
                        period=int(period_text),
                        class_name=requirement.class_name,
                        subject=requirement.subject,
                        teacher_id=teacher_id,
                        teacher_name=teacher_name,
                        room_id=room.id if room else None,
                        room_name=room.name if room else None,
                        lesson_type=requirement.lesson_type,
                        group_label=requirement.group_label,
                        status=status_value,
                        note=note,
                    )
                )
                class_slots[requirement.class_name].add(slot_id)
                if teacher_id:
                    teacher_slots[teacher_id].add(slot_id)
                if room:
                    room_slots[room.id].add(slot_id)
                assigned += 1

            if assigned < requirement.weekly_lessons:
                unresolved.append(f"{requirement.class_name}: {requirement.subject} ({requirement.weekly_lessons - assigned} slot(s) missing)")

        return entries, unresolved

    def _select_teacher(
        self,
        requirement: ScheduleRequirement,
        teachers: dict[str, ScheduleTeacher],
        teacher_slots: dict[str, set[str]],
        slot_id: str,
        absent_teacher_id: str | None,
    ) -> tuple[str | None, str | None, ScheduleEntryStatus, str | None]:
        allowed = requirement.allowed_teacher_ids[:]
        if absent_teacher_id and absent_teacher_id in allowed:
            allowed.remove(absent_teacher_id)
            for teacher_id in allowed:
                teacher = teachers[teacher_id]
                if slot_id in teacher.unavailable_slots or slot_id in teacher_slots[teacher_id]:
                    continue
                return teacher.id, teacher.name, ScheduleEntryStatus.REASSIGNED, f"Reassigned to {teacher.name} because the original teacher is absent."
            return None, None, ScheduleEntryStatus.UNFILLED, "No replacement teacher was available for this slot."

        for teacher_id in allowed:
            teacher = teachers[teacher_id]
            if slot_id in teacher.unavailable_slots or slot_id in teacher_slots[teacher_id]:
                continue
            return teacher.id, teacher.name, ScheduleEntryStatus.SCHEDULED, None

        return None, None, ScheduleEntryStatus.UNFILLED, "No teacher was available for this slot."

    def _select_room(
        self,
        requirement: ScheduleRequirement,
        rooms: list[ScheduleRoom],
        room_slots: dict[str, set[str]],
        slot_id: str,
    ) -> ScheduleRoom | None:
        candidates = [room for room in rooms if all(feature in room.features for feature in requirement.room_features)] or rooms
        for room in candidates:
            if slot_id not in room_slots[room.id]:
                return room
        return None

    def _build_dataset(self) -> ScheduleDataset:
        slots = [f"{day}-P{period}" for day in self.DAYS for period in self.PERIODS]
        teachers = [
            ScheduleTeacher(id="teacher-math", name="Madina Orazova", subjects=["Mathematics", "Physics"], unavailable_slots=["Monday-P5", "Thursday-P1"]),
            ScheduleTeacher(id="teacher-language", name="Dana Serik", subjects=["English", "History"], unavailable_slots=["Tuesday-P2", "Friday-P4"]),
            ScheduleTeacher(id="teacher-science", name="Timur Akhmetov", subjects=["Physics", "Chemistry", "Biology"], unavailable_slots=["Wednesday-P3"]),
            ScheduleTeacher(id="teacher-humanities", name="Aruzhan Bek", subjects=["History", "Literature", "English"], unavailable_slots=["Monday-P1", "Thursday-P4"]),
        ]
        rooms = [
            ScheduleRoom(id="room-201", name="Room 201", capacity=30, features=["projector"]),
            ScheduleRoom(id="room-202", name="Room 202", capacity=28, features=["projector"]),
            ScheduleRoom(id="lab-1", name="Science Lab 1", capacity=24, features=["lab", "projector"]),
            ScheduleRoom(id="hall", name="Assembly Hall", capacity=120, features=["stage"]),
        ]
        requirements = [
            ScheduleRequirement(id="11a-math", class_name="11A", subject="Mathematics", weekly_lessons=2, preferred_slots=["Monday-P1", "Wednesday-P1", "Friday-P1"], allowed_teacher_ids=["teacher-math"], room_features=["projector"]),
            ScheduleRequirement(id="11a-physics", class_name="11A", subject="Physics", weekly_lessons=2, preferred_slots=["Tuesday-P2", "Thursday-P2", "Friday-P2"], allowed_teacher_ids=["teacher-science", "teacher-math"], room_features=["lab"]),
            ScheduleRequirement(id="11a-english", class_name="11A", subject="English", weekly_lessons=2, preferred_slots=["Monday-P3", "Wednesday-P4", "Friday-P3"], allowed_teacher_ids=["teacher-language", "teacher-humanities"], room_features=["projector"]),
            ScheduleRequirement(id="10b-history", class_name="10B", subject="History", weekly_lessons=2, preferred_slots=["Tuesday-P1", "Thursday-P3", "Friday-P5"], allowed_teacher_ids=["teacher-humanities", "teacher-language"], room_features=["projector"]),
            ScheduleRequirement(id="10b-chemistry", class_name="10B", subject="Chemistry", weekly_lessons=2, preferred_slots=["Monday-P2", "Wednesday-P2", "Thursday-P5"], allowed_teacher_ids=["teacher-science"], room_features=["lab"]),
            ScheduleRequirement(id="stream-stem", class_name="10A/10B", subject="Profile Stream", weekly_lessons=1, preferred_slots=["Wednesday-P5"], allowed_teacher_ids=["teacher-math"], room_features=["projector"], lesson_type=ScheduleLessonType.STREAM, group_label="STEM Group"),
            ScheduleRequirement(id="stream-humanities", class_name="10A/10B", subject="Profile Stream", weekly_lessons=1, preferred_slots=["Wednesday-P5"], allowed_teacher_ids=["teacher-humanities"], room_features=["projector"], lesson_type=ScheduleLessonType.STREAM, group_label="Humanities Group"),
            ScheduleRequirement(id="assembly", class_name="All School", subject="Community Assembly", weekly_lessons=1, preferred_slots=["Friday-P4"], allowed_teacher_ids=["teacher-language"], room_features=["stage"], lesson_type=ScheduleLessonType.EVENT),
        ]
        return ScheduleDataset(classes=["10A", "10B", "11A"], slots=slots, teachers=teachers, rooms=rooms, requirements=requirements)

    def _ensure_admin(self, current_user: UserProfile) -> None:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can manage smart schedules.",
            )
