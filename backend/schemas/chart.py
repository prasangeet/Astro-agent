from pydantic import BaseModel


class PlanetPosition:
    longitude: float
    sign: str


class BirthChartResponse(BaseModel):
    sun: PlanetPosition
    moon: PlanetPosition
    mercury: PlanetPosition
    venus: PlanetPosition
    mars: PlanetPosition
    jupiter: PlanetPosition
    saturn: PlanetPosition
