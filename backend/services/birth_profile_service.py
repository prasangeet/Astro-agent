from sqlalchemy.orm import Session

from core.logging import logger

from models.birth_profile import BirthProfile

from services.user_service import UserService

from tools.geocode import geocode_place


class BirthProfileService:
    @staticmethod
    def create_birth_profile(
        db: Session,
        user_id: int,
        date,
        time,
        place: str,
        request_id: str,
    ) -> BirthProfile:
        try:
            logger.info(
                "[%s] Creating birth profile for user=%s",
                request_id,
                user_id,
            )

            user = UserService.get_user(
                db=db,
                user_id=user_id,
                request_id=request_id,
            )

            if not user:
                raise ValueError(f"User {user_id} not found")

            geo = geocode_place(place)

            profile = BirthProfile(
                user_id=user_id,
                date=date,
                time=time,
                place=place,
                latitude=geo["latitude"],
                longitude=geo["longitude"],
                timezone=geo["timezone"],
            )

            db.add(profile)
            db.commit()
            db.refresh(profile)

            logger.info(
                "[%s] Birth profile created id=%s",
                request_id,
                profile.id,
            )

            return profile

        except Exception:
            db.rollback()

            logger.exception(
                "[%s] Failed creating birth profile",
                request_id,
            )

            raise

    @staticmethod
    def get_birth_profile(
        db: Session,
        user_id: int,
        request_id: str,
    ) -> BirthProfile | None:
        try:
            logger.info(
                "[%s] Fetching birth profile for user=%s",
                request_id,
                user_id,
            )

            profile = (
                db.query(BirthProfile).filter(BirthProfile.user_id == user_id).first()
            )

            if profile:
                logger.info(
                    "[%s] Birth profile found id=%s",
                    request_id,
                    profile.id,
                )
            else:
                logger.warning(
                    "[%s] Birth profile not found for user=%s",
                    request_id,
                    user_id,
                )

            return profile

        except Exception:
            logger.exception(
                "[%s] Failed fetching birth profile for user=%s",
                request_id,
                user_id,
            )

            raise

    @staticmethod
    def update_birth_profile(
        db: Session,
        user_id: int,
        date,
        time,
        place: str,
        request_id: str,
    ) -> BirthProfile:
        try:
            logger.info(
                "[%s] Updating birth profile for user=%s",
                request_id,
                user_id,
            )

            profile = (
                db.query(BirthProfile).filter(BirthProfile.user_id == user_id).first()
            )

            if not profile:
                raise ValueError(f"Birth profile not found for user {user_id}")

            geo = geocode_place(place)

            profile.date = date
            profile.time = time
            profile.place = place
            profile.latitude = geo["latitude"]
            profile.longitude = geo["longitude"]
            profile.timezone = geo["timezone"]

            db.commit()
            db.refresh(profile)

            logger.info(
                "[%s] Birth profile updated id=%s",
                request_id,
                profile.id,
            )

            return profile

        except Exception:
            db.rollback()

            logger.exception(
                "[%s] Failed updating birth profile",
                request_id,
            )

            raise
