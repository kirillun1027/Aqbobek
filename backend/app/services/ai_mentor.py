import logging

from fastapi import HTTPException, status

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class AIMentorService:
    async def chat(self, messages: list[dict], student_data: dict | None) -> dict[str, str]:
        if not settings.gemini_api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini AI is not configured.",
            )

        student_data = student_data or {}
        grades = student_data.get("grades", [])
        achievements = student_data.get("achievements", [])
        student = student_data.get("student", {})

        subject_map: dict[str, dict[str, float]] = {}
        for grade in grades:
            subject = grade["subject"]
            subject_map.setdefault(subject, {"sum": 0, "count": 0})
            subject_map[subject]["sum"] += (grade["score"] / grade["max_score"]) * 100
            subject_map[subject]["count"] += 1

        subject_averages = [
            {
                "subject": subject,
                "average": round(stats["sum"] / stats["count"]),
            }
            for subject, stats in subject_map.items()
        ]
        strong = [f'{item["subject"]} ({item["average"]}%)' for item in subject_averages if item["average"] >= 85]
        weak = [f'{item["subject"]} ({item["average"]}%)' for item in subject_averages if item["average"] < 75]
        summary = "\n".join([f'- {item["subject"]}: {item["average"]}%' for item in subject_averages]) or "- No grade data yet"

        achievement_summary = "\n".join(
            [f'- {item["title"]} ({item["category"]}, {item["points"]} pts)' for item in achievements]
        ) or "- No achievements recorded yet"

        system_prompt = f"""You are the AI Mentor for Aqbobek Lyceum.
You provide concise, evidence-based academic guidance using only the student's real profile data.

Student:
- Name: {student.get("full_name", "Student")}
- Class: {student.get("class_name", "-")}
- Grade level: {student.get("grade") or student.get("grade_level") or "-"}

Performance summary:
{summary}

Strong subjects: {", ".join(strong) or "Not established yet"}
Growth subjects: {", ".join(weak) or "None right now"}

Achievements:
{achievement_summary}

Rules:
- Reply in the same language as the user.
- Be warm but concrete.
- Use 2 to 4 short paragraphs.
- Do not invent grades or achievements.
"""

        gemini_contents = [
            {
                "role": "user" if item["role"] == "user" else "model",
                "parts": [{"text": item["content"]}],
            }
            for item in messages
        ]

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent",
                params={"key": settings.gemini_api_key},
                headers={"Content-Type": "application/json"},
                json={
                    "system_instruction": {
                        "parts": [{"text": system_prompt}],
                    },
                    "contents": gemini_contents,
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 1024,
                    },
                },
            )

        if response.status_code >= 400:
            provider_error = response.text.strip() or "Empty response body"
            logger.error(
                "Gemini request failed with status %s: %s",
                response.status_code,
                provider_error,
            )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Gemini request failed with status {response.status_code}: {provider_error}",
            )

        payload = response.json()
        candidates = payload.get("candidates", [])
        first_candidate = candidates[0] if candidates else {}
        content = first_candidate.get("content", {})
        parts = content.get("parts", [])
        text = parts[0].get("text") if parts else None
        return {"message": text or "No response from AI mentor."}
