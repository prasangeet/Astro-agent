from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from database import get_db

from schemas.birth_profile import (
    BirthProfileCreate,
    BirthProfileResponse,
)

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


@router.get(
    "/{user_id}",
    response_model=BirthProfileResponse,
)
def get_birth_profile(
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

    return profile


@router.put(
    "/{user_id}",
    response_model=BirthProfileResponse,
)
def update_birth_profile(
    user_id: int,
    payload: BirthProfileCreate,
    db: Session = Depends(get_db),
):
    profile = BirthProfileService.update_birth_profile(
        db=db,
        user_id=user_id,
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
