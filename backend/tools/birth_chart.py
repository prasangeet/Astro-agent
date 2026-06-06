from langchain_core.tools import tool

from database import SessionLocal

from services.birth_profile_service import BirthProfileService
from services.natal_chart_service import NatalChartService
from tools.geocode import geocode_place
from tools.chart_engine import compute_birth_chart


@tool
def birth_chart_tool(
    user_id: int,
):
    """
    Retrieve a user's birth profile and natal chart.
    If a natal chart does not exist, generate and store it first.
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
                "status": "missing_birth_profile",
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

        return {
            "birth_profile": {
                "user_id": profile.user_id,
                "date": str(profile.date),
                "time": str(profile.time),
                "place": profile.place,
                "latitude": profile.latitude,
                "longitude": profile.longitude,
                "timezone": profile.timezone,
            },
            "natal_chart": chart.chart_data,
        }

    finally:
        db.close()


@tool
def compute_birth_chart_tool(
    date: str,
    time: str,
    place: str,
):
    """
    Compute a natal chart from birth details.

    Parameters:
    - date: YYYY-MM-DD
    - time: HH:MM (24-hour format)
    - place: city, state/province, country

    Returns:
    - planetary positions
    - ascendant
    - houses
    - coordinates
    - timezone

    Use this tool when the user provides birth details
    for another person, partner, friend, family member,
    or when performing compatibility analysis.

    Example:
    compute_birth_chart_tool(
        date="1998-05-12",
        time="14:30",
        place="Delhi, India",
    )
    """
    try:
        year, month, day = map(
            int,
            date.split("-"),
        )

        hour_part, minute_part = map(
            int,
            time.split(":"),
        )

        decimal_hour = hour_part + minute_part / 60

        location = geocode_place(place)

        chart = compute_birth_chart(
            year=year,
            month=month,
            day=day,
            hour=decimal_hour,
            latitude=location["latitude"],
            longitude=location["longitude"],
        )

        return {
            "place": place,
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "timezone": location["timezone"],
            "chart": chart,
        }

    except Exception as e:
        return {
            "error": str(e),
        }
