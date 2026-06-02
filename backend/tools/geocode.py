from geopy.geocoders import Nominatim
from langchain_core.tools import tool
from timezonefinder import TimezoneFinder

geolocator = Nominatim(user_agent="astroagent")
timezone_finder = TimezoneFinder()


def geocode_place(place: str) -> dict:
    location = geolocator.geocode(place)

    if location is None:
        raise ValueError(f"Could not find location: {place}")

    timezone = timezone_finder.timezone_at(
        lat=location.latitude,
        lng=location.longitude,
    )

    return {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "timezone": timezone,
    }


@tool
def geocode_tool(place: str):
    """
    Convert a place name into latitude, longitude and timezone
    """
    return geocode_place(place)
