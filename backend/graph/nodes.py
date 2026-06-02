from core.logging import logger

from graph.llm import llm_with_tools


def agent_node(state):
    response = llm_with_tools.invoke(state["messages"])

    logger.info(
        "Agent node executed. Tool calls=%s",
        response.tool_calls,
    )

    return {
        "messages": [response],
    }
