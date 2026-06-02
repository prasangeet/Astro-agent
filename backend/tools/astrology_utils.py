from datetime import date, time

import swisseph as swe

PLANETS = {
    "sun": swe.SUN,
    "moon": swe.MOON,
    "mercury": swe.MERCURY,
    "venus": swe.VENUS,
    "mars": swe.MARS,
    "jupiter": swe.JUPITER,
    "saturn": swe.SATURN,
}

SIGNS = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
]


def longitude_to_sign(longitude: float) -> str:
    longitude %= 360
    return SIGNS[int(longitude // 30)]


def datetime_to_julian_day(birth_date: date, birth_time: time) -> float:
    decimal_hour = birth_time.hour + birth_time.minute / 60 + birth_time.second / 3600

    return swe.julday(birth_date.year, birth_date.month, birth_date.day, decimal_hour)
