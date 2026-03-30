from fastapi import APIRouter
from pydantic import BaseModel

from app.api.deps import AIMentorServiceDep

router = APIRouter()


class AIMentorRequest(BaseModel):
    messages: list[dict]
    student_data: dict | None = None


@router.post("/ai-mentor")
async def chat_with_ai_mentor(
    payload: AIMentorRequest,
    ai_mentor_service: AIMentorServiceDep,
) -> dict[str, str]:
    return await ai_mentor_service.chat(payload.messages, payload.student_data)
