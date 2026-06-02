from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from models.user import User
from core.logging import logger


class UserService:
    @staticmethod
    def create_user(db: Session, name: str, request_id: str) -> User:
        try:
            logger.info("[%s] Creating user: %s", request_id, name)
            user = User(name=name.strip())

            db.add(user)
            db.commit()
            db.refresh(user)

            logger.info("[%s] User created id=%s", request_id, user.id)

            return user
        except SQLAlchemyError as e:
            db.rollback()
            logger.exception(
                "[%s] Failed creating user",
                request_id,
            )

            raise e

    @staticmethod
    def get_user(db: Session, user_id: int, request_id: str) -> User | None:
        logger.info("[%s] Fetching user=%s", request_id, user_id)

        user = db.query(User).filter(User.id == user_id).first()

        if user:
            logger.info("[%s] Found user%s", request_id, user_id)

        else:
            logger.warning("[%s] User not fount=%s", request_id, user_id)

        return user
