from langchain_core.messages import HumanMessage

from graph.astro_graph import graph


def invoke_graph(
    user_id: int,
    message: str,
):
    result = graph.invoke(
        {
            "user_id": user_id,
            "messages": [
                HumanMessage(
                    content=message,
                )
            ],
        }
    )

    return result
