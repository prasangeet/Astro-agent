from langchain_core.tools import tool

from database import SessionLocal

from services.birth_profile_service import BirthProfileService
from services.natal_chart_service import NatalChartService


@tool
def birth_chart_tool(
    user_id: int,
):
    """
    Retrieve a user's natal chart.
    If one does not exist, generate and store it first.
    """

    db = SessionLocal()

    try:
        profile = BirthProfileService.get_birth_profile(
            db=db,
            user_id=user_id,
            request_id="tool",
        )

        if not profile:
            return {
                "error": "No birth profile found for user",
            }

        chart = NatalChartService.get_natal_chart(
            db=db,
            birth_profile_id=profile.id,
            request_id="tool",
        )

        if not chart:
            chart = NatalChartService.create_natal_chart(
                db=db,
                profile=profile,
                request_id="tool",
            )

        return chart.chart_data

    finally:
        db.close()
