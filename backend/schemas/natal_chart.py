from pydantic import BaseModel

from schemas.birth_profile import BirthProfileResponse


class NatalChartResponse(BaseModel):
    id: int
    birth_profile_id: int
    chart_data: dict
    birth_profile: BirthProfileResponse

    model_config = {
        "from_attributes": True,
    }
