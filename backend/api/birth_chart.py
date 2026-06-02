from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from database import get_db

from schemas.birth_profile import BirthProfileCreate
from schemas.birth_profile import BirthProfileResponse

from services.birth_profile_service import BirthProfileService
from services.natal_chart_service import NatalChartService

router = APIRouter()


@router.post(
    "/",
    response_model=BirthProfileResponse,
)
def create_birth_profile(
    payload: BirthProfileCreate,
    db: Session = Depends(get_db),
):
    profile = BirthProfileService.create_birth_profile(
        db=db,
        user_id=payload.user_id,
        date=payload.date,
        time=payload.time,
        place=payload.place,
        request_id="api",
    )

    NatalChartService.create_natal_chart(
        db=db,
        profile=profile,
        request_id="api",
    )

    return profile
