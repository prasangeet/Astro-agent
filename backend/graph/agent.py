import time
import uuid

from database import SessionLocal

from graph.runner import invoke_graph

from services.conversation_service import ConversationService

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

        return response_text

    except Exception:
        logger.exception(
            "[%s] Agent execution failed",
            request_id,
        )

        raise

    finally:
        db.close()
