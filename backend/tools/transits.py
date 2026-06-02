from tools.astrology_utils import PLANETS, longitude_to_sign
from datetime import datetime, UTC
from langchain_core.tools import tool
import swisseph as swe


def get_daily_transits():
    now = datetime.now(UTC)

    decimal_hour = now.hour + now.minute / 60 + now.second / 3600

    jd = swe.julday(now.year, now.month, now.day, decimal_hour)

    transits = {}

    for name, planet in PLANETS.items():
        data, _ = swe.calc_ut(jd, planet)

        longitude = data[0]

        transits[name] = {"longitude": longitude, "sign": longitude_to_sign(longitude)}

    return transits


@tool
def transit_tool():
    """
    Get current planetary transit positions.
    Useful for answering questions about today's
    astrological influences and ongoing transits.
    """
    return get_daily_transits()
