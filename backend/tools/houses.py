import swisseph as swe

from tools.astrology_utils import longitude_to_sign


def compute_houses(
    julian_day: float,
    latitude: float,
    longitude: float,
):
    houses, ascmc = swe.houses_ex(
        julian_day,
        latitude,
        longitude,
    )

    ascendant_longitude = ascmc[0]

    ascendant = {
        "longitude": ascendant_longitude,
        "sign": longitude_to_sign(ascendant_longitude),
    }

    house_data = []

    for idx, cusp in enumerate(houses, start=1):
        house_data.append(
            {
                "house": idx,
                "longitude": cusp,
                "sign": longitude_to_sign(cusp),
            }
        )

    return {
        "ascendant": ascendant,
        "houses": house_data,
    }
