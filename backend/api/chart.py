from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from database import get_db
from services.natal_chart_service import NatalChartService
from schemas.natal_chart import NatalChartResponse
from services.birth_profile_service import BirthProfileService
from sqlalchemy.orm import Session

router = APIRouter()


@router.get(
    "/{user_id}",
    response_model=NatalChartResponse,
)
def get_natal_chart(
    user_id: int,
    db: Session = Depends(get_db),
):
    profile = BirthProfileService.get_birth_profile(
        db=db,
        user_id=user_id,
        request_id="api",
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Birth profile not found",
        )

    chart = NatalChartService.get_natal_chart(
        db=db,
        birth_profile_id=profile.id,
        request_id="api",
    )

    if not chart:
        chart = NatalChartService.create_natal_chart(
            db=db,
            profile=profile,
            request_id="api",
        )

    return chart
