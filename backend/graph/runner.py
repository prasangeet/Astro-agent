from langchain_core.messages import HumanMessage

from graph.astro_graph import graph


def invoke_graph(
    user_id: int,
    request_id: str,
    message: str,
):
    return graph.invoke(
        {
            "user_id": user_id,
            "request_id": request_id,
            "tool_calls": [],
            "messages": [
                HumanMessage(
                    content=message,
                )
            ],
        }
    )
