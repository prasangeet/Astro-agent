# services/memory_service.py

from sqlalchemy.orm import Session

from core.logging import logger

from models.memory import Memory

from models.conversation import Conversation
from graph.llm import memory_llm


class MemoryService:
    @staticmethod
    def get_memory(
        db: Session,
        user_id: int,
        request_id: str,
    ) -> str:
        try:
            memory = db.query(Memory).filter(Memory.user_id == user_id).first()

            if not memory:
                logger.info(
                    "[%s] No memory found for user=%s",
                    request_id,
                    user_id,
                )

                return ""

            logger.info(
                "[%s] Memory found for user=%s",
                request_id,
                user_id,
            )

            return memory.summary

        except Exception:
            logger.exception(
                "[%s] Failed fetching memory for user=%s",
                request_id,
                user_id,
            )

            raise

    @staticmethod
    def save_memory(
        db: Session,
        user_id: int,
        summary: str,
        request_id: str,
    ) -> Memory:
        try:
            memory = db.query(Memory).filter(Memory.user_id == user_id).first()

            if memory:
                memory.summary = summary

                logger.info(
                    "[%s] Updating memory for user=%s",
                    request_id,
                    user_id,
                )
            else:
                memory = Memory(
                    user_id=user_id,
                    summary=summary,
                )

                db.add(memory)

                logger.info(
                    "[%s] Creating memory for user=%s",
                    request_id,
                    user_id,
                )

            db.commit()
            db.refresh(memory)

            return memory

        except Exception:
            db.rollback()

            logger.exception(
                "[%s] Failed saving memory for user=%s",
                request_id,
                user_id,
            )

            raise

    @staticmethod
    def delete_memory(
        db: Session,
        user_id: int,
        request_id: str,
    ):
        try:
            memory = db.query(Memory).filter(Memory.user_id == user_id).first()

            if not memory:
                return

            db.delete(memory)
            db.commit()

            logger.info(
                "[%s] Deleted memory for user=%s",
                request_id,
                user_id,
            )

        except Exception:
            db.rollback()

            logger.exception(
                "[%s] Failed deleting memory for user=%s",
                request_id,
                user_id,
            )

            raise

    @staticmethod
    def update_memory(
        db: Session,
        user_id: int,
        request_id: str,
    ):
        try:
            logger.info(
                "[%s] Starting memory update for user=%s",
                request_id,
                user_id,
            )

            current_memory = MemoryService.get_memory(
                db=db,
                user_id=user_id,
                request_id=request_id,
            )

            conversations = (
                db.query(Conversation)
                .filter(Conversation.user_id == user_id)
                .order_by(Conversation.created_at.desc())
                .limit(4)
                .all()
            )

            conversations.reverse()

            logger.info(
                "[%s] Loaded %s conversations for memory update",
                request_id,
                len(conversations),
            )

            transcript = "\n".join(f"{c.role}: {c.content}" for c in conversations)

            logger.info(
                "[%s] Transcript length=%s chars",
                request_id,
                len(transcript),
            )

            prompt = f"""
You are maintaining long-term memory for an astrology companion.

Current Memory:
{current_memory}

Recent Conversation:
{transcript}

Update the memory.

Keep:
- recurring interests
- goals
- preferences
- important life context

Remove:
- temporary questions
- one-off requests

Return memory ONLY in the following format:

Interests:
- ...

Goals:
- ...

Preferences:
- ...

Important Context:
- ...
"""

            logger.info(
                "[%s] Generating updated memory",
                request_id,
            )

            summary = memory_llm.invoke(
                prompt,
            ).content.strip()

            if len(summary) > 2000:
                logger.warning(
                    "[%s] Memory exceeded 2000 chars (%s). Truncating.",
                    request_id,
                    len(summary),
                )

                summary = summary[:2000]

            logger.info(
                "[%s] Memory generated. Length=%s chars",
                request_id,
                len(summary),
            )

            MemoryService.save_memory(
                db=db,
                user_id=user_id,
                summary=summary,
                request_id=request_id,
            )

            logger.info(
                "[%s] Memory update completed for user=%s",
                request_id,
                user_id,
            )

        except Exception:
            logger.exception(
                "[%s] Failed updating memory for user=%s",
                request_id,
                user_id,
            )
