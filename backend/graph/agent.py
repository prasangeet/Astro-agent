import time
import uuid

from sqlalchemy import func

from database import SessionLocal

from graph.runner import invoke_graph

from services.conversation_service import ConversationService
from services.memory_service import MemoryService

from models.conversation import Conversation

from core.logging import logger


def run_agent(
    user_id: int,
    message: str,
):
    request_id = str(uuid.uuid4())[:8]

    db = SessionLocal()

    try:
        logger.info(
            "[%s] User=%s Message=%s",
            request_id,
            user_id,
            message,
        )

        start_time = time.perf_counter()

        ConversationService.save_message(
            db=db,
            user_id=user_id,
            role="user",
            content=message,
            request_id=request_id,
        )

        result = invoke_graph(
            user_id=user_id,
            message=message,
            request_id=request_id,
        )

        final_message = result["messages"][-1]

        response_text = final_message.content

        ConversationService.save_message(
            db=db,
            user_id=user_id,
            role="assistant",
            content=response_text,
            request_id=request_id,
        )

        conversation_count = (
            db.query(func.count(Conversation.id))
            .filter(Conversation.user_id == user_id)
            .scalar()
        )

        logger.info(
            "[%s] User=%s has %s stored messages",
            request_id,
            user_id,
            conversation_count,
        )

        if conversation_count and conversation_count % 4 == 0:
            logger.info(
                "[%s] Triggering memory update for user=%s",
                request_id,
                user_id,
            )

            MemoryService.update_memory(
                db=db,
                user_id=user_id,
                request_id=request_id,
            )

        logger.info(
            "[%s] Final response: %s",
            request_id,
            response_text,
        )

        logger.info(
            "[%s] Total execution time: %.2f ms",
            request_id,
            (time.perf_counter() - start_time) * 1000,
        )

        return {
            "response": response_text,
            "tool_calls": result.get(
                "tool_calls",
                [],
            ),
            "request_id": request_id,
        }

    except Exception:
        logger.exception(
            "[%s] Agent execution failed",
            request_id,
        )

        raise

    finally:
        db.close()
