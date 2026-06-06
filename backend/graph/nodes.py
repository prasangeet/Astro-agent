from langchain_core.messages import SystemMessage

from database import SessionLocal

from services.memory_service import MemoryService
from services.usage_service import UsageService

from core.settings import SYSTEM_PROMPT
from graph.llm import llm_with_tools
from core.logging import logger


def agent_node(state):
    db = SessionLocal()

    try:
        memory = MemoryService.get_memory(
            db=db,
            user_id=state["user_id"],
            request_id=state["request_id"],
        )

        messages = [
            SystemMessage(
                content=f"""
{SYSTEM_PROMPT}

User Memory:
{memory}

Current user id: {state["user_id"]}

IMPORTANT:
- The current user's id is {state["user_id"]}.
- When calling tools that require a user_id,
  always use {state["user_id"]}.
- Never invent a user id.
"""
            ),
            *state["messages"],
        ]

        response = llm_with_tools.invoke(messages)

        logger.info(
            "[%s] Response metadata=%s",
            state["request_id"],
            response.response_metadata,
        )

        usage = response.response_metadata.get(
            "token_usage",
            {},
        )

        UsageService.save_usage(
            db=db,
            request_id=state["request_id"],
            user_id=state["user_id"],
            model="openai/gpt-oss-120b",
            prompt_tokens=usage.get(
                "prompt_tokens",
                0,
            ),
            completion_tokens=usage.get(
                "completion_tokens",
                0,
            ),
            total_tokens=usage.get(
                "total_tokens",
                0,
            ),
        )

        logger.info(
            "[%s] Agent node executed. Tool calls=%s",
            state["request_id"],
            response.tool_calls,
        )

        current_tool_calls = state.get("tool_calls", [])

        new_tool_call = [call["name"] for call in response.tool_calls]

        return {
            "messages": [response],
            "tool_calls": current_tool_calls + new_tool_call,
        }

    finally:
        db.close()
