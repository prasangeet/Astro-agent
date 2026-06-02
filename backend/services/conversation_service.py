from sqlalchemy.orm import Session

from core.logging import logger

from models.conversation import Conversation


class ConversationService:
    @staticmethod
    def save_message(
        db: Session,
        user_id: int,
        role: str,
        content: str,
        request_id: str,
    ):
        try:
            message = Conversation(
                user_id=user_id,
                role=role,
                content=content,
            )

            db.add(message)
            db.commit()

            logger.info(
                "[%s] Saved conversation message",
                request_id,
            )

        except Exception:
            db.rollback()

            logger.exception(
                "[%s] Failed saving conversation",
                request_id,
            )

            raise

    @staticmethod
    def get_recent_messages(
        db: Session,
        user_id: int,
        limit: int = 20,
    ):
        return (
            db.query(Conversation)
            .filter(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
            .limit(limit)
            .all()
        )
