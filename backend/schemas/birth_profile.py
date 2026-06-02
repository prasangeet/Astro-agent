from datetime import date
from datetime import time

from pydantic import BaseModel


class BirthProfileCreate(BaseModel):
    user_id: int

    date: date
    time: time

    place: str


class BirthProfileResponse(BaseModel):
    id: int

    user_id: int

    date: date
    time: time

    place: str

    latitude: float
    longitude: float

    timezone: str

    class Config:
        from_attributes = True
