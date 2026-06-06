from fastapi import APIRouter
from fastapi import Depends

from fastapi.exceptions import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from database import get_db

from models.user import User

from schemas.user import UserCreate, UserResponse
from core.logging import logger

router = APIRouter()


@router.post(
    "/",
    response_model=UserResponse,
)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        user = User(
            name=payload.name.strip(),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    except SQLAlchemyError as e:
        db.rollback()

        logger.exception("Failed to create user")

        raise HTTPException(
            status_code=500,
            detail="Failed to create user",
        ) from e


@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail=f"User {user_id} not found",
            )

        return user

    except HTTPException:
        raise

    except SQLAlchemyError as e:
        logger.exception(
            "Failed to fetch user=%s",
            user_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch user",
        ) from e
