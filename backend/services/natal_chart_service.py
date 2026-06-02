from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from core.logging import logger

from models.birth_profile import BirthProfile
from models.natal_chart import NatalChart

from tools.chart_engine import compute_birth_chart


class NatalChartService:
    @staticmethod
    def create_natal_chart(
        db: Session,
        profile: BirthProfile,
        request_id: str,
    ) -> NatalChart:
        try:
            logger.info(
                "[%s] Generating natal chart for profile=%s",
                request_id,
                profile.id,
            )

            existing_chart = (
                db.query(NatalChart)
                .filter(NatalChart.birth_profile_id == profile.id)
                .first()
            )

            if existing_chart:
                logger.info(
                    "[%s] Natal chart already exists for profile=%s",
                    request_id,
                    profile.id,
                )

                return existing_chart

            hour = (
                profile.time.hour
                + profile.time.minute / 60
                + profile.time.second / 3600
            )

            chart = compute_birth_chart(
                year=profile.date.year,
                month=profile.date.month,
                day=profile.date.day,
                hour=hour,
                latitude=profile.latitude,
                longitude=profile.longitude,
            )

            natal_chart = NatalChart(
                birth_profile_id=profile.id,
                chart_data=chart,
            )

            db.add(natal_chart)
            db.commit()
            db.refresh(natal_chart)

            logger.info(
                "[%s] Natal chart created id=%s",
                request_id,
                natal_chart.id,
            )

            return natal_chart

        except SQLAlchemyError:
            db.rollback()

            logger.exception(
                "[%s] Failed creating natal chart",
                request_id,
            )

            raise

    @staticmethod
    def get_natal_chart(
        db: Session, birth_profile_id: int, request_id: str
    ) -> NatalChart | None:
        try:
            logger.info(
                "[%s] Fetching natal chart from profile=%s",
                request_id,
                birth_profile_id,
            )

            chart = (
                db.query(NatalChart)
                .filter(NatalChart.birth_profile_id == birth_profile_id)
                .first()
            )

            if chart:
                logger.info(
                    "[%s] Natal chart found id=%s",
                    request_id,
                    chart.id,
                )
            else:
                logger.warning(
                    "[%s] Natal chart not found for profile=%s",
                    request_id,
                    birth_profile_id,
                )

            return chart
        except SQLAlchemyError as e:
            logger.exception(
                "[%s] Failed to get natal chart for profile:%s error: %s",
                request_id,
                birth_profile_id,
                str(e),
            )
            raise
