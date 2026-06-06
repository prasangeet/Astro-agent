from sqlalchemy.orm import Session

from core.logging import logger

from models.usage_metric import UsageMetric


class UsageService:
    @staticmethod
    def save_usage(
        db: Session,
        request_id: str,
        user_id: int,
        model: str,
        prompt_tokens: int,
        completion_tokens: int,
        total_tokens: int,
    ):
        try:
            metric = UsageMetric(
                request_id=request_id,
                user_id=user_id,
                model=model,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
            )

            db.add(metric)
            db.commit()

            logger.info(
                "[%s] Saved usage metrics total_tokens=%s",
                request_id,
                total_tokens,
            )

        except Exception:
            db.rollback()

            logger.exception(
                "[%s] Failed saving usage metrics",
                request_id,
            )
