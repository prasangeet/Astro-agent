import swisseph as swe

from tools.astrology_utils import PLANETS
from tools.astrology_utils import longitude_to_sign
from tools.houses import compute_houses


def compute_planets(jd: float):
    result = {}

    for name, planet in PLANETS.items():
        data, _ = swe.calc_ut(jd, planet)

        longitude = data[0]

        result[name] = {
            "longitude": longitude,
            "sign": longitude_to_sign(longitude),
        }

    return result


def compute_birth_chart(
    year: int,
    month: int,
    day: int,
    hour: float,
    latitude: float,
    longitude: float,
):
    jd = swe.julday(
        year,
        month,
        day,
        hour,
    )

    planets = compute_planets(jd)

    house_data = compute_houses(
        julian_day=jd,
        latitude=latitude,
        longitude=longitude,
    )

    return {
        "planets": planets,
        "ascendant": house_data["ascendant"],
        "houses": house_data["houses"],
    }
